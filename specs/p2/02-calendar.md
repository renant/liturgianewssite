# P2-02 — Calendário do mês

## Fato

O arquivo é uma lista paginada de 20 itens, do mais novo para o mais antigo. Não há visão do mês.

## Resultado

Um calendário mensal somente para meses que já têm pelo menos um MDX publicado.

## Fora de escopo

- Não duplicar o corpo da liturgia.
- Não criar mês vazio.
- Não fazer grade de todos os anos futuros.
- Não criar páginas ou links para datas futuras: as liturgias são publicadas no dia a dia.

## Arquivos

- `app/liturgia/calendario/[ano]/[mes]/page.tsx`
- `app/liturgia/page.tsx` ganha um link “Calendário” para o mês corrente em Brasília
- `app/sitemap.ts`

## Implementação

- `ano` é `2025` ou `2026` (ou o que existir em disco). `mes` é o nome usado no slug (`setembro`) ou o número, uma forma só. Preferir o nome já usado nos arquivos, para a URL ficar legível: `/liturgia/calendario/2026/setembro`.
- `generateStaticParams` lista pares ano/mês que tenham ao menos um arquivo.
- A página lista os dias existentes, com o título do frontmatter e link para `/liturgia/{slug}`. Dias ausentes no meio do mês aparecem como lacuna, sem link.
- `dynamicParams = false`.
- Entradas correspondentes no sitemap, `lastmod` pela data litúrgica mais recente daquele mês, não pelo mtime.

## Aceite

- `/liturgia/calendario/2026/setembro` lista `28-setembro-2026` e não lista `17-setembro-2025` (mês errado).
- `/liturgia/calendario/2026/outubro` não é gerada enquanto não houver arquivo de outubro de 2026.
- O arquivo `/liturgia` linka o calendário do mês atual.

## Validação

Build, conferir `generateStaticParams` e o HTML da rota de calendário.
