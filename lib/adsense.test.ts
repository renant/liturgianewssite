import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  buildAdSenseMetaOther,
  buildAdsTxt,
  DEFAULT_ADSENSE_CLIENT_ID,
  DEFAULT_ADSENSE_SLOT_LITURGY_BOTTOM,
  DEFAULT_ADSENSE_SLOT_LITURGY_MID,
  getAdSenseConfig,
  isLocalHostname,
  parseAdSenseIds,
  parseAdSenseSlot,
} from "./adsense.ts";
import { GET as getAdsTxt } from "../app/ads.txt/route.ts";

test("parseAdSenseIds normaliza ca-pub e pub de 16 dígitos e rejeita placeholders", () => {
  assert.deepEqual(parseAdSenseIds("ca-pub-9729996201347510"), {
    clientId: "ca-pub-9729996201347510",
    publisherId: "pub-9729996201347510",
  });
  assert.deepEqual(parseAdSenseIds("  pub-9729996201347510  "), {
    clientId: "ca-pub-9729996201347510",
    publisherId: "pub-9729996201347510",
  });
  assert.deepEqual(parseAdSenseIds("XXXXXX"), { clientId: null, publisherId: null });
  assert.deepEqual(parseAdSenseIds("ca-pub-123"), { clientId: null, publisherId: null });
  assert.deepEqual(parseAdSenseIds("off"), { clientId: null, publisherId: null });
  assert.deepEqual(parseAdSenseIds(""), { clientId: null, publisherId: null });
});

test("parseAdSenseSlot aceita IDs numéricos reais do AdSense e rejeita valores inválidos", () => {
  assert.equal(parseAdSenseSlot("7536712146"), "7536712146");
  assert.equal(parseAdSenseSlot(" 1431514972 "), "1431514972");
  assert.equal(parseAdSenseSlot("XXXX"), null);
  assert.equal(parseAdSenseSlot("123"), null);
  assert.equal(parseAdSenseSlot("off"), null);
  assert.equal(parseAdSenseSlot(""), null);
});

test("getAdSenseConfig usa o publisher e os dois slots reais como padrão e aceita overrides", () => {
  const defaultCfg = getAdSenseConfig();
  assert.equal(defaultCfg.clientId, DEFAULT_ADSENSE_CLIENT_ID);
  assert.equal(defaultCfg.publisherId, "pub-9729996201347510");
  assert.equal(defaultCfg.midSlot, DEFAULT_ADSENSE_SLOT_LITURGY_MID);
  assert.equal(defaultCfg.bottomSlot, DEFAULT_ADSENSE_SLOT_LITURGY_BOTTOM);

  const customCfg = getAdSenseConfig({
    clientId: "pub-1111222233334444",
    midSlot: "1122334455",
    bottomSlot: "6677889900",
    preview: "true",
    nodeEnv: "development",
  });
  assert.equal(customCfg.clientId, "ca-pub-1111222233334444");
  assert.equal(customCfg.publisherId, "pub-1111222233334444");
  assert.equal(customCfg.midSlot, "1122334455");
  assert.equal(customCfg.bottomSlot, "6677889900");
  assert.equal(customCfg.previewEnabled, true);
});

test("rota /ads.txt responde no padrão IAB/Google AdSense com publisher ID real", async () => {
  const expected = "google.com, pub-9729996201347510, DIRECT, f08c47fec0942fa0\n";
  assert.equal(buildAdsTxt("pub-9729996201347510"), expected);

  const res = getAdsTxt();
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("content-type"), "text/plain; charset=utf-8");
  assert.equal(await res.text(), expected);
});

test("isLocalHostname identifica ambientes locais sem bloquear domínios públicos", () => {
  assert.equal(isLocalHostname("localhost"), true);
  assert.equal(isLocalHostname("127.0.0.1"), true);
  assert.equal(isLocalHostname("[::1]"), true);
  assert.equal(isLocalHostname("dev.local"), true);
  assert.equal(isLocalHostname("www.liturgianews.site"), false);
  assert.equal(isLocalHostname("liturgianews.site"), false);
});

test("buildAdSenseMetaOther e RootLayout expõem google-adsense-account sem injetar script global", () => {
  assert.deepEqual(buildAdSenseMetaOther(DEFAULT_ADSENSE_CLIENT_ID), {
    "google-adsense-account": "ca-pub-9729996201347510",
  });
  assert.equal(buildAdSenseMetaOther(null), undefined);

  const layoutSource = fs.readFileSync(path.join(process.cwd(), "app", "layout.tsx"), "utf8");
  assert.equal(layoutSource.includes("buildAdSenseMetaOther"), true);
  assert.equal(layoutSource.includes("adsbygoogle.js"), false);
  assert.equal(layoutSource.includes("AdSenseScript"), false);
});

test("LiturgyPage carrega AdSenseScript e posiciona blocos apenas nas páginas de leitura", () => {
  const liturgyPageSource = fs.readFileSync(
    path.join(process.cwd(), "components", "liturgy", "liturgy-page.tsx"),
    "utf8",
  );
  assert.equal(liturgyPageSource.includes("<AdSenseScript />"), true);
  assert.equal(liturgyPageSource.includes('position="after-reflection"'), true);
  assert.equal(liturgyPageSource.includes('position="after-reading"'), true);
});

test("Política de Privacidade divulga uso do Google AdSense e links oficiais de controle de anúncios", () => {
  const privacySource = fs.readFileSync(
    path.join(process.cwd(), "app", "privacidade", "page.tsx"),
    "utf8",
  );
  assert.equal(privacySource.includes("Google AdSense"), true);
  assert.equal(privacySource.includes("https://adssettings.google.com"), true);
  assert.equal(privacySource.includes("https://policies.google.com/technologies/partner-sites"), true);
});
