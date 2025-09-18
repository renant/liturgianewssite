import { getPosts, type PostMetadata } from "@/app/blog/actions";
import { getLiturgia, type LiturgiaMetadata } from "@/app/liturgia/actions";

export const revalidate = 600; // 10 minutes

function escapeCdata(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const siteUrl = "https://www.liturgianews.site";

  const [blogResult, liturgiaResult] = await Promise.all([
    getPosts({ limit: 20, page: 1, sort: "date_desc" }),
    getLiturgia({ limit: 20, page: 1, sort: "date_desc" }),
  ]);

  const blogItems = (blogResult.posts as PostMetadata[]).map((post) => {
    const url = `${siteUrl}/blog/${post.slug}`;
    const pubDate = new Date(post.date).toUTCString();
    const description = post.description || post.title;
    return `
      <item>
        <title>${escapeCdata(post.title)}</title>
        <link>${url}</link>
        <guid isPermaLink="true">${url}</guid>
        <pubDate>${pubDate}</pubDate>
        <description><![CDATA[${description}]]></description>
      </item>`;
  });

  const liturgiaItems = (liturgiaResult.liturgias as LiturgiaMetadata[]).map(
    (l) => {
      const url = `${siteUrl}/liturgia/${l.slug}`;
      const pubDate = new Date(l.date).toUTCString();
      const description = l.title;
      return `
      <item>
        <title>${escapeCdata(l.title)}</title>
        <link>${url}</link>
        <guid isPermaLink="true">${url}</guid>
        <pubDate>${pubDate}</pubDate>
        <description><![CDATA[${description}]]></description>
      </item>`;
    }
  );

  const itemsXml = [...blogItems, ...liturgiaItems].join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>LiturgiaNews - Atualizações</title>
      <link>${siteUrl}</link>
      <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
      <description>Liturgia Católica Diária e artigos do blog</description>
      <language>pt-BR</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      ${itemsXml}
    </channel>
  </rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
    },
  });
}

