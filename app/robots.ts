import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/error/",
          "/confirm-subscription/",
          "/subscription-confirmed/",
          "/_next/",
          "/404",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/blog/", "/contact/", "/donate/", "/liturgia/"],
        crawlDelay: 0,
      },
    ],
    sitemap: "https://www.liturgianews.site/sitemap.xml",
    host: "https://www.liturgianews.site",
  };
}
