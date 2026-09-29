import assert from "node:assert/strict";
import test from "node:test";
import { addCivilDays, civilDateToSlug, getLiturgicalDate } from "./liturgical-date.ts";

test("usa o dia civil de São Paulo antes da meia-noite", () => {
  assert.equal(getLiturgicalDate(new Date("2026-09-29T02:30:00.000Z")).slug, "28-setembro-2026");
});

test("vira o dia à meia-noite de São Paulo", () => {
  assert.equal(getLiturgicalDate(new Date("2026-09-29T03:30:00.000Z")).slug, "29-setembro-2026");
});

test("mantém o dia durante a tarde", () => {
  assert.equal(getLiturgicalDate(new Date("2026-09-28T15:00:00.000Z")).slug, "28-setembro-2026");
});

test("soma dias como calendário civil", () => {
  assert.equal(civilDateToSlug(addCivilDays("2026-09-30", 1)), "01-outubro-2026");
});
