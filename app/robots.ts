import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/blog/", "/contact/", "/donate/", "/liturgia/"],
      disallow: [
        "/api/",
        "/error/",
        "/confirm-subscription/",
        "/subscription-confirmed/",
        "/liturgia/hoje",
      ],
    },
    sitemap: "https://www.liturgianews.site/sitemap.xml",
    host: "https://www.liturgianews.site",
  };
}
