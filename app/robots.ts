import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/blog/", "/contact/", "/donate/", "/liturgia/", "/liturgia/hoje"],
      disallow: [
        "/api/",
      ],
    },
    sitemap: "https://www.liturgianews.site/sitemap.xml",
    host: "https://www.liturgianews.site",
  };
}
