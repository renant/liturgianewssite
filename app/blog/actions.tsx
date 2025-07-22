import fs from "node:fs";
import path from "node:path";

interface GetPostsParams {
  limit?: number;
  page?: number;
  searchTerm?: string;
  sort?: string;
}

export interface PostMetadata {
  title: string;
  slug: string;
  description: string;
  date: Date;
  formattedDate: string;
  author: string | string[] | null;
  tags: string[];
}

export async function getPosts({
  limit,
  page,
  searchTerm,
  sort = "date_asc",
}: GetPostsParams) {
  path.join(process.cwd(), "content");

  const files = fs.readdirSync(path.join(process.cwd(), "content"));
  const slugs = files.map((file) => ({
    slug: file.replace(/\.mdx$/, ""),
  }));

  let posts = await Promise.all(
    slugs.map(async ({ slug }) => {
      const metadata = await loadMdxMetadata(slug);
      return metadata;
    })
  );

  posts = posts.filter((post) => post !== null) as PostMetadata[];

  if (searchTerm && searchTerm.trim() !== "") {
    posts = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }

  const totalPosts = posts.length;
  const [sortBy, sortOrder] = sort.split("_");

  posts.sort((a: PostMetadata, b: PostMetadata) => {
    if (sortBy === "date") {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (Number.isNaN(dateA.getTime()) || Number.isNaN(dateB.getTime())) {
        console.error("Invalid date found", {
          dateA: a.date,
          dateB: b.date,
        });
        return 0;
      }

      return sortOrder === "asc"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    }

    return 0;
  });

  for (const post of posts) {
    const date = new Date(post.date);
    post.formattedDate = date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const start = ((page ?? 1) - 1) * (limit ?? 10);

  if (limit) {
    posts = posts.slice(start, start + limit);
  }

  return { posts, totalPosts };
}

async function loadMdxMetadata(slug: string): Promise<PostMetadata | null> {
  try {
    const mdxPath = path.join(process.cwd(), "content", `${slug}.mdx`);

    if (!fs.existsSync(mdxPath)) {
      return null;
    }
    const { metadata } = await import(`@/content/${slug}.mdx`);
    return {
      ...metadata,
      slug,
    } as PostMetadata;
  } catch (error) {
    console.error("Failed to load MDX file:", error);
    return null;
  }
}
