import type { PostMetadata } from "@/app/blog/actions";
import Link from "next/link";

export function PostCard({ post }: { post: PostMetadata }) {
  return <article className="border-b border-amber-200/70 pb-7">
    <time dateTime={post.date} className="text-sm text-slate-500">{post.formattedDate}</time>
    <h2 className="mt-3 font-serif text-2xl font-semibold leading-snug text-slate-900"><Link href={`/blog/${post.slug}`} className="decoration-amber-700/50 underline-offset-4 hover:text-amber-800 hover:underline">{post.title}</Link></h2>
    <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">{post.description}</p>
    {post.author && <p className="mt-3 text-sm text-slate-600">Por {post.author}</p>}
    {post.tags.length > 0 && <p className="mt-4 text-xs leading-relaxed text-amber-800">{post.tags.slice(0,3).join(" · ")}</p>}
  </article>;
}
