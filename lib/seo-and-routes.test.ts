import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { buildPageMetadata, DEFAULT_OG_IMAGE, SITE_URL } from "./seo.ts";
import { getLiturgicalDate } from "./liturgical-date.ts";
import { getContentIndex, getContentSlugSet } from "./content-metadata.ts";
import securityHeaders from "../headers.ts";
import robots from "../app/robots.ts";
import sitemap from "../app/sitemap.ts";
import { GET as getBlogFeed } from "../app/feed.xml/route.ts";
import { GET as getLiturgyFeed } from "../app/liturgia/feed.xml/route.ts";
import { metadata as homeMetadata } from "../app/(app)/page.tsx";
import { metadata as liturgyIndexMetadata } from "../app/liturgia/page.tsx";
import { metadata as acompanharMetadata } from "../app/acompanhar/page.tsx";
import { metadata as lectioMetadata } from "../app/lectio-divina/page.tsx";
import { metadata as tempoMetadata } from "../app/tempo-liturgico/page.tsx";
import { metadata as sobreMetadata } from "../app/sobre/page.tsx";
import { metadata as contactMetadata } from "../app/contact/page.tsx";
import { metadata as donateMetadata } from "../app/donate/page.tsx";
import { metadata as privacidadeMetadata } from "../app/privacidade/page.tsx";
import { generateMetadata as generateBlogMetadata } from "../app/blog/page.tsx";

test("buildPageMetadata preenche canonical, OpenGraph 1200x630 e Twitter card sem perder propriedades", () => {
  const meta = buildPageMetadata({
    title: "Página de Teste",
    description: "Descrição de teste para validação.",
    path: "/acompanhar",
    type: "article",
  });

  assert.equal(meta.alternates?.canonical, `${SITE_URL}/acompanhar`);
  assert.deepEqual(meta.openGraph, {
    title: "Página de Teste",
    description: "Descrição de teste para validação.",
    url: `${SITE_URL}/acompanhar`,
    siteName: "LiturgiaNews",
    locale: "pt_BR",
    type: "article",
    images: [DEFAULT_OG_IMAGE],
  });
  assert.deepEqual(meta.twitter, {
    card: "summary_large_image",
    title: "Página de Teste",
    description: "Descrição de teste para validação.",
    images: [DEFAULT_OG_IMAGE.url],
  });
});

test("todas as rotas estáticas exportam OpenGraph 1200x630 e canonical próprio", () => {
  const pages = [
    { meta: homeMetadata, url: SITE_URL },
    { meta: liturgyIndexMetadata, url: `${SITE_URL}/liturgia` },
    { meta: acompanharMetadata, url: `${SITE_URL}/acompanhar` },
    { meta: lectioMetadata, url: `${SITE_URL}/lectio-divina` },
    { meta: tempoMetadata, url: `${SITE_URL}/tempo-liturgico` },
    { meta: sobreMetadata, url: `${SITE_URL}/sobre` },
    { meta: contactMetadata, url: `${SITE_URL}/contact` },
    { meta: donateMetadata, url: `${SITE_URL}/donate` },
    { meta: privacidadeMetadata, url: `${SITE_URL}/privacidade` },
  ];

  for (const { meta, url } of pages) {
    assert.equal(meta.alternates?.canonical, url);
    assert.equal(meta.openGraph?.url, url);
    assert.deepEqual(meta.openGraph?.images, [DEFAULT_OG_IMAGE]);
    assert.equal(meta.twitter && "card" in meta.twitter ? meta.twitter.card : undefined, "summary_large_image");
  }
});

test("blog preserva canonical paginado e aplica noindex em buscas", async () => {
  const page1 = await generateBlogMetadata({ searchParams: Promise.resolve({}) });
  assert.equal(page1.alternates?.canonical, `${SITE_URL}/blog`);
  assert.equal(page1.robots, undefined);

  const page2 = await generateBlogMetadata({ searchParams: Promise.resolve({ page: "2" }) });
  assert.equal(page2.alternates?.canonical, `${SITE_URL}/blog?page=2`);

  const filtered = await generateBlogMetadata({ searchParams: Promise.resolve({ search: "quaresma" }) });
  assert.equal(filtered.alternates?.canonical, `${SITE_URL}/blog`);
  assert.deepEqual(filtered.robots, { index: false, follow: true });
});

test("robots.txt permite rastreamento global e bloqueia /api/", () => {
  const rules = robots();
  assert.equal(rules.sitemap, `${SITE_URL}/sitemap.xml`);
  assert.equal(rules.host, SITE_URL);
  assert.deepEqual(rules.rules, {
    userAgent: "*",
    allow: "/",
    disallow: ["/api/"],
  });
});

test("sitemap inclui rotas principais/guias, exclui rotas noindex e nunca emite lastModified futuro", () => {
  const entries = sitemap();
  const urls = new Set(entries.map((entry) => entry.url));
  const nowMs = Date.now();

  for (const required of [
    SITE_URL,
    `${SITE_URL}/liturgia`,
    `${SITE_URL}/liturgia/hoje`,
    `${SITE_URL}/blog`,
    `${SITE_URL}/acompanhar`,
    `${SITE_URL}/lectio-divina`,
    `${SITE_URL}/tempo-liturgico`,
    `${SITE_URL}/sobre`,
    `${SITE_URL}/contact`,
    `${SITE_URL}/donate`,
    `${SITE_URL}/privacidade`,
  ]) {
    assert.equal(urls.has(required), true, `Faltando ${required} no sitemap`);
  }

  assert.equal(urls.has(`${SITE_URL}/confirm-subscription`), false);
  assert.equal(urls.has(`${SITE_URL}/subscription-confirmed`), false);
  assert.equal(urls.has(`${SITE_URL}/error`), false);

  for (const item of entries) {
    if (!item.lastModified) continue;
    const parsed = Date.parse(String(item.lastModified));
    assert.equal(Number.isFinite(parsed), true);
    assert.equal(parsed <= nowMs + 86_400_000, true);
  }
});

test("feeds RSS servem XML válido com pubDate no mesmo dia civil em America/Sao_Paulo e sem liturgias futuras", async () => {
  const todayIso = getLiturgicalDate().iso;
  const [blogRes, liturgyRes] = await Promise.all([getBlogFeed(), getLiturgyFeed()]);

  assert.equal(blogRes.headers.get("content-type")?.includes("application/xml"), true);
  assert.equal(liturgyRes.headers.get("content-type")?.includes("application/xml"), true);

  const blogXml = await blogRes.text();
  const liturgyXml = await liturgyRes.text();

  assert.equal(blogXml.includes('<rss version="2.0"'), true);
  assert.equal(liturgyXml.includes('<rss version="2.0"'), true);

  const itemMatches = Array.from(
    liturgyXml.matchAll(/<link>https:\/\/www\.liturgianews\.site\/liturgia\/([^<]+)<\/link>[\s\S]*?<pubDate>([^<]+)<\/pubDate>/g),
  );
  assert.equal(itemMatches.length > 0, true);

  const indexBySlug = new Map(getContentIndex("liturgia-content").map((entry) => [entry.slug, entry]));
  for (const [, slug, pubDate] of itemMatches) {
    const entry = indexBySlug.get(slug);
    assert.ok(entry);
    assert.equal(entry.date <= todayIso, true);
    const localDate = getLiturgicalDate(new Date(pubDate)).iso;
    assert.equal(localDate, entry.date);
  }
});

test("manifest.json referencia apenas ícones existentes com dimensões reais correspondentes e purpose válido", () => {
  const manifestPath = path.join(process.cwd(), "public", "manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

  assert.equal(manifest.theme_color, "#fffbeb");
  assert.equal(Array.isArray(manifest.icons), true);
  assert.equal(manifest.icons.length >= 2, true);

  for (const icon of manifest.icons) {
    assert.equal(icon.purpose.includes("any maskable"), false);
    const iconPath = path.join(process.cwd(), "public", icon.src.replace(/^\//, ""));
    assert.equal(fs.existsSync(iconPath), true);
    const buf = fs.readFileSync(iconPath);
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);
    assert.equal(`${width}x${height}`, icon.sizes);
  }
});

test("securityHeaders inclui HSTS, X-Content-Type-Options, X-Frame-Options, Permissions-Policy e Referrer-Policy", () => {
  const keys = new Map(securityHeaders.map((header) => [header.key, header.value]));
  assert.equal(keys.get("Strict-Transport-Security")?.includes("max-age="), true);
  assert.equal(keys.get("X-Content-Type-Options"), "nosniff");
  assert.equal(keys.get("X-Frame-Options"), "SAMEORIGIN");
  assert.equal(keys.get("Permissions-Policy")?.includes("camera=()"), true);
  assert.equal(keys.get("Referrer-Policy"), "strict-origin-when-cross-origin");
  assert.equal(keys.has("X-XSS-Protection"), false);
});

test("getContentSlugSet retorna exatamente os mesmos slugs do índice cacheado", () => {
  const index = getContentIndex("liturgia-content");
  const slugSet = getContentSlugSet("liturgia-content");
  assert.equal(slugSet.size, index.length);
  for (const item of index) {
    assert.equal(slugSet.has(item.slug), true);
  }
});
