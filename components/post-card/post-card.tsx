import { CalendarIcon, UserIcon } from "lucide-react";

import { PostMetadata } from "@/app/blog/actions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export function PostCard({ post }: { post: PostMetadata }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="flex flex-col h-full shadow-lg hover:shadow-xl hover:scale-105 transition-all transform duration-300 ease-in-out">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-amber-700 hover:text-amber-900 transition-colors duration-300">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-slate-600">{post.description}</p>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-2">
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <CalendarIcon className="w-4 h-4" />
            <span>{new Date(post.date).toLocaleDateString("pt-BR")}</span>
          </div>
          {post.author && (
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <UserIcon className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
