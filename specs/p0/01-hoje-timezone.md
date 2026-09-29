# P0-01 — Dia litúrgico de `/liturgia/hoje` em America/Sao_Paulo

## Fato

`getTodaySlug()` e `getFormattedDate()` em `app/liturgia/hoje/page.tsx` usam `new Date().getDate()` e `getMonth()`. Na Vercel o processo está em UTC. Entre 21:00 e 23:59 no horário de Brasília o relógio UTC já é o dia seguinte, e a página passa a mostrar a liturgia de amanhã. O build marca essa rota como estática com revalidação de 1h e expiração de 1 ano: se a revalidação gravar o dia errado, esse HTML pode permanecer em cache.

## Resultado

`/liturgia/hoje` usa o dia civil de `America/Sao_Paulo`, inclusive na janela das 21h. A canonical continua `https://www.liturgianews.site/liturgia/hoje`.

## Fora de escopo

- Não redirecionar para a URL datada.
- Não mudar o title além do que a data correta exigir. Títulos datados são a spec P0-02.
- Não alterar páginas históricas.

## Arquivos

- `app/liturgia/hoje/page.tsx`
- Função pura nova, por exemplo `lib/liturgical-date.ts`
- Teste em `lib/liturgical-date.test.ts` com o test runner nativo do Node (`node --test`). Não adicionar Jest.

## Implementação

- Calcular ano, mês e dia com `Intl.DateTimeFormat` e `timeZone: "America/Sao_Paulo"`. Montar o slug `dd-mês-aaaa` com os nomes já usados nos arquivos (`março`, `setembro`).
- Usar essa função no HTML, no metadata e no JSON-LD desta rota.
- Baixar `revalidate` de 3600 para 300. O atraso máximo depois da meia-noite de Brasília fica em cinco minutos, e uma gravação feita na janela errada não fica uma hora no ar.
- Se o MDX do dia não existir, manter a tela atual de “não encontrada”. Não servir o dia anterior no lugar.

## Aceite

- `2026-09-29T02:30:00.000Z` (28/09/2026 23:30 em Brasília) produz `28-setembro-2026`.
- `2026-09-29T03:30:00.000Z` (29/09/2026 00:30 em Brasília) produz `29-setembro-2026`.
- `2026-09-28T15:00:00.000Z` produz `28-setembro-2026`.
- `node --test lib/liturgical-date.test.ts` passa.

## Validação

Rodar o teste. No código, confirmar que `page.tsx` não chama mais `getDate()` / `getMonth()` para decidir o slug.
