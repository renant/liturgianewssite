# P0-06 — Resumo factual no topo da liturgia

## Fato

A resposta para “qual é o Evangelho de hoje?” está no meio da página, depois das leituras. Não há um bloco curto, no início, com data, Evangelho e primeira leitura. Cor litúrgica não existe nos arquivos: não entra neste bloco.

## Resultado

`/liturgia/hoje` e cada página datada abrem com um resumo visível, montado só com dados lidos do MDX daquele dia.

## Fora de escopo

- Não escrever texto genérico do tipo “reserve um minuto para rezar”.
- Não incluir cor, santo ou segunda leitura se o parse não achar.
- Não criar páginas “evangelho de hoje” separadas. O resumo fica na página que já existe.
- Não marcar isso com schema especial.

## Arquivos

- `lib/liturgy-facts.ts` (pode ser o mesmo parser da P0-02)
- `app/liturgia/hoje/page.tsx`
- `app/liturgia/[slug]/page.tsx`

## Implementação

Bloco antes do artigo, em HTML de definição ou parágrafos, por exemplo numa página de hoje:

- Liturgia de hoje — 28 de setembro de 2026
- Evangelho: Lc 9,46-50
- Primeira leitura: Jó 1,6-22

Na página datada que não é hoje, a primeira linha é “Liturgia de 28 de setembro de 2026”, sem a palavra “hoje”.

Se uma referência não for encontrada, a linha correspondente não aparece. O restante da liturgia continua na página, na ordem atual.

## Aceite

- Em `28-setembro-2026`, o HTML visível contém “28 de setembro de 2026” e “Lc 9,46-50” antes do corpo das leituras.
- Nenhuma página ganha “Cor litúrgica” enquanto o MDX não tiver esse campo.
- O resumo de um dia que não é hoje não diz “Evangelho de hoje”.

## Validação

Build e leitura do HTML de `/liturgia/hoje` e de `/liturgia/28-setembro-2025`.
