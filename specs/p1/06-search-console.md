# P1-06 — Verificação do Search Console sem token falso

## Fato

`app/layout.tsx` publica `verification.google` com o valor `verification-code` e um comentário dizendo para trocar quando houver código. Isso não verifica o site. Não há evidência no repositório de propriedade verificada por DNS. Sem o Search Console não dá para confirmar a hipótese de que agosto e setembro de 2026 estão fora do índice.

## Resultado

O HTML deixa de emitir a meta de verificação falsa. O lugar certo para o token real fica documentado. Quem implementar esta spec não inventa um código.

## Fora de escopo

- Não criar conta Google.
- Não colar token que não tenha sido entregue pelo mantenedor nesta conversa.
- Não mudar `robots.ts`.

## Arquivos

- `app/layout.tsx`

## Implementação

- Remover a entrada `verification.google` enquanto o valor for o placeholder.
- Comentário curto no metadata: o código real vem do Search Console, método tag HTML, e deve ser colocado em `verification.google` sem aspas de exemplo.
- Não criar arquivo de verificação em `public/` com conteúdo inventado.

## Como o mantenedor usa os dados depois

Isto é orientação, não tarefa de código:

- Queries: “liturgia de hoje”, “evangelho de hoje”, “evangelho do dia”, “leituras da missa de hoje”, datas por extenso.
- Pages: `/liturgia/hoje` contra `/liturgia/{data}`.
- Indexing: inspeção de `/liturgia/hoje`, de um dia de agosto de 2026 e de um dia de junho de 2026.
- Sitemaps: enviar `https://www.liturgianews.site/sitemap.xml` e ver URLs descobertas versus indexadas.
- Core Web Vitals: relatório de experiência, mobile, origem inteira. Meta de campo no p75: LCP ≤ 2,5s, INP ≤ 200ms, CLS ≤ 0,1.
- Relatórios de aparência na busca e recursos de IA generativa, se a propriedade os mostrar: servem para ver se `/hoje` aparece como resposta, não para criar página paralela.

## Aceite

- O HTML da home não contém `google-site-verification` com `verification-code`.
- Nenhum token novo foi commitado.

## Validação

Busca no repositório por `verification-code` e build da home.
