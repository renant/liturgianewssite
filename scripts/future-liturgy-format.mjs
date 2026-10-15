function decodeHtml(value) {
  const named = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (entity, name) => named[name.toLowerCase()] ?? entity);
}

export function htmlToMarkdown(html) {
  return decodeHtml(html
    .replace(/<div\b[^>]*class=["'][^"']*embeds-audio[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<!--[\s\S]*?-->|<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|section|blockquote|ul|ol)>/gi, "\n\n")
    .replace(/<h[1-6]\b[^>]*>/gi, "\n## ")
    .replace(/<li\b[^>]*>/gi, "\n- ")
    .replace(/<(?:strong|b)\b[^>]*>\s*(Primeira Leitura|Segunda Leitura|Evangelho)\s*\(\s*<\/(?:strong|b)>\s*<(?:strong|b)\b[^>]*>([^<]*?)\s*\)<\/(?:strong|b)>/gi, "<strong>$1</strong> ($2)")
    .replace(/<(?:strong|b)\b[^>]*>\s*(Responsório|Salmo Responsorial)\s*<\/(?:strong|b)>\s*<(?:strong|b)\b[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi, "<strong>$1</strong> $2")
    .replace(/<strong\b[^>]*>|<b\b[^>]*>/gi, "\uE000STRONG_OPEN\uE000")
    .replace(/<\/strong\s*>|<\/b\s*>/gi, "\uE000STRONG_CLOSE\uE000")
    .replace(/<em\b[^>]*>|<i\b[^>]*>/gi, "\uE000EM_OPEN\uE000")
    .replace(/<\/em\s*>|<\/i\s*>/gi, "\uE000EM_CLOSE\uE000")
    .replace(/<[^>]+>/g, "")
    .replace(/\uE000STRONG_OPEN\uE000/g, "<strong>")
    .replace(/\uE000STRONG_CLOSE\uE000/g, "</strong>")
    .replace(/\uE000EM_OPEN\uE000/g, "<em>")
    .replace(/\uE000EM_CLOSE\uE000/g, "</em>")
    .replace(/[\t ]+\n/g, "\n")
    .replace(/\n[\t ]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim());
}
