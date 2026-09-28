# P1-04 — Inscrição sem cobrir a leitura

## Fato

A home tem o formulário. `/liturgia/hoje` abre um modal em tela cheia no primeiro carregamento (`app/liturgia/hoje/newsletter-modal.tsx`), fechado só na sessão. A página datada não tem formulário: o botão “Assinar Newsletter” leva de volta para `/`. Quem chega do Google à leitura precisa sair da página para assinar, ou, em `/hoje`, fecha um modal antes de ler.

## Resultado

O formulário real aparece no fluxo da leitura, depois da reflexão, nas páginas de liturgia. O modal automático deixa de existir.

## Fora de escopo

- Não criar segundo passo de cadastro nem mudar o double opt-in.
- Não colocar o formulário no meio das leituras, antes do Evangelho.
- Não adicionar popup com temporizador.

## Arquivos

- `app/liturgia/hoje/newsletter-modal.tsx` (remover o uso)
- `app/liturgia/hoje/page.tsx`
- `app/liturgia/[slug]/page.tsx`
- `app/(app)/newsletter-sigup-form.tsx`

## Implementação

- Apagar a montagem de `<NewsletterModal />`.
- Depois da reflexão (depois do `<article>` está aceitável, porque a reflexão já está dentro do MDX), mostrar o formulário existente.
- Texto em `/hoje` e na página do dia corrente: “Quer receber a liturgia de amanhã no seu e-mail?”
- Texto nas outras datas: “Receba a liturgia de cada manhã no seu e-mail.”
- O botão continua o do formulário (“Receber Liturgia Diária”), não um link para `/`.
- O formulário fica no fluxo normal da página, largura legível no mobile, sem `position: fixed`.
- Aceitar uma prop `source` (`liturgia_hoje` ou `liturgia_datada`) para a spec de eventos, mesmo que o evento ainda não exista. Não enviar o e-mail para lugar nenhum além do fluxo atual.

## Aceite

- HTML de `/liturgia/hoje` não contém `role="dialog"`.
- HTML da página datada contém `<form` e não depende de clicar em “Assinar” para ir à home.
- Enviar um e-mail inválido ainda mostra o alerta de erro já existente.
- O fluxo feliz continua indo para `/confirm-subscription` depois do double opt-in disparado.

## Validação

Build. Abrir `/liturgia/hoje` e uma página datada: a leitura é visível sem fechar overlay; o formulário aparece abaixo do texto; submeter vazio ou inválido mostra erro.
