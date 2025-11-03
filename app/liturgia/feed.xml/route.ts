import { getLiturgia } from "@/app/liturgia/actions";

export async function GET() {
  const { liturgias } = await getLiturgia({ limit: 30, sort: "date_desc" });

  const baseUrl = "https://www.liturgianews.site";
  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>LiturgiaNews - Liturgia Católica Diária</title>
    <description>Liturgia católica diária com leituras, reflexões e orações</description>
    <link>${baseUrl}/liturgia</link>
    <language>pt-BR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/liturgia/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/images/android-chrome-192x192.png</url>
      <title>LiturgiaNews</title>
      <link>${baseUrl}</link>
    </image>
    ${liturgias
      .map(
        (liturgia) => `    <item>
      <title><![CDATA[${liturgia.title}]]></title>
      <description><![CDATA[Liturgia católica do dia ${liturgia.formattedDate}]]></description>
      <link>${baseUrl}/liturgia/${liturgia.slug}</link>
      <guid isPermaLink="true">${baseUrl}/liturgia/${liturgia.slug}</guid>
      <pubDate>${new Date(liturgia.date).toUTCString()}</pubDate>
      <category>Liturgia</category>
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

