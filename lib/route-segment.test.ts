import assert from "node:assert/strict";
import test from "node:test";
import { decodeRouteSegment } from "./route-segment.ts";
import { getLiturgyEntry } from "./content-metadata.ts";

test("segmentos acentuados crus ou codificados resolvem a mesma liturgia existente", () => {
  assert.equal(decodeRouteSegment("mar%C3%A7o"), "março");
  assert.equal(decodeRouteSegment("março"), "março");
  const slug = decodeRouteSegment("01-mar%C3%A7o-2026");
  assert.equal(slug, "01-março-2026");
  assert.ok(getLiturgyEntry(slug!));
});

test("codificação inválida ou separadores de caminho não são segmentos de conteúdo", () => {
  assert.equal(decodeRouteSegment("%invalid"), null);
  assert.equal(decodeRouteSegment("foo%2Fbar"), null);
  assert.equal(decodeRouteSegment("foo%5Cbar"), null);
});
