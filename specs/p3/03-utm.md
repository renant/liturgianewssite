# P3-03 — UTM nos compartilhamentos

## Fato

`components/social-share/social-share.tsx` monta a URL canônica sem parâmetros. Um compartilhamento e um acesso direto ficam iguais no PostHog e no referrer. Não há convenção escrita de campanha.

## Resultado

Os links gerados pelos botões de compartilhamento carregam UTM estável. A página canônica indexável não passa a ser a URL com UTM: o `rel=canonical` continua sem query.

## Fora de escopo

- Não criar painel de campanha.
- Não colocar UTM na canonical, no sitemap ou nos links internos de dia anterior/próximo.
- Não marcar e-mail de confirmação além do que a P3-01 já define.

## Arquivos

- `components/social-share/social-share.tsx`

## Convenção

| Origem | source | medium | campaign | content |
| --- | --- | --- | --- | --- |
| WhatsApp | `whatsapp` | `social` | `liturgia` | slug ou `hoje` |
| Facebook | `facebook` | `social` | `liturgia` | slug ou `hoje` |
| X | `x` | `social` | `liturgia` | slug ou `hoje` |
| LinkedIn | `linkedin` | `social` | `liturgia` | slug ou `hoje` |
| E-mail do botão | `email_share` | `email` | `liturgia` | slug ou `hoje` |
| Newsletter, se a P3-01 alterar o template | `newsletter` | `email` | `indicacao` | `hoje` |

`utm_content` não contém e-mail.

## Aceite

- O href de WhatsApp contém `utm_source=whatsapp`, `utm_medium=social`, `utm_campaign=liturgia`.
- O canonical da página não contém `utm_`.
- Links “Dia anterior” não contêm `utm_`.

## Validação

Inspeção do HTML do componente e do canonical da página datada.
