import { CalendarIcon, UserIcon } from "lucide-react";
import Link from "next/link";

import { PostMetadata } from "@/app/blog/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function PostCard({ post }: { post: PostMetadata }) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-xl font-serif">{post.title}</CardTitle>
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
        <Button asChild className="mt-4">
          <Link href={`/blog/${post.slug}`}>Ler mais</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
