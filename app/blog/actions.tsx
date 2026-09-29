import { getContentIndex } from "@/lib/content-metadata";

interface GetPostsParams { limit?: number; page?: number; searchTerm?: string; sort?: string }

export interface PostMetadata {
  title: string;
  slug: string;
  description: string;
  date: string;
  formattedDate: string;
  author: string | null;
  tags: string[];
}

function allPosts(): PostMetadata[] {
  return getContentIndex("content").map((entry) => ({
    title: entry.title,
    slug: entry.slug,
    description: entry.description || entry.title,
    date: entry.date,
    formattedDate: entry.formattedDate,
    author: entry.author || null,
    tags: entry.tags || [],
  }));
}

export async function getPosts({ limit, page, searchTerm, sort = "date_asc" }: GetPostsParams) {
  let posts = allPosts();
  if (searchTerm?.trim()) {
    const query = searchTerm.toLocaleLowerCase("pt-BR");
    posts = posts.filter((post) =>
      post.title.toLocaleLowerCase("pt-BR").includes(query) ||
      post.description.toLocaleLowerCase("pt-BR").includes(query) ||
      post.tags.some((tag) => tag.toLocaleLowerCase("pt-BR").includes(query))
    );
  }

  const totalPosts = posts.length;
  const [sortBy, sortOrder] = sort.split("_");
  if (sortBy === "date") {
    posts.sort((a, b) => sortOrder === "asc" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
  }
  const start = ((page ?? 1) - 1) * (limit ?? 10);
  if (limit) posts = posts.slice(start, start + limit);
  return { posts, totalPosts };
}

export async function getRelatedPosts(currentSlug: string, currentTags: string[], limit = 3) {
  return allPosts()
    .filter((post) => post.slug !== currentSlug)
    .map((post) => ({
      post,
      score: post.tags.filter((tag) => currentTags.some((current) => current.toLocaleLowerCase("pt-BR") === tag.toLocaleLowerCase("pt-BR"))).length,
    }))
    .sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date))
    .slice(0, limit)
    .map(({ post }) => post);
}
