import fs from "node:fs";
import path from "node:path";

export default async function sitemap() {
  path.join(process.cwd(), "content");

  const files = fs.readdirSync(path.join(process.cwd(), "content"));
  const slugs = files.map((file) => ({
    slug: file.replace(/\.mdx$/, ""),
  }));

  const blogRoutes = await Promise.all(
    slugs.map(async ({ slug }) => {
      return {
        url: `https://www.liturgianews.site/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      };
    })
  );

  const routes = ["", "contact", "donate", "blog"].map((route) => {
    return {
      url: `https://www.liturgianews.site/${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    };
  });

  return [...routes, ...blogRoutes];
}
