import type { HTMLAttributes } from "react";

export const liturgyMdxComponents = {
  h1: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-8 mb-4 text-3xl font-serif font-semibold text-amber-800 tracking-tight" {...props} />
  ),
};
