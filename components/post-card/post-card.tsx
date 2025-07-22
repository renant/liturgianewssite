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
  const formattedDate = new Date(post.date).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article 
      className="h-full"
      itemScope 
      itemType="https://schema.org/BlogPosting"
    >
      <Link 
        href={`/blog/${post.slug}`}
        className="block h-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-lg"
        aria-label={`Ler artigo: ${post.title}`}
      >
        <Card className="flex flex-col h-full shadow-lg hover:shadow-xl hover:scale-105 transition-all transform duration-300 ease-in-out">
          <CardHeader>
            <CardTitle 
              className="text-xl font-serif text-amber-700 hover:text-amber-900 transition-colors duration-300"
              itemProp="headline"
            >
              {post.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-slate-600" itemProp="description">
              {post.description}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <CalendarIcon className="w-4 h-4" aria-hidden="true" />
              <time 
                dateTime={post.date} 
                itemProp="datePublished"
                aria-label={`Publicado em ${formattedDate}`}
              >
                {formattedDate}
              </time>
            </div>
            {post.author && (
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <UserIcon className="w-4 h-4" aria-hidden="true" />
                <span itemProp="author" itemScope itemType="https://schema.org/Person">
                  <span itemProp="name">{post.author}</span>
                </span>
              </div>
            )}
          </CardFooter>
          <meta itemProp="url" content={`https://www.liturgianews.site/blog/${post.slug}`} />
          <meta itemProp="inLanguage" content="pt-BR" />
        </Card>
      </Link>
    </article>
  );
}
