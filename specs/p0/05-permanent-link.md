# P0-05 — Ligação entre `/liturgia/hoje` e a URL permanente do dia

## Fato

As duas URLs respondem 200 com o mesmo texto e canonicals diferentes. `/hoje` não aponta para `/liturgia/28-setembro-2026`. A página datada não aponta para `/hoje`. Não há navegação para o dia anterior ou seguinte (isso é a P1-03).

## Resultado

Quem está em `/hoje` vê um link para o endereço permanente daquele dia. Quem está numa data que não é hoje vê um link para a liturgia de hoje. Os canonicals não mudam.

## Fora de escopo

- Não usar redirect 301, 302 ou 307.
- Não colocar `rel=canonical` cruzado.
- Não adicionar dia anterior/próximo (P1-03).

## Arquivos

- `app/liturgia/hoje/page.tsx`
- `app/liturgia/[slug]/page.tsx`
- `lib/liturgical-date.ts` da P0-01

## Implementação

- Em `/hoje`, abaixo do título, link visível “Endereço permanente deste dia” para `/liturgia/{slug}` do dia litúrgico de Brasília.
- Na página datada, se o slug não for o de hoje, link “Liturgia de hoje” para `/liturgia/hoje`.
- Se o slug for o de hoje, uma linha “Esta é a liturgia de hoje” com link para `/liturgia/hoje`, sem esconder a URL datada.
- Texto de link real, não só ícone.

## Aceite

- HTML de `/liturgia/hoje` contém `href="/liturgia/28-setembro-2026"` quando o dia de Brasília for esse. No teste, fixar o relógio como na P0-01.
- HTML de `/liturgia/28-setembro-2025` contém `href="/liturgia/hoje"`.
- Canonical de cada uma continua a própria URL.

## Validação

Build e busca desses `href` e dos canonicals no HTML.
