import { getPosts } from "@/app/blog/actions";
import { SITE_URL } from "@/lib/seo";

function toMorningBrasiliaUtcString(isoDate: string): string {
  const parsed = new Date(/^\d{4}-\d{2}-\d{2}$/.test(isoDate) ? `${isoDate}T06:00:00-03:00` : isoDate);
  return parsed.toUTCString();
}

export async function GET() {
  const { posts } = await getPosts({ limit: 20, sort: "date_desc" });

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>LiturgiaNews - Blog</title>
    <description>Reflexões, ensinamentos e inspiração católica para sua jornada de fé</description>
    <link>${SITE_URL}/blog</link>
    <language>pt-BR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/images/android-chrome-192x192.png</url>
      <title>LiturgiaNews</title>
      <link>${SITE_URL}</link>
    </image>
    ${posts
      .map(
        (post) => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <pubDate>${toMorningBrasiliaUtcString(post.date)}</pubDate>
      ${post.tags.map((tag) => `<category><![CDATA[${tag}]]></category>`).join("\n      ")}
    </item>`
      )
      .join("\n")}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
