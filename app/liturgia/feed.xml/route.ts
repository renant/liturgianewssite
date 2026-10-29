import { getLiturgia } from "@/app/liturgia/actions";
import { SITE_URL } from "@/lib/seo";

function toMorningBrasiliaUtcString(isoDate: string): string {
  const parsed = new Date(/^\d{4}-\d{2}-\d{2}$/.test(isoDate) ? `${isoDate}T06:00:00-03:00` : isoDate);
  return parsed.toUTCString();
}

export async function GET() {
  const { liturgias } = await getLiturgia({ limit: 30, sort: "date_desc" });

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>LiturgiaNews - Liturgia Católica Diária</title>
    <description>Liturgia católica diária com leituras, reflexões e orações</description>
    <link>${SITE_URL}/liturgia</link>
    <language>pt-BR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/liturgia/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/images/android-chrome-192x192.png</url>
      <title>LiturgiaNews</title>
      <link>${SITE_URL}</link>
    </image>
    ${liturgias
      .map(
        (liturgia) => `    <item>
      <title><![CDATA[Liturgia de ${liturgia.formattedDate} — ${liturgia.title}]]></title>
      <description><![CDATA[Liturgia católica do dia ${liturgia.formattedDate}: ${liturgia.title}.]]></description>
      <link>${SITE_URL}/liturgia/${liturgia.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/liturgia/${liturgia.slug}</guid>
      <pubDate>${toMorningBrasiliaUtcString(liturgia.date)}</pubDate>
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
