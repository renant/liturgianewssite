# Contexto para quem for implementar

## Produto

LiturgiaNews publica a liturgia católica do dia e pede a assinatura gratuita da newsletter. O site em produção é `https://www.liturgianews.site`. O apex redireciona para `www` com 308.

## Stack

- Next.js 16.0.10, React 19, App Router, MDX em disco.
- Sem banco. Leituras, reflexão e notícias do dia estão em `liturgia-content/*.mdx`.
- Newsletter: Resend, double opt-in, formulário em `app/(app)/newsletter-sigup-form.tsx`.
- Analytics: PostHog inicializado em `instrumentation-client.ts`, sem eventos nomeados.
- Deploy: Vercel. O fuso do servidor é UTC. O dia litúrgico do público é `America/Sao_Paulo` (UTC−3, sem horário de verão).

## Renderização observada no build

| Rota | Tipo |
| --- | --- |
| `/`, `/sobre`, `/privacidade`, `/contact`, `/donate`, `/liturgia/hoje` | estáticas; `/hoje` revalida em 1h |
| `/liturgia/[slug]`, `/blog/[slug]` | SSG, `dynamicParams = false` |
| `/liturgia`, `/blog`, feeds e APIs | dinâmicas |

`/liturgia` importa todos os MDX a cada request. Há 433 arquivos de liturgia.

## Decisão já tomada sobre `/liturgia/hoje`

A URL permanece indexável, com canonical nela mesma. Ela é a página estável para “liturgia de hoje” e “evangelho de hoje”. A URL datada guarda o dia e também permanece indexável, com canonical próprio. Não transformar `/hoje` em redirect.

## Fonte dos fatos na página

O frontmatter real é só `title` e `date`. Não há `description` nem cor litúrgica. O Evangelho aparece no corpo, em geral como `**Evangelho (Lc 9,46-50)**`. A primeira leitura aparece perto de `Primeira Leitura`, às vezes com markdown quebrado (`**Primeira Leitura (** **Jó 1,6-22)**`).

## O que já está certo e não deve ser “corrigido”

- Páginas de agosto e setembro de 2026 respondem 200 e estão no sitemap.
- `/liturgia/hoje`, em 28/09/2026 à tarde no horário de Brasília, servia a liturgia desse dia, não a de setembro de 2025.
- Apex → www já está consistente com `metadataBase` e com o sitemap.
