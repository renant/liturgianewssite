# P3-01 — Uma frase de indicação, sem programa de indicação

## Fato

O único e-mail implementado no repositório é a confirmação de inscrição (`components/emails/email-confirmation.tsx`) e o e-mail de contato. Não há template do envio diário da liturgia neste projeto. Um programa de indicação com código, recompensa ou rastreio de amigos seria outro produto.

## Resultado

Se, e só se, existir template de e-mail de liturgia no repositório no momento da implementação, ele ganha uma frase e um link. Se não existir, o agent para e registra isso. Não cria um sistema de envio.

## Fora de escopo

- Não integrar novo provedor.
- Não criar cupom, crédito ou landing de indicação.
- Não colocar o e-mail do assinante na URL.

## Arquivos

- Procurar templates em `components/emails/`.
- Não criar `app/api/send-daily` nem job.

## Implementação

Frase, se houver template diário:

“Se esta liturgia ajudou você, encaminhe para alguém: https://www.liturgianews.site/liturgia/hoje?utm_source=newsletter&utm_medium=email&utm_campaign=indicacao”

Na confirmação de inscrição, uma frase única é permitida, com o mesmo link, porque esse template existe. Não repetir o pedido em todo parágrafo.

## Aceite

- Nenhum endpoint novo de envio em massa.
- O link, se adicionado, usa os UTMs acima e não inclui e-mail.
- O diff lista os templates alterados. Se nenhum diário existia, o relato diz isso e a confirmação é o único arquivo tocado.

## Validação

Busca por `send-daily`, `audience` e novos `route.ts`. Revisão do HTML do e-mail de confirmação.
