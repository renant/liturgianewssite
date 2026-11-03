# P1-05 — Eventos do funil e telemetria no PostHog

## Fato

`instrumentation-client.ts` inicializa o PostHog em `requestIdleCallback` após filtrar robôs (`lib/bot-detection.ts`). Eventos customizados são disparados por `captureEvent` e erros por `captureError` (`lib/analytics.ts`).

## Resultado

Eventos nomeados, sem e-mail, sem nome de pessoa e sem id de contato da Resend, nos pontos do funil, além de navegação client-side (`capture_pageview: "history_change"`), captura de exceções (`capture_exceptions: true`) e autocapture restrito a `a`, `button` e `form`.

## Fora de escopo

- Não trocar de ferramenta.
- Não adicionar Google Analytics.
- Não identificar o usuário pelo e-mail (`identify` com e-mail fica de fora).
- Se `NEXT_PUBLIC_POSTHOG_KEY` estiver ausente, a página funciona e nenhum evento quebra o submit.

## Arquivos

- `instrumentation-client.ts`, `lib/analytics.ts`, `lib/bot-detection.ts`, `lib/newsletter.ts`
- `app/(app)/newsletter-sigup-form.tsx`, `components/newsletter-panel.tsx`, `components/newsletter-inline.tsx`
- `components/layout/header.tsx`
- `components/social-share/social-share.tsx`
- `app/liturgia/hoje/page.tsx`, `app/liturgia/[slug]/page.tsx`, `components/liturgy/liturgy-page.tsx`, `components/liturgy/adjacent-days.tsx`, `components/liturgy/calendar.tsx`, `components/liturgy/calendar-picker.tsx`
- `app/donate/page.tsx`
- `app/api/send-confirm-email/route.ts`, `app/api/confirm-subscription/route.ts`, `app/subscription-confirmed/page.tsx`
- `app/global-error.tsx`, `hooks/use-form-state.tsx`

## Eventos customizados

- `liturgy_view` com `slug` e `is_today` (`true`/`false`).
- `liturgy_today_click` quando um link para `/liturgia/hoje` é clicado, com `from` igual ao pathname.
- `newsletter_cta_click` quando o link "Receber por e-mail" do cabeçalho é clicado, com `from` (pathname atual) e `placement: "header"`.
- `newsletter_signup_start` no primeiro foco ou na primeira alteração do campo de e-mail, uma vez por carregamento, com `source` tipado (`NewsletterSource`):
  - `home`
  - `liturgia_hoje`
  - `liturgia_datada`
  - `liturgia_hoje_evangelho` (bloco inline logo após o Evangelho em `/liturgia/hoje`)
  - `liturgia_datada_evangelho` (bloco inline logo após o Evangelho em `/liturgia/[slug]`)
  - `tempo_liturgico`
  - `acompanhar`
  - `lectio_divina`
  - `blog`
  - `header`
- `newsletter_signup_completed` quando a ação de subscribe e o envio do e-mail de confirmação (`POST /api/send-confirm-email`) retornam sucesso, antes do redirect. Propriedades: `source` e `signup_ref` (UUID v4 aleatório gerado no cliente no momento do submit, sem relação com e-mail nem com o id de contato da Resend).
- `newsletter_email_confirmed` no carregamento de `/subscription-confirmed`. Lê `ref` e `source` da query string (repassados por `/api/confirm-subscription`) e envia `signup_ref` e `source`. Isso permite fechar o funil em HogQL por `signup_ref` mesmo quando o clique de confirmação ocorre em outro dispositivo/app (`distinct_id` diferente). Não há id de contato da Resend no cliente de propósito; `sessionStorage` evita duplicar o evento em reload da mesma aba.
- `share_click` com `platform` e `slug`.

Não enviar o valor do e-mail, o id do contato Resend nem query string com e-mail.

## Autocapture restrito e atributos `data-ph-capture-attribute-*`

O autocapture está ativo apenas para cliques e submits em `a`, `button` e `form` (`capture_dead_clicks: false`). Elementos de navegação e conversão em Server/Client Components expõem atributos lidos automaticamente pelo PostHog no evento `$autocapture`:

- `data-ph-capture-attribute-nav="adjacent_prev"` / `"adjacent_next"` em `components/liturgy/adjacent-days.tsx`
- `data-ph-capture-attribute-nav="section_nav"` (com `data-ph-capture-attribute-section`) em `components/liturgy/liturgy-page.tsx`
- `data-ph-capture-attribute-nav="calendar_arrow_prev"` / `"calendar_arrow_next"` / `"calendar_day"` em `components/liturgy/calendar.tsx`
- `data-ph-capture-attribute-nav="calendar_picker_month"` (com `data-ph-capture-attribute-month`) em `components/liturgy/calendar-picker.tsx`
- `data-ph-capture-attribute-cta="donate_livepix"` no botão "Doar Agora" em `app/donate/page.tsx`

## Filtro de tráfego sintético (`lib/bot-detection.ts`)

- Quando `skip === true` (`navigator.webdriver`, user-agent de bot/Lighthouse ou `navigator.languages` vazio), o PostHog não é inicializado.
- Quando `suspect === true` (viewport 1920, sem referrer, em `/`, `/donate` ou `/liturgia/hoje` nas janelas 09:00–09:10 UTC e 15:00–15:10 UTC), o PostHog registra superpropriedades `traffic_suspect: true` e `traffic_suspect_reason` e interrompe a gravação de sessão (`stopSessionRecording`).

## Aceite

- Busca no repositório encontra esses nomes de evento e atributos.
- O componente de formulário envia `/api/send-confirm-email` via `POST` (corpo JSON) e não importa o e-mail para o objeto do evento.
- Com a chave ausente em desenvolvimento, o submit ainda chama a server action.

## Validação

Revisão do diff e testes unitários (`bun run test:unit`). Se houver chave local, um clique de teste no formulário inválido não dispara `newsletter_signup_completed`.
