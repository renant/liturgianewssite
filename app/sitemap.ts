import { getContentIndex } from "@/lib/content-metadata";
import { getLiturgicalDate, MONTH_NAMES } from "@/lib/liturgical-date";
import { contentModifiedAt } from "@/lib/content-dates";
import { SITE_URL } from "@/lib/seo";
import type { MetadataRoute } from "next";

export const revalidate = 300;

export default function sitemap(): MetadataRoute.Sitemap {
  const today = getLiturgicalDate();
  const liturgies = getContentIndex("liturgia-content");
  const blogPosts = getContentIndex("content");
  const months = new Map<string, string | undefined>();

  for (const entry of liturgies) {
    const [year, month] = entry.date.split("-").map(Number);
    const route = `${year}/${MONTH_NAMES[month - 1]}`;
    const modified = contentModifiedAt(entry);
    if (!months.has(route) || (modified && (!months.get(route) || modified > months.get(route)!))) months.set(route, modified);
  }

  const latestBlogModified = blogPosts
    .map((entry) => contentModifiedAt(entry))
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1) ?? "2026-10-14";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: today.iso,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/liturgia`,
      lastModified: today.iso,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: latestBlogModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/liturgia/hoje`,
      lastModified: today.iso,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/acompanhar`,
      lastModified: "2026-10-29",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/lectio-divina`,
      lastModified: "2026-10-29",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/tempo-liturgico`,
      lastModified: "2026-10-29",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/sobre`,
      lastModified: "2026-10-14",
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacidade`,
      lastModified: "2026-10-14",
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: "2026-10-14",
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/donate`,
      lastModified: "2026-10-14",
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  const liturgyRoutes: MetadataRoute.Sitemap = liturgies.map((entry) => ({
    url: `${SITE_URL}/liturgia/${entry.slug}`,
    lastModified: contentModifiedAt(entry),
    changeFrequency:
      entry.date === today.iso
        ? "daily"
        : entry.date < today.iso
          ? "yearly"
          : undefined,
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((entry) => ({
    url: `${SITE_URL}/blog/${entry.slug}`,
    lastModified: contentModifiedAt(entry),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const calendarRoutes: MetadataRoute.Sitemap = Array.from(
    months,
    ([route, lastModified]) => ({
      url: `${SITE_URL}/liturgia/calendario/${route}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }),
  );

  return [...staticRoutes, ...blogRoutes, ...liturgyRoutes, ...calendarRoutes];
}
