import type { MDXComponents } from "mdx/types";
import type { AnchorHTMLAttributes, HTMLAttributes } from "react";
import Link from "next/link";

const customComponents = {
  a: ({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (href?.startsWith("/") || href?.startsWith("#")) return <Link href={href} {...props}>{children}</Link>;
    return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
  },
  table: (props: HTMLAttributes<HTMLTableElement>) => <div className="max-w-full overflow-x-auto"><table {...props} /></div>,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...customComponents, ...components };
}
