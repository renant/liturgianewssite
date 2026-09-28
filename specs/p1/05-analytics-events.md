# P1-05 — Eventos do funil no PostHog

## Fato

`instrumentation-client.ts` só chama `posthog.init`. Não há `capture`. Não dá para saber quantas pessoas abrem a liturgia, começam o cadastro, confirmam o e-mail ou compartilham.

## Resultado

Eventos nomeados, sem e-mail e sem nome de pessoa, nos pontos do funil.

## Fora de escopo

- Não trocar de ferramenta.
- Não adicionar Google Analytics.
- Não identificar o usuário pelo e-mail (`identify` com e-mail fica de fora).
- Se `NEXT_PUBLIC_POSTHOG_KEY` estiver ausente, a página funciona e nenhum evento quebra o submit.

## Arquivos

- `instrumentation-client.ts` ou um helper `lib/analytics.ts` usado no cliente
- `app/(app)/newsletter-sigup-form.tsx`
- `components/social-share/social-share.tsx`
- `app/liturgia/hoje/page.tsx` e `app/liturgia/[slug]/page.tsx` (view pode ser um client pequeno para não converter a página inteira em client component)
- `app/subscription-confirmed/page.tsx`

## Eventos

- `liturgy_view` com `slug` e `is_today` (true/false).
- `liturgy_today_click` quando um link para `/liturgia/hoje` é clicado, com `from` igual ao pathname.
- `newsletter_signup_start` no primeiro foco ou na primeira alteração do campo de e-mail, uma vez por carregamento, com `source`: `home`, `liturgia_hoje` ou `liturgia_datada`.
- `newsletter_signup_completed` quando a ação de subscribe e o envio do e-mail de confirmação retornam sucesso, antes do redirect. Propriedade `source` apenas.
- `newsletter_email_confirmed` no carregamento de `/subscription-confirmed`. Documentar no código que um reload conta de novo; não há id de contato no cliente de propósito.
- `share_click` com `platform` e `slug`.

Não enviar o valor do e-mail, o id do contato Resend nem query string com e-mail.

## Aceite

- Busca no repositório encontra esses nomes de evento.
- O componente de formulário não importa o e-mail para o objeto do evento.
- Com a chave ausente em desenvolvimento, o submit ainda chama a server action.

## Validação

Revisão do diff. Se houver chave local, um clique de teste no formulário inválido não dispara `newsletter_signup_completed`. Não é obrigatório ter acesso ao painel do PostHog.
