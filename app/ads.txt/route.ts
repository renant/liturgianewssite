import { buildAdsTxt, getAdSenseConfig } from "@/lib/adsense";

export function GET() {
  const { publisherId } = getAdSenseConfig();

  if (!publisherId) {
    return new Response("Not Found\n", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  return new Response(buildAdsTxt(publisherId), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
