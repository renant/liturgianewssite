# P2-03 — Open Graph no tamanho certo, com dados do dia

## Fato

O Open Graph das liturgias usa `/images/android-chrome-192x192.png` e declara `width: 1200` e `height: 630`. O arquivo é um ícone de 192 pixels. WhatsApp, Facebook e X recebem a mesma imagem genérica para todos os dias. O compartilhamento existe na página datada (`components/social-share/social-share.tsx`) e não em `/hoje`.

## Resultado

Cada liturgia, inclusive `/hoje`, tem uma imagem 1200×630 gerada com a data, o título litúrgico e a citação do Evangelho quando ela existir. Sem serviço externo.

## Fora de escopo

- Não integrar API de imagem.
- Não desenhar um editor de card para o usuário.
- UTM nos botões é a P3-03. Aqui a imagem pode existir sem UTM.

## Arquivos

- `app/liturgia/[slug]/opengraph-image.tsx`
- `app/liturgia/hoje/opengraph-image.tsx`
- Metadata em `app/liturgia/[slug]/page.tsx` e `app/liturgia/hoje/page.tsx`: deixar o arquivo de imagem do App Router substituir o ícone 192, em vez de fixar a URL do ícone com dimensões falsas.
- Twitter card `summary_large_image` apontando para a mesma arte.

## Implementação

- Usar `ImageResponse` de `next/og`.
- Texto visível na imagem: “LiturgiaNews”, a data por extenso, o `metadata.title` e, se o parser achar, `Evangelho Lc 9,46-50`.
- Fundo claro, contraste suficiente, sem depender de fonte remota bloqueante. Fonte do sistema ou a já usada no projeto.
- Tamanho `1200` × `630`.
- Se a geração falhar no build de um slug, não voltar a declarar o ícone 192 como se fosse 1200×630. Nesse caso, omitir a imagem daquele slug.

## Aceite

- O HTML de `/liturgia/28-setembro-2026` não referencia o ícone 192 como `og:image`.
- A imagem gerada responde 200 e o cabeçalho ou o arquivo indica PNG de 1200×630.
- Duas datas diferentes não compartilham o mesmo texto na imagem.

## Validação

Build e abertura da rota `opengraph-image` das duas páginas. Conferir as meta `og:image` no HTML.
