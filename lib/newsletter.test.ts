import assert from "node:assert/strict";
import test from "node:test";
import {
  buildConfirmedRedirectPath,
  buildConfirmSubscriptionUrl,
  hasLocalNewsletterAnchor,
  isValidNewsletterSource,
  isValidSignupRef,
} from "./newsletter.ts";

test("isValidNewsletterSource valida todos os sources permitidos e rejeita desconhecidos", () => {
  assert.equal(isValidNewsletterSource("home"), true);
  assert.equal(isValidNewsletterSource("liturgia_hoje"), true);
  assert.equal(isValidNewsletterSource("liturgia_datada"), true);
  assert.equal(isValidNewsletterSource("liturgia_hoje_evangelho"), true);
  assert.equal(isValidNewsletterSource("liturgia_datada_evangelho"), true);
  assert.equal(isValidNewsletterSource("tempo_liturgico"), true);
  assert.equal(isValidNewsletterSource("acompanhar"), true);
  assert.equal(isValidNewsletterSource("lectio_divina"), true);
  assert.equal(isValidNewsletterSource("blog"), true);
  assert.equal(isValidNewsletterSource("header"), true);
  assert.equal(isValidNewsletterSource("invalido"), false);
  assert.equal(isValidNewsletterSource(null), false);
});

test("isValidSignupRef aceita UUID v4 válido e rejeita e-mail ou strings arbitrárias", () => {
  assert.equal(isValidSignupRef("550e8400-e29b-41d4-a716-446655440000"), true);
  assert.equal(isValidSignupRef("user@example.com"), false);
  assert.equal(isValidSignupRef("12345"), false);
  assert.equal(isValidSignupRef(""), false);
});

test("buildConfirmSubscriptionUrl e buildConfirmedRedirectPath incluem apenas id/ref/source válidos e nunca e-mail", () => {
  const ref = "550e8400-e29b-41d4-a716-446655440000";
  const link = buildConfirmSubscriptionUrl("https://www.liturgianews.site", {
    id: "contact_123",
    ref,
    source: "liturgia_hoje_evangelho",
  });
  assert.equal(
    link,
    `https://www.liturgianews.site/api/confirm-subscription?id=contact_123&ref=${ref}&source=liturgia_hoje_evangelho`,
  );

  const redirectPath = buildConfirmedRedirectPath({
    ref,
    source: "liturgia_hoje_evangelho",
  });
  assert.equal(
    redirectPath,
    `/subscription-confirmed?ref=${ref}&source=liturgia_hoje_evangelho`,
  );
  assert.equal(redirectPath.includes("contact_123"), false);

  const fallbackRedirect = buildConfirmedRedirectPath({
    ref: "not-a-uuid",
    source: "unknown_source",
  });
  assert.equal(fallbackRedirect, "/subscription-confirmed");
});

test("hasLocalNewsletterAnchor identifica rotas com #newsletter na própria página", () => {
  assert.equal(hasLocalNewsletterAnchor("/"), true);
  assert.equal(hasLocalNewsletterAnchor("/liturgia/hoje"), true);
  assert.equal(hasLocalNewsletterAnchor("/liturgia/03-novembro-2026"), true);
  assert.equal(hasLocalNewsletterAnchor("/tempo-liturgico"), true);
  assert.equal(hasLocalNewsletterAnchor("/acompanhar"), true);
  assert.equal(hasLocalNewsletterAnchor("/lectio-divina"), true);
  assert.equal(hasLocalNewsletterAnchor("/liturgia"), false);
  assert.equal(hasLocalNewsletterAnchor("/liturgia/calendario/2026/novembro"), false);
  assert.equal(hasLocalNewsletterAnchor("/donate"), false);
  assert.equal(hasLocalNewsletterAnchor("/blog"), false);
});
