import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/confirm-subscript/",
          "/api/",
          "/error/",
          "/subscription-confirmed/",
        ],
      },
      {
        userAgent: "*",
        allow: ["/contact/", "/donate/", "/"],
      },
    ],
    sitemap: "https://www.liturgianews.site/sitemap.xml",
    host: "https://www.liturgianews.site",
  };
}
