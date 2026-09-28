# P1-03 — Dia anterior e próximo dia

## Fato

A página datada só volta para o arquivo. Não há link para o dia anterior nem para o seguinte. O crawler depende do sitemap e da paginação. O leitor não caminha pela semana.

## Resultado

Toda liturgia datada, e também `/hoje`, oferece “Dia anterior” e “Próximo dia” quando o arquivo existe.

## Fora de escopo

- Não criar o MDX que falta (`17-setembro-2025`, `05-dezembro-2025`, os dias de julho de 2025 anteriores a 21, nem dias futuros ainda não publicados).
- Não fazer um calendário visual (P2-02).

## Arquivos

- `app/liturgia/[slug]/page.tsx`
- `app/liturgia/hoje/page.tsx`
- Helper de data civil ao lado de `lib/liturgical-date.ts`

## Implementação

- Somar e subtrair um dia na data `YYYY-MM-DD` do frontmatter, como calendário, sem `Date` local.
- Montar o slug e checar se `liturgia-content/{slug}.mdx` existe.
- Se existir, link com o texto “Dia anterior” ou “Próximo dia” e a data por extenso.
- Se não existir, omitir aquele lado. Não apontar para 404.
- Em `/hoje`, os vizinhos são o dia litúrgico de Brasília menos um e mais um.

## Aceite

- `28-setembro-2026` liga para `27-setembro-2026` e só liga para `29-setembro-2026` se o arquivo existir.
- `21-julho-2025` não liga para `20-julho-2025`, porque esse arquivo não existe.
- Os links são `<a>` no HTML, não botões só de cliente.

## Validação

Build e inspeção desses três slugs.
