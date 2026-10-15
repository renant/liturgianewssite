import assert from "node:assert/strict";
import test from "node:test";
import { adjacentMonth, buildMonthWeeks, calendarHref, getCalendarMonths } from "./liturgy-calendar.ts";
import { getLiturgicalDate } from "./liturgical-date.ts";

test("fevereiro bissexto mantém dias alinhados e não cria dia 30", () => {
  const weeks = buildMonthWeeks(2024, 2);
  assert.equal(weeks.length, 5);
  assert.equal(weeks[0][4]?.day, 1);
  assert.equal(weeks[4][4]?.day, 29);
  assert.equal(weeks.flat().filter(Boolean).length, 29);
});

test("mês iniciado no sábado pode precisar de seis semanas", () => {
  const weeks = buildMonthWeeks(2026, 8);
  assert.equal(weeks.length, 6);
  assert.equal(weeks[0][6]?.day, 1);
  assert.equal(weeks[5][1]?.day, 31);
  assert.equal(weeks[5][2], null);
});

test("navegação e slugs existentes são preservados em viradas de ano e meses acentuados", () => {
  assert.equal(calendarHref(adjacentMonth(2026, 12, 1)), "/liturgia/calendario/2027/janeiro");
  assert.equal(calendarHref(adjacentMonth(2026, 1, -1)), "/liturgia/calendario/2025/dezembro");
  assert.equal(calendarHref({ year: 2026, month: 3 }), "/liturgia/calendario/2026/março");
  assert.deepEqual(getCalendarMonths([{ date: "2026-10-14" }, { date: "2026-10-21" }, { date: "2025-07-21" }]).map(month => month.key), ["2025-07", "2026-10"]);
});

test("mês corrente de Brasília só avança na meia-noite local", () => {
  for (const instant of ["2026-10-31T23:59:00-03:00", "2026-10-31T21:00:00-03:00", "2026-10-31T20:59:00-03:00"]) {
    assert.equal(calendarHref(getLiturgicalDate(new Date(instant))), "/liturgia/calendario/2026/outubro");
  }
  assert.equal(calendarHref(getLiturgicalDate(new Date("2026-11-01T00:00:00-03:00"))), "/liturgia/calendario/2026/novembro");
  assert.equal(calendarHref(getLiturgicalDate(new Date("2027-01-01T00:00:00-03:00"))), "/liturgia/calendario/2027/janeiro");
});

test("parâmetros de calendário inválidos são rejeitados", () => {
  assert.throws(() => buildMonthWeeks(2026, 13));
  assert.throws(() => buildMonthWeeks(NaN, 1));
});
