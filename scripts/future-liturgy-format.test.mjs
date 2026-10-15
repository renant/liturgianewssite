import assert from "node:assert/strict";
import test from "node:test";
import { htmlToMarkdown } from "./future-liturgy-format.mjs";

test("cabeçalho de leitura da fonte vira texto formatado sem asteriscos literais", () => {
  const converted = htmlToMarkdown(
    "<p><strong>Primeira Leitura (</strong><strong>Ef 1,1-10)</strong></p>",
  );

  assert.equal(
    converted,
    "<strong>Primeira Leitura</strong> (Ef 1,1-10)",
  );
  assert.doesNotMatch(converted, /\*{2,}/);
});
