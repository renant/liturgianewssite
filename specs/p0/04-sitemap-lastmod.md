# P0-04 — `lastmod` do sitemap pela data litúrgica

## Fato

O sitemap de produção em 28/09/2026 tinha 442 URLs e todas com `<lastmod>2026-09-28`. `app/sitemap.ts` usa `fs.statSync().mtime`. No build da Vercel o checkout iguala essa data, então o Google não distingue uma liturgia nova de uma página de 2025. `changefreq` das páginas datadas está `daily`, embora o texto histórico quase não mude.

## Resultado

O `lastmod` de cada liturgia é a data do frontmatter (`metadata.date`), não o mtime. Páginas institucionais não recebem `new Date()` a cada build.

## Fora de escopo

- Não dividir o sitemap em índice, a menos que passe de 50 mil URLs. Não passa.
- Não remover `/liturgia/hoje` do sitemap.

## Arquivos

- `app/sitemap.ts`
- Leitura de `liturgia-content/*.mdx` e `content/*.mdx`

## Implementação

- Para cada liturgia, ler `date` do frontmatter. Gravar `lastmod` como essa data civil (`2026-09-28`), estável entre builds.
- `changeFrequency`: `yearly` para data litúrgica anterior a hoje em `America/Sao_Paulo`; `daily` só para o dia de hoje e para `/liturgia/hoje`.
- `/`, `/liturgia`, `/blog`: `lastmod` do dia litúrgico atual em São Paulo, porque a listagem muda quando entra um dia novo. Não usar o instante do build.
- `/sobre`, `/privacidade`, `/contact`, `/donate`: data fixa documentada no código (a data do último conteúdo real dessas páginas, ou `2026-01-01` se não houver outra evidência no arquivo). Não `new Date()`.
- O post do blog usa a data do frontmatter do MDX.

## Aceite

- Dois builds seguidos produzem o mesmo `lastmod` para `/liturgia/28-setembro-2025`.
- Esse valor é `2025-09-28`, não a data do build.
- `/liturgia/hoje` continua no sitemap.

## Validação

Gerar o sitemap no build e comparar os `lastmod` de um dia de 2025, de 28/09/2026 e de `/sobre`.
