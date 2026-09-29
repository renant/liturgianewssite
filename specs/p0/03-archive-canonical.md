# P0-03 — Canonical da paginação do arquivo

## Fato

`/liturgia?page=2` responde 200, tem links para liturgias antigas e declara canonical `https://www.liturgianews.site/liturgia`, igual à página 1. O mesmo padrão está em `/blog`. O Google é instruído a tratar o restante do arquivo como duplicata da primeira página.

## Resultado

Cada página numerada do arquivo é canônica nela mesma. Busca, ordenação diferente da padrão e `limit` diferente de 20 ficam `noindex`.

## Fora de escopo

- Não criar calendário mensal aqui (P2-02).
- Não mudar o conteúdo da listagem.

## Arquivos

- `app/liturgia/page.tsx`
- `app/blog/page.tsx`

## Implementação

- Página 1, sem query: canonical `https://www.liturgianews.site/liturgia`.
- Página `n > 1`, só com `page`: canonical `https://www.liturgianews.site/liturgia?page=n`.
- Se houver `search`, `sort` diferente de `date_desc` ou `limit` diferente do padrão, `robots: { index: false, follow: true }` e canonical da página 1 sem esses parâmetros.
- Repetir a regra em `/blog`, com o `limit` padrão daquela página (6).

## Aceite

- `/liturgia` canonical sem query.
- `/liturgia?page=2` canonical com `page=2`.
- `/liturgia?page=2&search=domingo` com noindex.
- O mesmo para `/blog`.

## Validação

Build e leitura do `<link rel="canonical">` dessas quatro URLs no `next start` ou no HTML gerado.
