export default async function sitemap() {
  const routes = ["", "contact", "donate"].map((route) => {
    return {
      url: `https://www.liturgianews.site/${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    };
  });

  return [...routes];
}
