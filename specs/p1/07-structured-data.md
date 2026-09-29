# P1-07 — Dados estruturados iguais ao conteúdo visível

## Fato

O layout declara `WebSite` com `SearchAction` apontando para `https://www.liturgianews.site/blog?search={search_term_string}`. O blog tem um post e não está no menu. A busca não é uma busca do site.

`/liturgia/hoje` marca a liturgia como `BlogPosting` e o autor como `Person` de nome LiturgiaNews. A página datada usa `BlogPosting` com `Organization`, o que ainda chama a liturgia de post de blog. O FAQ de `/contact` está visível e pode permanecer.

## Resultado

Some o `SearchAction`. A liturgia deixa de ser `BlogPosting` e deixa de ter autor pessoa. O que restar descreve título, data e editor que a página mostra.

## Fora de escopo

- Não adicionar `FAQPage`, `HowTo`, `SpecialAnnouncement` nem schema de santo.
- Não marcar notícia do Vaticano como `NewsArticle`.
- Não remover o FAQ de contato, que corresponde às perguntas na página.

## Arquivos

- `app/layout.tsx`
- `app/liturgia/hoje/page.tsx`
- `app/liturgia/[slug]/page.tsx`
- `app/(app)/page.tsx` só se `NewsletterService` afirmar algo que a home não mostra. A home oferece newsletter gratuita: pode permanecer, desde que nome e URL sejam os visíveis.

## Implementação

- Remover `potentialAction` / `SearchAction` do `WebSite`.
- Na liturgia, um JSON-LD `Article` (ou `WebPage` se `Article` parecer forçado) com:
  - `headline` igual ao H1 visível depois da P1-02
  - `datePublished` na data litúrgica, não no instante do build
  - `author` e `publisher` como `Organization` LiturgiaNews
  - `mainEntityOfPage` na URL canônica daquela página
- `BreadcrumbList` só com os itens que o componente de breadcrumb renderiza, incluindo Home se o miolo também mostrar Home. Hoje o breadcrumb visível começa em “Liturgia”. Não acrescentar Home só no JSON-LD de `/hoje` se o miolo não tiver esse elo. Alinhar os dois: ou os dois têm Home, ou nenhum tem.
- Não duplicar o mesmo artigo em microdata `itemScope` e em JSON-LD com tipos diferentes. Preferir só JSON-LD.

## Aceite

- HTML de `/` não contém `SearchAction`.
- HTML de `/liturgia/hoje` e da página datada não contém `BlogPosting` nem `"@type":"Person"`.
- `headline` do JSON-LD é igual ao texto do único H1.
- O FAQ de contato continua.

## Validação

Build e busca dessas strings no HTML. Não é obrigatório passar no Rich Results Test nesta etapa; se for usado, anotar o resultado.
