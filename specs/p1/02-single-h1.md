# P1-02 — Um único H1 na liturgia

## Fato

`/liturgia/hoje` tem dois H1: “Liturgia do Dia”, escrito na página, e “26ª Semana do Tempo Comum | Segunda-feira”, que vem do `#` do MDX via `mdx-components.tsx`. A página datada tem um H1 só, o do MDX, e ele não contém a data.

## Resultado

Cada página de liturgia tem um único H1, com a data por extenso. O nome da semana ou da festa vira H2.

## Fora de escopo

- Não reescrever os 433 arquivos `.mdx`.
- Não mudar H2 de “Leituras do Dia”, “Reflexão do Evangelho” e “Notícias do Vaticano”.

## Arquivos

- `mdx-components.tsx` ou um mapa de componentes passado só nas páginas de liturgia
- `app/liturgia/hoje/page.tsx`
- `app/liturgia/[slug]/page.tsx`

## Implementação

- Nas rotas de liturgia, o componente `h1` do MDX renderiza `<h2>`, para não haver dois H1. O blog pode manter H1 no MDX, porque a página do post não adiciona outro.
- O H1 da página passa a ser:
  - em `/hoje`: `Liturgia de 28 de setembro de 2026`
  - na URL datada: `Liturgia de 28 de setembro de 2026`
- O título do frontmatter (`26ª Semana do Tempo Comum | Segunda-feira`) fica visível como H2, logo abaixo.
- O resumo da P0-06 fica junto desse cabeçalho, sem virar outro H1.

## Aceite

- HTML de `/liturgia/hoje` e de `/liturgia/28-setembro-2026` contém exatamente um `<h1>`.
- Esse H1 inclui a data por extenso.
- O nome da semana continua visível.

## Validação

Build e contagem de `<h1` no HTML das duas rotas.
