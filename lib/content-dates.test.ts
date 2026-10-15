import assert from "node:assert/strict";
import test from "node:test";
import { contentPublishedAt, contentModifiedAt } from "./content-dates.ts";

const now = new Date("2026-10-15T01:00:00Z");

test("data futura da celebração não vira data de publicação ou lastmod", () => {
  const entry = { title: "Dia futuro", date: "2026-10-21" };
  assert.equal(contentPublishedAt(entry, now), undefined);
  assert.equal(contentModifiedAt(entry, now), undefined);
});

test("liturgia futura pode ter publicação e atualização reais anteriores à celebração", () => {
  const entry = { title: "Dia futuro", date: "2026-10-21", publishedAt: "2026-10-15T00:00:00Z", updatedAt: "2026-10-15T00:30:00Z" };
  assert.equal(contentPublishedAt(entry, now), entry.publishedAt);
  assert.equal(contentModifiedAt(entry, now), entry.updatedAt);
});

test("data de hoje segue Brasília e timestamps inválidos ou futuros são ignorados", () => {
  assert.equal(contentModifiedAt({ title: "Amanhã em Brasília", date: "2026-10-15" }, now), undefined);
  assert.equal(contentModifiedAt({ title: "Dia passado", date: "2026-10-14", updatedAt: "2026-10-30T12:00:00Z" }, now), "2026-10-14");
  assert.equal(contentModifiedAt({ title: "Dia passado", date: "2026-10-14", updatedAt: "invalid" }, now), "2026-10-14");
});
