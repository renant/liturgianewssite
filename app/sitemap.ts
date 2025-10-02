import { MetadataRoute } from "next";
import fs from "node:fs";
import path from "node:path";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const contentDir = path.join(process.cwd(), "content");
  const liturgiaDir = path.join(process.cwd(), "liturgia-content");

  // Get blog posts
  const blogFiles = fs
    .readdirSync(contentDir)
    .filter((file) => file.endsWith(".mdx"));

  const blogRoutes = blogFiles.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const stats = fs.statSync(path.join(contentDir, file));
    return {
      url: `https://www.liturgianews.site/blog/${slug}`,
      lastModified: stats.mtime,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    };
  });

  // Get liturgia posts
  const liturgiaFiles = fs
    .readdirSync(liturgiaDir)
    .filter((file) => file.endsWith(".mdx"));

  const liturgiaRoutes = liturgiaFiles.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const stats = fs.statSync(path.join(liturgiaDir, file));
    return {
      url: `https://www.liturgianews.site/liturgia/${slug}`,
      lastModified: stats.mtime,
      changeFrequency: "daily" as const,
      priority: 0.8,
    };
  });

  const liturgiaHojeRoutes = {
    url: `https://www.liturgianews.site/liturgia/hoje`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  };

  // Define static routes with specific priorities
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: "https://www.liturgianews.site",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: "https://www.liturgianews.site/blog",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://www.liturgianews.site/liturgia",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://www.liturgianews.site/contact",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: "https://www.liturgianews.site/donate",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  return [
    ...staticRoutes,
    ...blogRoutes,
    ...liturgiaRoutes,
    liturgiaHojeRoutes,
  ];
}
