import assert from "node:assert/strict";
import test from "node:test";
import { detectSyntheticTraffic } from "./bot-detection.ts";

test("webdriver verdadeiro gera skip", () => {
  const result = detectSyntheticTraffic({
    webdriver: true,
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36",
    languages: ["pt-BR", "pt"],
    viewportWidth: 360,
    referrer: "",
    pathname: "/",
    now: new Date("2026-11-03T14:00:00Z"),
  });
  assert.equal(result.skip, true);
  assert.equal(result.suspect, false);
  assert.ok(result.reasons.includes("webdriver"));
});

test("userAgent de Lighthouse ou bot gera skip", () => {
  for (const ua of [
    "Mozilla/5.0 (Macintosh) Chrome-Lighthouse",
    "Mozilla/5.0 HeadlessChrome/130.0.0.0",
    "Googlebot/2.1 (+http://www.google.com/bot.html)",
    "PTST/2309",
    "GTmetrix",
  ]) {
    const result = detectSyntheticTraffic({
      webdriver: false,
      userAgent: ua,
      languages: ["pt-BR"],
      viewportWidth: 1366,
      referrer: "",
      pathname: "/",
      now: new Date("2026-11-03T14:00:00Z"),
    });
    assert.equal(result.skip, true, `Esperado skip para UA: ${ua}`);
    assert.ok(result.reasons.includes("bot_user_agent"));
  }
});

test("navigator.languages vazio gera skip", () => {
  const result = detectSyntheticTraffic({
    webdriver: false,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0.0.0",
    languages: [],
    viewportWidth: 1366,
    referrer: "",
    pathname: "/",
    now: new Date("2026-11-03T14:00:00Z"),
  });
  assert.equal(result.skip, true);
  assert.ok(result.reasons.includes("empty_languages"));
});

test("janela 09:00 a 09:10 UTC ou 15:00 a 15:10 UTC com viewport 1920 e sem referrer em /donate, / ou /liturgia/hoje gera suspect", () => {
  for (const iso of ["2026-11-03T09:00:00Z", "2026-11-03T09:05:00Z", "2026-11-03T09:10:00Z", "2026-11-03T15:03:00Z"]) {
    for (const pathname of ["/donate", "/", "/liturgia/hoje"]) {
      const result = detectSyntheticTraffic({
        webdriver: false,
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0.0.0",
        languages: ["en-US"],
        viewportWidth: 1920,
        referrer: "",
        pathname,
        now: new Date(iso),
      });
      assert.equal(result.skip, false);
      assert.equal(result.suspect, true, `Esperado suspect para ${pathname} em ${iso}`);
      assert.ok(result.reasons.includes("datacenter_schedule_1920"));
    }
  }
});

test("usuário mobile às 09:05 UTC vindo do Google não gera skip nem suspect", () => {
  const result = detectSyntheticTraffic({
    webdriver: false,
    userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/130.0.0.0 Mobile Safari/537.36",
    languages: ["pt-BR", "pt"],
    viewportWidth: 390,
    referrer: "https://www.google.com/",
    pathname: "/liturgia/hoje",
    now: new Date("2026-11-03T09:05:00Z"),
  });
  assert.equal(result.skip, false);
  assert.equal(result.suspect, false);
  assert.deepEqual(result.reasons, []);
});

test("usuário desktop 1920 fora da janela de horário ou em outra rota não gera suspect", () => {
  const outsideWindow = detectSyntheticTraffic({
    webdriver: false,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0.0.0",
    languages: ["pt-BR"],
    viewportWidth: 1920,
    referrer: "",
    pathname: "/donate",
    now: new Date("2026-11-03T09:11:00Z"),
  });
  assert.equal(outsideWindow.suspect, false);

  const otherPath = detectSyntheticTraffic({
    webdriver: false,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0.0.0",
    languages: ["pt-BR"],
    viewportWidth: 1920,
    referrer: "",
    pathname: "/liturgia/03-novembro-2026",
    now: new Date("2026-11-03T09:05:00Z"),
  });
  assert.equal(otherPath.suspect, false);
});
