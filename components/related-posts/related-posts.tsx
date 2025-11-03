import { PostCard } from "@/components/post-card/post-card";
import { PostMetadata } from "@/app/blog/actions";
import Link from "next/link";

interface RelatedPostsProps {
  posts: PostMetadata[];
  currentSlug: string;
  className?: string;
}

export function RelatedPosts({
  posts,
  currentSlug,
  className = "",
}: RelatedPostsProps) {
  // Filter out current post and limit to 3
  const relatedPosts = posts
    .filter((post) => post.slug !== currentSlug)
    .slice(0, 3);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section
      className={`mt-12 pt-8 border-t border-amber-200 ${className}`}
      aria-label="Posts relacionados"
    >
      <h2 className="text-2xl font-serif font-semibold text-slate-800 mb-6">
        Posts Relacionados
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link
          href="/blog"
          className="text-amber-700 hover:text-amber-900 underline font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
        >
          Ver todos os posts →
        </Link>
      </div>
    </section>
  );
}

