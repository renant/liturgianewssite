import assert from "node:assert/strict";
import test from "node:test";
import { civilDateToSlug, getLiturgicalCivilDate, getNextSunday } from "./liturgical-date.ts";
import { buildLiturgyPageTitle, buildSundayDescription, buildSundayTitle, isSunday, isUpcomingSunday, liturgyCelebrationName, liturgyDocumentTitle } from "./liturgy-facts.ts";

test("próximo domingo: no domingo é hoje, nos outros dias é o domingo seguinte", () => {
  const slug = (iso: string) => civilDateToSlug(getNextSunday(getLiturgicalCivilDate(new Date(iso))));
  assert.equal(slug("2026-11-29T15:00:00.000Z"), "29-novembro-2026");
  assert.equal(slug("2026-11-25T15:00:00.000Z"), "29-novembro-2026");
  assert.equal(slug("2026-11-30T15:00:00.000Z"), "06-dezembro-2026");
  // sábado 28/11 às 22h em São Paulo já é domingo 29/11 em UTC, mas não pode virar o domingo seguinte
  assert.equal(slug("2026-11-29T01:30:00.000Z"), "29-novembro-2026");
  // domingo 29/11 às 22h em São Paulo é 30/11 em UTC, ainda é domingo em São Paulo
  assert.equal(slug("2026-11-30T01:30:00.000Z"), "29-novembro-2026");
});

test("title e description de domingo usam o nome litúrgico", () => {
  assert.equal(buildSundayTitle("1º Domingo do Advento", "29 de novembro de 2026"), "Evangelho do dia 29 de novembro de 2026, 1º Domingo do Advento");
  assert.equal(liturgyCelebrationName("Sagrada Família de Jesus, Maria e José - Festa | Domingo"), "Sagrada Família de Jesus, Maria e José");
  assert.equal(liturgyCelebrationName("Epifania do Senhor | Solenidade | Domingo"), "Epifania do Senhor");
  assert.equal(
    buildSundayDescription("1º Domingo do Advento", "29 de novembro de 2026", { gospel: "Lc 21,25-28.34-36" }),
    "Evangelho do dia 29 de novembro de 2026, 1º Domingo do Advento. Evangelho Lc 21,25-28.34-36. Leituras, salmo e reflexão do domingo.",
  );
});

test("só domingos de hoje em diante recebem o title de domingo", () => {
  assert.equal(isUpcomingSunday("2026-11-29", "2026-11-25"), true);
  assert.equal(isUpcomingSunday("2026-11-29", "2026-11-29"), true);
  assert.equal(isUpcomingSunday("2026-11-22", "2026-11-25"), false);
  assert.equal(isUpcomingSunday("2026-11-30", "2026-11-25"), false);
});

test("title das liturgias começa com evangelho do dia e data", () => {
  assert.equal(
    buildLiturgyPageTitle("26 de novembro de 2026", ["Lc 21,20-28"]),
    "Evangelho do dia 26 de novembro de 2026, Lc 21,20-28",
  );
  assert.equal(
    liturgyDocumentTitle("Evangelho do dia 26 de novembro de 2026, Lc 21,20-28"),
    "Evangelho do dia 26 de novembro de 2026, Lc 21,20-28 | LiturgiaNews",
  );
  // Celebração longa não cabe; cai para a referência do Evangelho.
  assert.equal(
    buildLiturgyPageTitle("22 de novembro de 2026", [
      "Nosso Senhor Jesus Cristo, Rei do Universo, Solenidade",
      "Mt 25,31-46",
    ]),
    "Evangelho do dia 22 de novembro de 2026, Mt 25,31-46",
  );
  // Sem extra curto o bastante, fica só o molde com a data.
  assert.equal(
    buildLiturgyPageTitle("22 de novembro de 2026", [
      "Nosso Senhor Jesus Cristo, Rei do Universo, Solenidade",
    ]),
    "Evangelho do dia 22 de novembro de 2026",
  );
  // Domingo com nome curto: celebração entra; com marca passaria de 70, então o title fica sem o sufixo.
  assert.equal(
    buildSundayTitle("1º Domingo do Advento", "29 de novembro de 2026"),
    "Evangelho do dia 29 de novembro de 2026, 1º Domingo do Advento",
  );
  assert.equal(
    liturgyDocumentTitle("Evangelho do dia 29 de novembro de 2026, 1º Domingo do Advento"),
    "Evangelho do dia 29 de novembro de 2026, 1º Domingo do Advento",
  );
  assert.equal(isSunday("2026-11-29"), true);
  assert.equal(isSunday("2026-11-26"), false);
});

