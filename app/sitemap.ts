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

  path.join(process.cwd(), "liturgia-content");
  const liturgiaFiles = fs.readdirSync(
    path.join(process.cwd(), "liturgia-content")
  );
  const liturgiaSlugs = liturgiaFiles.map((file) => ({
    slug: file.replace(/\.mdx$/, ""),
  }));

  const liturgiaRoutes = await Promise.all(
    liturgiaSlugs.map(async ({ slug }) => {
      return {
        url: `https://www.liturgianews.site/liturgia/${slug}`,
        lastModified: new Date(),
        changeFrequency: "daily",
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

  return [...routes, ...blogRoutes, ...liturgiaRoutes];
}
