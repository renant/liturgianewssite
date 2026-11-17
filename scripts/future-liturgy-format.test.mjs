import assert from "node:assert/strict";
import test from "node:test";
import { htmlToMarkdown } from "./future-liturgy-format.mjs";

test("cabeçalho de leitura da fonte vira texto formatado sem asteriscos literais e sem quebras dentro de strong", () => {
  const converted = htmlToMarkdown(
    "<p><strong>Primeira Leitura (</strong><strong>Ef 1,1-10)</strong></p>",
  );

  assert.equal(
    converted,
    "<strong>Primeira Leitura</strong> (Ef 1,1-10)",
  );
  assert.doesNotMatch(converted, /\*{2,}/);

  const multilineStrong = htmlToMarkdown(
    "<p><strong>Primeira Leitura (Ml 3,1-4)<br /></strong></p><p><strong>— Graças a Deus!<br></strong></p>",
  );
  assert.equal(
    multilineStrong,
    "<strong>Primeira Leitura</strong> (Ml 3,1-4)\n\n<strong>— Graças a Deus!</strong>",
  );
});
