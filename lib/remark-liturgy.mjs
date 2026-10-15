import { liturgySectionId, normalizeLiturgyText, parseReadingHeading } from "./liturgy-markup.mjs";

function nodeText(node) {
  return node.children ? node.children.map(nodeText).join("") : node.value || "";
}

export function normalizeLiturgyTree(tree) {
  const children = tree.children;
  const first = children.findIndex(node => node.type !== "mdxjsEsm");
  // Only the opening title and its adjacent date are redundant with the page header.
  if (first >= 0 && children[first].type === "heading" && children[first].depth === 1) {
    children.splice(first, 1);
    const date = children[first];
    if (date?.type === "paragraph" && /^(?:domingo|segunda-feira|terça-feira|quarta-feira|quinta-feira|sexta-feira|sábado),?\s+\d{1,2} de \S+ de \d{4}$/i.test(normalizeLiturgyText(nodeText(date)))) children.splice(first, 1);
  }
  const used = new Map();
  let inReadings = false;
  for (let index = 0; index < children.length; index++) {
    let node = children[index];
    const next = children[index + 1];
    // Adjacent HTML labels can be parsed as two flow nodes rather than a paragraph.
    if (inReadings && node.type === "mdxJsxFlowElement" && node.name === "strong" && next?.type === "mdxJsxFlowElement" && next.name === "strong" && node.position?.end.line === next.position?.start.line && parseReadingHeading(`${nodeText(node)} ${nodeText(next)}`)) {
      node = { type: "paragraph", children: [{ type: "text", value: `${nodeText(node)} ${nodeText(next)}` }], position: { start: node.position.start, end: next.position.end } };
      children.splice(index, 2, node);
    }
    let id = null;
    if (node.type === "paragraph" && inReadings && !node.children?.some(child => child.type === "link")) {
      const reading = parseReadingHeading(nodeText(node));
      if (reading) {
        node.type = "heading";
        node.depth = 3;
        node.children = [{ type: "text", value: reading.text }];
        id = reading.id;
      }
    } else if (node.type === "heading") {
      if (node.depth === 1) node.depth = 2;
      id = liturgySectionId(nodeText(node));
      if (node.depth === 2) inReadings = id === "leituras";
    }
    if (id) {
      const count = (used.get(id) || 0) + 1;
      used.set(id, count);
      node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id: count === 1 ? id : `${id}-${count}` } };
    }
  }
  return tree;
}

export default function remarkLiturgy() {
  return (tree, file) => {
    if (/(?:^|[/\\])liturgia-content[/\\]/.test(String(file.path || ""))) normalizeLiturgyTree(tree);
  };
}
