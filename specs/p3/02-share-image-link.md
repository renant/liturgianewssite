# P3-02 — Compartilhar a imagem do dia

## Fato

Os botões atuais abrem WhatsApp, Facebook, X, LinkedIn e e-mail com título e URL. Não há uma imagem específica do dia para a pessoa salvar ou mandar. A P2-03 cria essa imagem para o Open Graph.

## Resultado

Na página datada e em `/hoje`, um link “Abrir imagem para compartilhar” aponta para a imagem OG daquela URL. Sem editor e sem download forçado.

## Fora de escopo

- Não implementar esta spec antes da P2-03.
- Não gerar card no cliente com canvas.
- Não adicionar rede social nova.

## Arquivos

- `components/social-share/social-share.tsx`
- Páginas que montam o compartilhamento. Incluir o bloco também em `/liturgia/hoje`, que hoje não tem.

## Implementação

- O `href` é a URL da imagem gerada (`/liturgia/{slug}/opengraph-image` ou a convenção que o Next expuser, desde que seja a arte da P2-03).
- Link visível, abre em nova aba, `rel="noopener noreferrer"`.
- Não interceptar com `navigator.share` a ponto de esconder o link da imagem.

## Aceite

- `/liturgia/hoje` mostra os botões de compartilhamento e o link da imagem.
- O link não é o ícone 192.
- Não há dependência nova.

## Validação

Build e clique ou inspeção do `href` nas duas rotas.
