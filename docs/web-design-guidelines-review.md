# Revisão de UI — Web Interface Guidelines

14/10/2026 · estado anterior ao redesign e navegador local em 390/1440 px · apontamentos que orientaram a implementação do redesign.

Esta é a auditoria inicial, com localizações do código anterior. Os resultados após as correções estão em [Implementação e validação](redesign-implementation.md).

## Acessibilidade e interação

- `components/social-share/social-share.tsx:48` — quatro links sem nome acessível no mobile; texto some e ícones estão ocultos da árvore acessível.
- `components/ui/button.tsx:8` — `transition-all`; limitar propriedades e respeitar movimento reduzido.
- `components/ui/button.tsx:25` — alvos compactos de 32–36 px; aumentar área de toque das ações principais.
- `components/breadcrumbs/breadcrumbs.tsx:23` — breadcrumb sem estratégia de quebra para nomes longos; validar 320 px.
- `components/breadcrumbs/breadcrumbs.tsx:52` — separador decorativo anunciado; usar `aria-hidden`.
- `app/contact/contact-form.tsx:22` — validação somente global; associar erros aos campos e focar primeiro erro.
- `app/contact/contact-form.tsx:86` — `resize-none` impede ampliar campo de mensagem.
- `app/(app)/newsletter-sigup-form.tsx:58` — label só para leitor de tela; tornar instrução visível e associar erro ao e-mail.
- `app/(app)/newsletter-sigup-form.tsx:94` — spinner sem alternativa de movimento reduzido.
- `app/layout.tsx:108` — rolagem suave global sem variante de movimento reduzido.
- `app/layout.tsx:167` — navegação sem indicação da página ativa; calendário ausente.

## Clareza e composição

- `components/liturgy/liturgy-summary.tsx:6` — repete a data do H1.
- `components/liturgy/mdx-heading.tsx:5` — celebração do MDX reaparece após já estar no cabeçalho.
- `components/liturgy/adjacent-days.tsx:13` — cartões empilhados no mobile afastam as leituras.
- `app/liturgia/hoje/page.tsx:69` — link permanente removido pela solicitação atual.
- `app/liturgia/[slug]/page.tsx:70` — retorno ainda leva à lista.
- `app/liturgia/[slug]/page.tsx:81` — aviso de conteúdo futuro removido pela solicitação atual.
- `app/liturgia/calendario/[ano]/[mes]/page.tsx:59` — cartões sem estrutura semanal ou indicação de hoje.
- `app/layout.tsx:149` — define variável da Geist, mas corpo usa fonte padrão; aplicar família.
- `app/liturgia/hoje/page.tsx:62` — fundo e padding repetidos dentro do layout global.

## SEO e semântica associados

- `app/(app)/page.tsx:8` — marca duplicada no title por combinação com template global.
- `app/blog/[slug]/page.tsx:52` — mesmo problema de marca duplicada no title.
- `app/confirm-subscription/page.tsx:1` — sem metadata própria; herda canonical e indexação da inicial.
- `app/subscription-confirmed/page.tsx:1` — mesma herança de metadata.
- `app/error/page.tsx:1` — mesma herança de metadata; texto “500” não define status HTTP.
- `lib/liturgy-facts.ts:8` — expressão de Evangelho não reconhece HTML `<strong>` dos arquivos novos.
- `app/liturgia/[slug]/page.tsx:56` — fallback de conteúdo inexistente não chama `notFound()`.
- `app/blog/[slug]/page.tsx:98` — fallback do artigo também deve garantir status 404.
- `app/liturgia/page.tsx:113` — segundo `main` dentro do layout global; equivalente no blog e apoio.

Referência consultada: [Vercel Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md). Os pontos de clareza e SEO também incorporam o pedido do usuário e a inspeção do projeto; não são todos regras da skill. Detalhes, prioridades e aceite em [Plano de redesign](redesign-ui-ux-plan.md).
