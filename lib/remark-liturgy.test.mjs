import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { compile } from "@mdx-js/mdx";
import remarkLiturgy from "./remark-liturgy.mjs";
import { extractLiturgyFacts } from "./liturgy-facts.ts";

async function transformed(source, file = "liturgia-content/example.mdx") {
  let output;
  await compile({ value: source, path: path.resolve(file) }, { remarkPlugins: [remarkLiturgy, () => tree => { output = tree; }] });
  return output;
}

test("conteúdos reais antigos e novos mantêm leituras sem a abertura duplicada", async () => {
  for (const slug of ["02-setembro-2026", "17-outubro-2026"]) {
    const source = fs.readFileSync(`liturgia-content/${slug}.mdx`, "utf8");
    const tree = await transformed(source);
    assert.equal(tree.children.filter(node => node.type === "heading" && node.depth === 1).length, 0);
    assert.ok(tree.children.some(node => node.data?.hProperties?.id === "evangelho"));
    assert.ok(tree.children.some(node => node.data?.hProperties?.id === "primeira-leitura"));
    assert.ok(tree.children.some(node => node.data?.hProperties?.id === "salmo"));
    const json = JSON.stringify(tree);
    assert.ok(json.includes("Palavra do Senhor"));
    assert.ok(json.includes("Graças a Deus"));
  }
  const future = extractLiturgyFacts(fs.readFileSync("liturgia-content/17-outubro-2026.mdx", "utf8"));
  assert.deepEqual(future, { gospel: "Lc 12,8-12", firstReading: "Ef 1,15-23" });
  const legacy = extractLiturgyFacts(fs.readFileSync("liturgia-content/02-setembro-2026.mdx", "utf8"));
  assert.deepEqual(legacy, { gospel: "Lc 4,38-44", firstReading: "1Cor 3,1-9" });
});

test("a transformação não altera o H1 e a data do blog", async () => {
  const tree = await transformed("# Artigo\n\nquarta-feira, 14 de outubro de 2026\n\nTexto preservado.", "content/example.mdx");
  assert.equal(tree.children[0].depth, 1);
  assert.equal(tree.children[1].children[0].value, "quarta-feira, 14 de outubro de 2026");
});

test("datas dentro do texto, refrões repetidos e seções posteriores são preservados", async () => {
  const tree = await transformed("# Celebração\n\nquarta-feira, 14 de outubro de 2026\n\n## Leituras do Dia\n\nTexto da leitura.\n\nquarta-feira, 14 de outubro de 2026\n\nGraças a Deus.\n\nGraças a Deus.\n\n## Reflexão do Evangelho\n\nReflexão preservada.");
  const paragraphs = tree.children.filter(node => node.type === "paragraph").map(node => node.children.map(child => child.value || "").join(""));
  assert.ok(paragraphs.includes("quarta-feira, 14 de outubro de 2026"));
  assert.equal(paragraphs.filter(value => value === "Graças a Deus.").length, 2);
  assert.ok(tree.children.some(node => node.data?.hProperties?.id === "reflexao"));
});

test("duas versões de leitura têm âncoras únicas", async () => {
  const tree = await transformed("# Dia\n\n## Leituras do Dia\n\n**Evangelho (Lc 1,1-4)**\n\n**Evangelho (Lc 1,1-2)**");
  const ids = tree.children.map(node => node.data?.hProperties?.id).filter(Boolean);
  assert.deepEqual(ids, ["leituras", "evangelho", "evangelho-2"]);
});

test("links de notícias e referências na reflexão não viram títulos de leitura", async () => {
  const tree = await transformed("# Dia\n\n## Leituras do Dia\n\n**Evangelho (Lc 1,1-4)**\n\n## Reflexão do Evangelho\n\nEvangelho (Lc 1,1-4)\n\n## Notícias do Vaticano\n\n[Evangelho de 14 de outubro](https://example.com/noticia)");
  assert.equal(tree.children.filter(node => node.type === "heading" && node.depth === 3).length, 1);
  assert.ok(tree.children.some(node => node.type === "paragraph" && node.children.some(child => child.type === "link")));
});

test("todo o acervo mantém parágrafos longos e links originais após a normalização", async () => {
  const nodesOfType = (node, type) => [node.type === type ? node : null, ...(node.children || []).flatMap(child => nodesOfType(child, type))].filter(Boolean);
  const textOf = node => node.children ? node.children.map(textOf).join("") : node.value || "";
  for (const file of fs.readdirSync("liturgia-content").filter(file => file.endsWith(".mdx"))) {
    let before, after;
    await compile({ value: fs.readFileSync(`liturgia-content/${file}`, "utf8"), path: path.resolve("liturgia-content", file) }, {
      remarkPlugins: [() => tree => { before = structuredClone(tree); }, remarkLiturgy, () => tree => { after = tree; }],
    });
    const paragraphs = new Set(nodesOfType(after, "paragraph").map(node => JSON.stringify(node)));
    for (const paragraph of nodesOfType(before, "paragraph").filter(node => textOf(node).length > 180)) {
      assert.ok(paragraphs.has(JSON.stringify(paragraph)), `${file}: parágrafo alterado`);
    }
    assert.deepEqual(nodesOfType(after, "link"), nodesOfType(before, "link"), `${file}: link alterado`);
    assert.equal(nodesOfType(after, "heading").filter(node => node.depth === 1).length, 0, file);
  }
});
