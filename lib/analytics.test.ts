import assert from "node:assert/strict";
import test from "node:test";
import { createAnalyticsTracker, type AnalyticsProperties } from "./analytics.ts";

test("createAnalyticsTracker enfileira eventos e exceções até o cliente ser anexado", () => {
  const tracker = createAnalyticsTracker();
  const capturedEvents: Array<{ name: string; properties?: AnalyticsProperties }> = [];
  const capturedErrors: Array<{ error: unknown; properties?: AnalyticsProperties }> = [];

  const testError = new Error("Falha ao enviar formulário");
  tracker.capture("liturgy_view", { slug: "03-novembro-2026", is_today: true });
  tracker.captureError(testError, { source: "newsletter_form" });

  assert.equal(capturedEvents.length, 0);
  assert.equal(capturedErrors.length, 0);

  tracker.attachClient({
    capture(name, properties) {
      capturedEvents.push({ name, properties });
    },
    captureException(error, properties) {
      capturedErrors.push({ error, properties });
    },
  });

  assert.equal(capturedEvents.length, 1);
  assert.deepEqual(capturedEvents[0], {
    name: "liturgy_view",
    properties: { slug: "03-novembro-2026", is_today: true },
  });
  assert.equal(capturedErrors.length, 1);
  assert.equal(capturedErrors[0].error, testError);
  assert.deepEqual(capturedErrors[0].properties, { source: "newsletter_form" });

  // Eventos após attach vão direto
  tracker.capture("newsletter_signup_start", { source: "home" });
  assert.equal(capturedEvents.length, 2);
});

test("createAnalyticsTracker usa fallback $exception quando captureException não existe no cliente", () => {
  const tracker = createAnalyticsTracker();
  const capturedEvents: Array<{ name: string; properties?: AnalyticsProperties }> = [];

  tracker.captureError(new Error("Erro de rede"), { context: "send_confirm_email" });
  tracker.attachClient({
    capture(name, properties) {
      capturedEvents.push({ name, properties });
    },
  });

  assert.equal(capturedEvents.length, 1);
  assert.equal(capturedEvents[0].name, "$exception");
  assert.deepEqual(capturedEvents[0].properties, {
    $exception_message: "Erro de rede",
    context: "send_confirm_email",
  });
});
