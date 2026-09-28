# P2-01 — Poucas páginas permanentes, escritas de verdade

## Fato

A home quase não tem texto indexável. O blog tem um artigo e não está no menu. As buscas de cauda (“como acompanhar a liturgia diária”, “como fazer lectio divina”, “tempo litúrgico”, “newsletter católica”) não têm uma página do LiturgiaNews feita para elas. Concorrentes ranqueiam com a liturgia do dia; páginas explicativas servem para autoridade e links internos, não para copiar o portal deles.

## Resultado

Três páginas originais, curtas, com link para `/liturgia/hoje` e para o formulário ou a home. Nada de série automática.

## Fora de escopo

- Não gerar dezenas de artigos.
- Não reescrever o post da Quaresma.
- Não publicar `news-content/`.
- Não encher o menu principal. Um link no rodapé basta.

## Arquivos

- `app/acompanhar/page.tsx` — como acompanhar a liturgia diária
- `app/lectio-divina/page.tsx` — o que é e como fazer, em passos reais, sem fingir método oficial da CNBB se não houver citação
- `app/tempo-liturgico/page.tsx` — o que é tempo litúrgico, com link para o arquivo
- `app/sitemap.ts`
- Rodapé em `app/layout.tsx`

## Implementação

Cada página:

- Um H1, dois ou três H2, texto próprio em português.
- Um parágrafo que leva a `/liturgia/hoje`.
- Um convite à newsletter com link para `/` ou o formulário, sem modal.
- Canonical próprio, title e description específicos, sem empilhar sinônimos.
- Inclusão no sitemap com `lastmod` fixo no dia em que a página for escrita, não `new Date()` a cada build.

Não citar volume de busca. Não copiar texto de Canção Nova, CNBB, Paulus ou Vatican News.

## Aceite

- As três rotas respondem 200 e estão no sitemap.
- Cada uma contém link para `/liturgia/hoje`.
- O menu do topo não ganhou três itens novos.
- Não há quarta página “evangelho de hoje” paralela à liturgia.

## Validação

Build e leitura dos três HTML. Conferir que o texto não é um template com a keyword trocada.
