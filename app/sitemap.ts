import { getContentIndex } from "@/lib/content-metadata";
import { getLiturgicalDate, MONTH_NAMES } from "@/lib/liturgical-date";
import type { MetadataRoute } from "next";

const baseUrl = "https://www.liturgianews.site";

export default function sitemap(): MetadataRoute.Sitemap {
  const today = getLiturgicalDate();
  const liturgies = getContentIndex("liturgia-content");
  const blogPosts = getContentIndex("content");
  const months = new Map<string, string>();

  for (const entry of liturgies) {
    const [year, month] = entry.date.split("-").map(Number);
    const route = `${year}/${MONTH_NAMES[month - 1]}`;
    if (!months.has(route) || entry.date > months.get(route)!)
      months.set(route, entry.date);
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: today.iso,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/liturgia`,
      lastModified: today.iso,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: today.iso,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/liturgia/hoje`,
      lastModified: today.iso,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/acompanhar`,
      lastModified: "2026-09-28",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/lectio-divina`,
      lastModified: "2026-09-28",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tempo-liturgico`,
      lastModified: "2026-09-28",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: "2026-01-01",
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacidade`,
      lastModified: "2026-01-01",
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: "2026-01-01",
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/donate`,
      lastModified: "2026-01-01",
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  const liturgyRoutes: MetadataRoute.Sitemap = liturgies.map((entry) => ({
    url: `${baseUrl}/liturgia/${entry.slug}`,
    lastModified: entry.date,
    changeFrequency:
      entry.date === today.iso
        ? "daily"
        : entry.date < today.iso
          ? "yearly"
          : undefined,
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((entry) => ({
    url: `${baseUrl}/blog/${entry.slug}`,
    lastModified: entry.date,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const calendarRoutes: MetadataRoute.Sitemap = Array.from(
    months,
    ([route, lastModified]) => ({
      url: `${baseUrl}/liturgia/calendario/${route}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }),
  );

  return [...staticRoutes, ...blogRoutes, ...liturgyRoutes, ...calendarRoutes];
}
