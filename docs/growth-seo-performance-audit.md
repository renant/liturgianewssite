# Auditoria de crescimento, SEO e performance — LiturgiaNews

Data da coleta: 28 de setembro de 2026. Nenhuma alteração de produto foi feita. As specs para implementar o backlog estão em [specs/README.md](../specs/README.md).

O objetivo do site continua estreito: mais pessoas leem a liturgia do dia e assinam a newsletter gratuita. Este relatório não propõe portal, app nem funcionalidade que distraia disso.

## Como ler

**Fato** é o que o código ou a resposta HTTP mostraram nesta data. **Hipótese** precisa de Search Console ou de dado de campo para fechar. **Recomendação** é o que fazer com o fato. As duas coisas não estão misturadas nas seções de problema.

## Resumo

O site em produção, nesta tarde, serve a liturgia certa em `/liturgia/hoje`: 28 de setembro de 2026, Evangelho Lc 9,46-50. O relato de essa URL presa em setembro de 2025 não se reproduziu. As páginas de agosto e setembro de 2026 existem, respondem 200 e estão no sitemap. A fraqueza para busca não é 404.

O que impede o conteúdo atual de competir com “evangelho de hoje” e “liturgia de 28 de setembro de 2026” é outro conjunto de fatos: o title da página datada é só o nome da semana; `/hoje` calcula o dia em UTC e erra entre 21h e meia-noite no Brasil; o arquivo pagina com canonical da página 1; o `lastmod` de todas as 442 URLs é o dia do build; title, description e canonical do arquivo saem fora do `<head>`; a home quase não tem texto; não há dado de índice porque a meta de verificação do Google é o placeholder `verification-code`.

No laboratório, as cinco páginas medidas passaram das metas de LCP, TBT e CLS numa execução só. A home no celular ficou com LCP em 2,5s, no limite. Não há dado de campo (p75). O custo real do arquivo é outro: a rota é dinâmica, importa 433 MDX por request e não é cacheada na CDN.

## Arquitetura

Fato. Next.js 16.0.10, React 19.2.0, App Router, sem diretório `pages`. Conteúdo em MDX no repositório. Sem banco e sem CMS. Deploy na Vercel (`server: Vercel`, região de cache observada `gru1`). `metadataBase` é `https://www.liturgianews.site`. O apex `https://liturgianews.site/` responde 308 para `www`.

Conteúdo:

- `liturgia-content/`: 433 liturgias, de 21 de julho de 2025 a 28 de setembro de 2026. Frontmatter real: `title` e `date`. Nenhum arquivo tem `description` nem cor litúrgica.
- `content/`: um post, `orientacoes-catolicas-para-a-quaresma.mdx`.
- `news-content/`: cerca de 211 digests com “Leia na fonte” (Vatican News, Canção Nova, CNBB). Nenhuma rota lê essa pasta.

Newsletter: server action cria o contato na Resend com `unsubscribed: true`; `GET /api/send-confirm-email` manda o e-mail; o link chama `GET /api/confirm-subscription` e grava `unsubscribed: false`. Double opt-in existe. O envio diário da liturgia não tem template neste repositório. Só há o e-mail de confirmação e o de contato.

Analytics: `posthog.init` em `instrumentation-client.ts`. Nenhum `posthog.capture`. No HTML de produção o cliente ainda pede scripts em `us-assets.i.posthog.com` e `us.i.posthog.com` (config, autocapture, web-vitals). `@next/third-parties` está no `package.json` e não é importado.

Fontes: Geist e Geist Mono via `next/font`. O layout também faz preconnect com `fonts.googleapis.com` e `fonts.gstatic.com`, que o Lighthouse não precisou baixar. Ícones e `manifest.json` existem. A imagem de Open Graph das liturgias é o ícone 192×192 declarado como 1200×630.

Build local (`bun run build`, Next 16.0.10, Turbopack), nesta máquina, em 28/09/2026:

- Compilou em 5,4s. Gerou 454 páginas estáticas em 2,4s. Sem erro de TypeScript.
- Aviso repetido: `baseline-browser-mapping` está com dados com mais de dois meses. Não muda o comportamento do site.
- O log não imprime a tabela antiga de First Load JS.

| Rota | Build | Cache observado em produção |
| --- | --- | --- |
| `/`, `/sobre`, `/privacidade`, `/contact`, `/donate`, `/confirm-subscription`, `/subscription-confirmed`, `/error` | estáticas | `x-nextjs-prerender: 1`, `x-vercel-cache: HIT` na home e em `/sobre` |
| `/liturgia/[slug]`, `/blog/[slug]` | SSG, `dynamicParams = false` | prerender, canonical da própria URL, 200 para agosto e setembro de 2026 |
| `/liturgia/hoje` | estática, revalidate 1h, expire 1 ano | `HIT`, `age` na casa de 3000s, conteúdo do dia 28 |
| `/liturgia`, `/blog` | dinâmicas | `cache-control: private, no-cache, no-store` |
| `/feed.xml`, `/liturgia/feed.xml`, APIs | dinâmicas | feed com `s-maxage=3600` |
| `/sitemap.xml`, `/robots.txt` | estáticas, geradas no build | sitemap com 442 URLs |

Client components de verdade: formulário da newsletter, formulário de contato, modal de `/hoje`, botões de compartilhamento e o `Label` do Radix. O restante das páginas é Server Component. O peso de JavaScript não vem de dezenas de componentes cliente. Vem do runtime compartilhado e do PostHog dentro do maior chunk.

## `/liturgia/hoje`, cache e a data

Fato. `getTodaySlug()` usa `new Date().getDate()` e `getMonth()`, sem `timeZone`. Na Vercel o processo está em UTC. O dia litúrgico do leitor é `America/Sao_Paulo` (UTC−3, sem horário de verão). Entre 21:00 e 23:59 no horário de Brasília, o UTC já é o dia seguinte. A página, se revalidar nessa janela, grava a liturgia de amanhã por até uma hora (`revalidate = 3600`). O build mostra ainda `expire` de 1 ano: se uma revalidação falha, o Next pode continuar servindo o último HTML bom por muito tempo.

Fato, nesta coleta (por volta de 18h em Brasília, ainda dia 28 nos dois fusos): `GET /liturgia/hoje` com User-Agent de Googlebot devolveu 200, title `Liturgia do Dia 28 de setembro de 2026 - Liturgia Diária Católica`, canonical `https://www.liturgianews.site/liturgia/hoje`, H1 “Liturgia do Dia” e outro H1 vindo do MDX. O corpo era a 26ª Semana do Tempo Comum, Evangelho Lc 9,46-50. Não havia “2025” no HTML.

Fato. A URL datada do mesmo dia também é 200, com outro canonical: `https://www.liturgianews.site/liturgia/28-setembro-2026`. São dois documentos indexáveis com o mesmo texto. `/hoje` não linka o endereço permanente.

Hipótese. Um crawler que tenha visto setembro de 2025 em `/hoje` não bate com o HTML atual. Explicações que continuam abertas, sem prova: snippet antigo no índice do Google; confusão com `/liturgia/28-setembro-2025`, que existe e é o 26º Domingo do Tempo Comum; ou um HTML antigo mantido pelo `expire` de 1 ano numa época em que a revalidação falhava. Isso só se confirma com a inspeção de URL no Search Console. Não é o comportamento de produção hoje.

Recomendação. Manter `/liturgia/hoje` indexável, com canonical nela mesma. É a URL estável para “liturgia de hoje” e “evangelho de hoje”. Redirect 302 para a URL datada acertaria o conteúdo e jogaria fora essa URL. Canonical de `/hoje` apontando para a data do dia tem o mesmo efeito: o sinal de “hoje” passaria a uma URL que amanhã é ontem. A página datada segue com canonical próprio, porque a busca por uma data específica precisa de um endereço permanente. As duas se ligam com link visível, não com redirect. O cálculo do dia passa a ser `America/Sao_Paulo`, e a revalidação deixa de poder gravar o dia errado por uma hora. Specs P0-01 e P0-05.

## Performance e Core Web Vitals

Metas pedidas, no p75 de campo: LCP ≤ 2,5s, INP ≤ 200ms, CLS ≤ 0,1.

Fato. Não há CrUX, Search Console nem relatório de campo no repositório. Os números abaixo são uma execução de Lighthouse 12, mobile e desktop, contra a produção, nesta máquina, em 28/09/2026. Não são mediana e não são p75. INP de laboratório não existe; o proxy é o TBT. TTFB de cerca de 10ms é o primeiro byte de um cache HIT na borda (`gru1`), não o tempo até o HTML completo.

| Página | Mobile perf | LCP | FCP | TBT | CLS | Speed Index | SEO | Desktop LCP |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | 96 | 2,47s | 1,03s | 146ms | 0 | 1,3s | 100 | 0,56s |
| `/liturgia` | 97 | 2,14s | 0,92s | 72ms | 0 | 3,7s | 91 | 0,50s |
| `/liturgia/hoje` | 99 | 2,27s | 0,92s | 51ms | 0,026 | 1,3s | 100 | 0,51s |
| `/liturgia/28-setembro-2026` | 98 | 2,27s | 0,91s | 109ms | 0 | 0,9s | 100 | 0,72s |
| `/sobre` | 98 | 2,28s | 0,92s | 97ms | 0 | 0,9s | 100 | 0,49s |

Desktop: performance 100 nas cinco. TBT 0ms, exceto a home com 48ms. CLS de `/hoje` no desktop: 0,008.

O LCP no celular é o H1 (no arquivo, o primeiro H2 da lista). Não é uma imagem hero. A home no celular ficou a 30ms do limite de 2,5s nesta única corrida. Folga pequena para uma fonte e um bundle que ainda bloqueiam um pouco o render.

Peso, home no celular: 376 KiB transferidos. Cerca de 235 KiB disso são script. O maior arquivo, `b2a0e732ed027f5c.js`, tem 392 KB sem compressão e contém `posthog-js` junto com código de framework. O Lighthouse estimou 55 KiB de JavaScript não usado nesse chunk e 25 KiB de JavaScript legado, parte no mesmo chunk e parte em `web-vitals.js` servido pelo PostHog. Há também CSS apontado como render-blocking, com economia estimada de 0ms. Preconnect para Google Fonts não corresponde a um download: as fontes vêm do `next/font`.

Fato separado do laboratório. Um download completo de `/liturgia` nesta mesma data levou cerca de 1,2s e 100 KB de HTML, com `x-vercel-cache: MISS` e `private, no-store`. O TTFB do Lighthouse continua baixo porque o Next manda o `<head>` (cerca de 2 KB) antes de terminar de importar os 433 MDX. O visitante espera o corpo; a CDN não guarda a página. Páginas estáticas (`/`, `/hoje`, datada, `/sobre`) fecharam o download em cerca de 0,1s.

Recomendação. Não trocar framework nem adicionar camada de cache externa. Parar de importar MDX na listagem, deixar title e canonical dentro do `<head>`, e só então olhar de novo o LCP da home. Reduzir o PostHog (autocapture e scripts extras) é o único corte de JavaScript com efeito claro. Spec P1-01. Medir p75 no Search Console depois da verificação; até lá, não tratar o laboratório como meta batida em campo.

## SEO técnico

### Sitemap e robots

Fato. `https://www.liturgianews.site/sitemap.xml` é um único `urlset`, 442 URLs, não é índice. Inclui home, blog, arquivo, contato, doação, sobre, privacidade, o post, 433 liturgias e `/liturgia/hoje`. Agosto de 2026 tem 31 URLs. Setembro de 2026 tem 28, até o dia 28. `30-setembro-2026` e outubro de 2026 não estão no ar porque o arquivo ainda não existe. Todos os `lastmod` eram `2026-09-28`. O código usa `mtime` do arquivo e `new Date()` nas rotas fixas. No build, o checkout iguala o mtime, então o Google não distingue liturgia nova de liturgia de 2025. `changefreq` das páginas datadas é `daily`, embora o texto histórico não mude todo dia.

`robots.txt` permite `/` e alguns prefixos e bloqueia `/api/`, `/error/`, `/confirm-subscription/` e `/subscription-confirmed/`. Não há regra para Googlebot, Bingbot, OAI-SearchBot, GPTBot ou Google-Extended. O padrão é permitir. Sitemap e host apontam para `www`. `/sobre` e `/privacidade` não estão na lista `allow`, mas também não estão em `disallow`; o Google costuma rastrear mesmo assim. Não há `llms.txt` no site. Não há motivo, nesta auditoria, para criar um.

Decisão em aberto, sem mudança agora. Aparecer no ChatGPT Search (OAI-SearchBot) e permitir treino (GPTBot) são escolhas diferentes. Hoje as duas ficam no mesmo balde do `User-Agent: *`, ou seja, permitidas. Qualquer bloqueio futuro é decisão editorial, não requisito de SEO.

### Indexação de agosto e setembro de 2026

Fato. Estas URLs responderam 200, com canonical próprio e prerender:

- `/liturgia/15-agosto-2026`
- `/liturgia/01-setembro-2026`
- `/liturgia/28-setembro-2026`
- `/liturgia/30-julho-2026`
- `/liturgia/15-junho-2026`
- `/liturgia/28-setembro-2025`

Elas estão no sitemap. A primeira página do arquivo, ordenada da data mais nova, lista setembro de 2026 e portanto linka os dias recentes. A paginação chega à última página (dias de julho de 2025). O crawler consegue andar. O que ele recebe em `?page=2` é canonical da página 1, sem query. O mesmo vale para o blog.

Hipótese. A ausência dessas URLs numa busca pública por “agosto de 2026” ou por uma data específica não é página inexistente. Pode ser índice incompleto, ou página indexada que não ranqueia porque o title não contém a data. Uma busca `site:` nesta data devolveu o arquivo, com snippet dos dias de setembro, e não devolveu a URL diária de agosto. “liturgia de hoje site:liturgianews.site” não devolveu resultado nessa ferramenta. Isso não prova desindexação. Prova que a ferramenta não mostrou essas URLs. A confirmação é o relatório de páginas e a inspeção de URL no Search Console, que o site ainda não verifica de verdade.

Lacunas reais de conteúdo, não de rota: 1º a 20 de julho de 2025 (o acervo começa em 21), 17 de setembro de 2025, 5 de dezembro de 2025. Não inventar esses dias nesta fase.

### Metadados

Fato. Home, `/hoje`, página datada e `/sobre` colocam title, description e canonical dentro do `<head>`. `/liturgia` e `/blog`, por serem dinâmicas, fecham o `<head>` em cerca de 2 KB e só então, no corpo, emitem `<title>`, description, canonical e JSON-LD. No arquivo, a description está no byte 36174. O Lighthouse deu SEO 91 nessa URL e 100 nas outras, com a auditoria “Document does not have a meta description”, embora a tag exista mais abaixo. Googlebot renderiza JavaScript e pode içar isso. Um leitor de HTML cru, e o próprio Lighthouse, não contam.

Titles atuais:

- Home: “Newsletter da Liturgia Católica Diária | LiturgiaNews”. Alinhado à proposta. Pouco texto em volta para “evangelho de hoje”.
- `/hoje`: “Liturgia do Dia 28 de setembro de 2026 - Liturgia Diária Católica”. Bom para a intenção de hoje. A description repete a fórmula e acrescenta o título litúrgico.
- Página datada: “26ª Semana do Tempo Comum | Segunda-feira | LiturgiaNews”. Não contém a data nem Lc 9,46-50. A description é o mesmo título, porque não há `description` no MDX.
- Arquivo: “Liturgia Católica Diária - Arquivo”. Genérico, aceitável para uma lista.
- Sobre: “Sobre a LiturgiaNews”. O texto visível está sem acento (“Conheca”, “missao”, “voce”).

Open Graph e Twitter existem. A imagem é sempre o ícone 192, com width 1200 e height 630. Isso produz preview ruim no WhatsApp e no Facebook.

`verification.google` é a string `verification-code`. A tag sai no HTML e não verifica propriedade nenhuma.

JSON-LD:

- `WebSite` no layout, com `SearchAction` para `/blog?search=`. O blog tem um post e não está no menu. A ação descreve uma busca que o site não oferece.
- Home: `NewsletterService`. Bate com o que a página é.
- Liturgia: `BlogPosting`. Em `/hoje` o autor é `Person` chamado LiturgiaNews. Na página datada o autor é `Organization`. Não é um post de blog, e não há pessoa autora.
- `BreadcrumbList` em `/hoje` inclui Home. O breadcrumb visível começa em “Liturgia”.
- Contato: `FAQPage` com as mesmas perguntas que estão na página. Pode ficar.
- Microdata `BlogPosting` convive com o JSON-LD nas liturgias.

H1. `/hoje` tem dois: “Liturgia do Dia” e o `#` do MDX. A página datada tem um, o nome da semana, sem a data. H2 do corpo: Leituras do Dia, Reflexão do Evangelho, Notícias do Vaticano. Não há dia anterior nem próximo. Não há calendário.

Recomendação de title, sem empilhar sinônimo. Página datada: `Liturgia de 28 de setembro de 2026: Evangelho Lc 9,46-50`. A description leva o nome da semana e a primeira leitura se o parse achar. Se o parse falhar, a data e o título do frontmatter bastam. Não criar parágrafo genérico “reserve um minuto para rezar”. Specs P0-02, P0-06, P1-02, P1-07.

## SEO de conteúdo e intenções

Não houve ferramenta de volume. O agrupamento é por intenção, a partir das buscas que o pedido listou e do que a SERP mostrou em 28/09/2026.

Intenção “hoje”, alta e repetida todo dia: liturgia de hoje, liturgia diária, liturgia diária de hoje, evangelho de hoje, evangelho do dia, leituras da missa de hoje, salmo do dia. A URL certa já existe: `/liturgia/hoje`. Falta o resumo no topo (data, evangelho, primeira leitura) e o H1 único com a data. Santo do dia só cabe quando o título do MDX já é a festa. Não dá para inventar santo nos dias feriais, cujo título é a semana do tempo comum.

Intenção de data: “liturgia 28 de setembro de 2026”. A URL existe. O title não responde à frase. É o buraco mais barato de fechar.

Intenção de calendário: calendário litúrgico, cores litúrgicas, tempo litúrgico. Cor litúrgica não está nos dados: não prometer cor até o MDX ter o campo. O calendário do mês pode listar somente as liturgias já publicadas, sem criar páginas ou links para datas futuras. Spec P2-02.

Intenção de aprender: como acompanhar a liturgia diária, como fazer lectio divina, receber a liturgia por e-mail, newsletter católica. Cabe em três páginas escritas, não numa fábrica de artigos. Spec P2-01.

Concorrentes que a busca “liturgia diária de hoje” / “evangelho de hoje” mostrou nesta data, e o que o title ou a URL deles fazem. LiturgiaNews não apareceu nessa lista.

- Vatican News: `/pt/palavra-do-dia/2026/09/28.html`. Data no caminho. Title “Evangelho e palavra do dia 28 setembro 2026”. Leituras e comentário de um papa, com autoria institucional clara.
- Paulus: `/portal/liturgia-diaria/`. Página “de hoje”, com cor, semana e as leituras. É o modelo de URL estável, parecido com `/hoje`.
- homilias.com.br: title com data por extenso, dia da semana e `Lc 9,46-50`.
- iatioben.com.br: `/liturgia-diaria/28-09-2026`. Data numérica, cor, uma frase de introdução e as leituras.
- Acervo Católico: `/liturgia/2026-09-28`. Data ISO. Avisa se a pessoa não está na liturgia de hoje.
- Arautos: `/liturgia-diaria?date=2026-09-28`. A data fica na query. É o padrão mais fraco dos seis, e ainda assim o title traz a data.
- evangeli.net apareceu para o evangelho do dia, com homilia curta e santo.

O que eles têm em comum, e que o LiturgiaNews ainda não tem na URL datada: a data por extenso no title, a citação do Evangelho, e em vários casos a cor. Não copiar homilia, oração do dia, áudio ou app. A cor só entra se passar a existir no conteúdo.

## AEO e GEO

Fato, alinhado à orientação atual do Google: AI Overviews e AI Mode se apoiam no mesmo rastreio e na mesma página que a busca comum. Não há atalho separado neste site.

Uma página responde “qual é o Evangelho de hoje?” se a citação estiver no começo, no title e num H1 só. Hoje a citação está no meio do artigo, o title de `/hoje` ajuda, e o title datado não. O resumo factual da spec P0-06 é a peça de AEO. Ele usa o MDX daquele dia. Não é texto escrito para o modelo.

O que não fazer por causa de mecanismo generativo: `llms.txt`, schema que a página não mostra, parágrafos repetindo a keyword, bloquear ou liberar GPTBot “para ranquear”. A política de bots fica como está até decisão explícita.

## Fontes, autoria e direitos

Fato. As leituras estão copiadas por inteiro dentro do MDX. O trecho de 28/09/2026 segue o texto litúrgico usado no Brasil (Livro de Jó e Lucas, com as respostas “Palavra do Senhor” / “Palavra da Salvação”). Não há crédito de tradução na página, nem na página Sobre. A tradução oficial do lecionário em português do Brasil é obra editorial; em geral a edição é da CNBB. Isso é risco de direitos, não uma conclusão de violação. Não há neste repositório contrato, licença ou correspondência que prove permissão ou proibição.

A reflexão do Evangelho também está sem autor e sem fonte. Não dá para saber, só pelo arquivo, se é texto original do projeto.

As notícias do Vaticano na liturgia são links e títulos, já dentro do MDX, apontando para `vaticannews.va`. Não há fetch em runtime. Não adicionam latência ao request. A pasta `news-content/` atribui fonte (“Leia na fonte”) e não é publicada.

E-E-A-T que já existe: Sobre, contato com FAQ visível, privacidade que cita a Resend e o cancelamento pelo rodapé do e-mail, `humans.txt` com o e-mail `contato@liturgianews.site` e “Last update: 2025/01/21”. O que não existe: nome de quem responde pelo texto, método de preparação da liturgia, crédito das leituras, política editorial. A página Sobre descreve a missão e não a origem do texto. Recomendação, sem transformar o site num institucional: um parágrafo em Sobre dizendo de onde vêm as leituras e quem revisa, assim que o mantenedor puder afirmar isso com verdade. Não inventar equipe.

## Conversão

Onde dá para assinar hoje:

- Home: formulário de e-mail, botão “Receber Liturgia Diária”, erro visível, double opt-in, ida para `/confirm-subscription` ou `/error`.
- `/liturgia/hoje`: modal em tela cheia no primeiro carregamento, com o mesmo formulário. Some só depois de fechar, e só naquela sessão (`sessionStorage`). Quem veio ler o Evangelho encontra um overlay.
- Página datada: não há formulário. Há um botão “Assinar Newsletter” que volta para `/`. O compartilhamento (WhatsApp, Facebook, X, LinkedIn, e-mail) está aqui e não em `/hoje`.
- Sobre: link de texto para a home.

Não há UTM. O link de confirmação leva o id do contato na query. O endpoint que dispara o e-mail recebe o endereço em `GET`, então o e-mail pode ir parar em log e referrer. Não é o tema central desta auditoria; não vale um fluxo novo só por isso.

Recomendação. Tirar o modal. Colocar o formulário que já existe depois da reflexão, com a frase “Quer receber a liturgia de amanhã no seu e-mail?” no dia corrente. Na página de outro dia, “Receba a liturgia de cada manhã no seu e-mail.” Não interromper a leitura. Spec P1-04.

Compartilhamento: os botões atuais são suficientes. O que falta para o preview é a imagem 1200×630 com a data e o Evangelho, gerada no próprio Next, sem serviço novo. Spec P2-03. UTM só nos links de compartilhamento, nunca na canonical. Spec P3-03. Uma frase de encaminhamento no e-mail só se o template existir; o envio diário não está neste repositório. Spec P3-01. Sem programa de indicação, código ou recompensa.

## Analytics e Search Console

Fato. PostHog está instalado e não mede o funil. Eventos que passam a fazer falta, sem mandar e-mail para a ferramenta: `liturgy_view`, `liturgy_today_click`, `newsletter_signup_start`, `newsletter_signup_completed`, `newsletter_email_confirmed` (carregamento de `/subscription-confirmed`, sabendo que um reload conta de novo), `share_click`, e `source` da inscrição (`home`, `liturgia_hoje`, `liturgia_datada`). Spec P1-05.

Search Console. A meta de verificação é falsa. Pode haver verificação por DNS fora do repo; o código não mostra isso. Enquanto a tag placeholder estiver publicada, ela não serve. Spec P1-06: remover o placeholder e não inventar token.

Quando a propriedade existir, a leitura útil é esta:

- Queries: as intenções da seção de conteúdo, mais as datas por extenso.
- Pages: `/liturgia/hoje` ao lado de `/liturgia/28-setembro-2026` e de um dia de junho de 2026, para separar “não indexada” de “indexada e sem clique”.
- Indexing: inspeção dessas três URLs.
- Sitemaps: enviar `https://www.liturgianews.site/sitemap.xml` e comparar descobertas com indexadas, depois que o `lastmod` deixar de ser o dia do build.
- Core Web Vitals: experiência na origem, celular, p75. É esse número que vale contra as metas, não o Lighthouse desta auditoria.
- Recursos de IA generativa, se a propriedade mostrar: observar se `/hoje` aparece. Não criar página paralela por causa disso.

Há um script `indexnow.js` que envia URLs do sitemap para o IndexNow. A chave pública está em `public/`, como o protocolo pede. Não é substituto do Search Console e não entra no backlog como obrigação.

## Problemas

Cada item: fato, impacto, dificuldade, arquivos, dependência, como validar. A recomendação correspondente está na spec citada.

### P0-1. `/hoje` usa o fuso do servidor

Fato. `getDate()` / `getMonth()` sem `America/Sao_Paulo`. Impacto: três horas por dia a página “de hoje” é a de amanhã, e o ISR pode guardar isso. Dificuldade baixa. Arquivos: `app/liturgia/hoje/page.tsx`. Dependência: nenhuma. Validar com datas fixas em UTC que caiam antes e depois da meia-noite de Brasília. Spec [p0/01-hoje-timezone.md](../specs/p0/01-hoje-timezone.md).

### P0-2. Title datado não responde à busca por data

Fato. Title igual ao nome da semana. Impacto: a URL que deveria ranquear para “liturgia 28 de setembro de 2026” não contém essa frase. Dificuldade baixa. Arquivos: `app/liturgia/[slug]/page.tsx` e o MDX. Dependência: parser tolerante ao markdown quebrado da primeira leitura. Validar o HTML de `28-setembro-2026` e de um arquivo em que a citação não case. Spec [p0/02-dated-titles.md](../specs/p0/02-dated-titles.md).

### P0-3. Paginação canônica na página 1

Fato. `?page=2` canonical é `/liturgia`. Impacto: o histórico deixa de ser um caminho de rastreio confiável; o sitemap vira o único mapa sério, e o `lastmod` dele está uniforme. Dificuldade baixa. Arquivos: `app/liturgia/page.tsx`, `app/blog/page.tsx`. Validar o `<link rel="canonical">` dentro do `<head>` depois da P1-01. Spec [p0/03-archive-canonical.md](../specs/p0/03-archive-canonical.md).

### P0-4. `lastmod` é a data do build

Fato. 442 URLs com `lastmod` de 28/09/2026. Impacto: o Google não prioriza o dia novo. Dificuldade baixa. Arquivo: `app/sitemap.ts`. Validar dois builds com o mesmo `lastmod` para uma liturgia de 2025. Spec [p0/04-sitemap-lastmod.md](../specs/p0/04-sitemap-lastmod.md).

### P0-5. `/hoje` e a URL do dia não se apontam

Fato. Dois HTML 200, canonicals diferentes, sem link cruzado. Impacto: sinal dividido e leitor sem endereço estável para guardar. Dificuldade baixa. Não resolver com redirect. Spec [p0/05-permanent-link.md](../specs/p0/05-permanent-link.md).

### P0-6. A resposta da liturgia não está no topo

Fato. Evangelho e primeira leitura só aparecem no corpo. Impacto: pior snippet e pior resposta para “qual é o Evangelho de hoje?”. Dificuldade baixa, junto com o parser da P0-2. Não incluir cor. Spec [p0/06-factual-summary.md](../specs/p0/06-factual-summary.md).

### P1-1. Arquivo importa 433 MDX e esconde o metadata

Fato. Rota dinâmica, `no-store`, download ~1,2s, title e canonical fora do `<head>`, SEO do Lighthouse 91 por description “ausente”. Impacto: arquivo lento para cada visita e metadados frágeis para quem não executa JavaScript. Dificuldade média. Arquivo principal: `app/liturgia/actions.tsx`. Spec [p1/01-archive-index.md](../specs/p1/01-archive-index.md).

### P1-2. Dois H1 em `/hoje`

Fato. H1 da página mais H1 do MDX. Impacto: hierarquia confusa; o H1 datado não diz a data. Dificuldade baixa, sem editar 433 arquivos. Spec [p1/02-single-h1.md](../specs/p1/02-single-h1.md).

### P1-3. Sem dia anterior nem próximo

Fato. Só existe “voltar ao arquivo”. Impacto: leitura e rastreio da semana dependem da paginação. Dificuldade baixa. Não linkar arquivo que não existe (`20-julho-2025`, `17-setembro-2025`, `05-dezembro-2025`). Spec [p1/03-adjacent-days.md](../specs/p1/03-adjacent-days.md).

### P1-4. Modal na frente da leitura, e página datada sem formulário

Fato. Overlay em `/hoje`; na URL que o Google deve mandar tráfego, o CTA volta para a home. Impacto: conversão do tráfego de busca e atrito de quem só queria ler. Dificuldade baixa. Spec [p1/04-newsletter-cta.md](../specs/p1/04-newsletter-cta.md).

### P1-5. Funil invisível

Fato. PostHog sem eventos. Impacto: não dá para saber se o trabalho de SEO vira assinatura. Dificuldade baixa. Não enviar e-mail no evento. Spec [p1/05-analytics-events.md](../specs/p1/05-analytics-events.md).

### P1-6. Verificação do Google é placeholder

Fato. `verification.google = "verification-code"`. Impacto: as hipóteses de índice ficam sem como ser medidas. Dificuldade trivial no código; a conta Google é do mantenedor. Spec [p1/06-search-console.md](../specs/p1/06-search-console.md).

### P1-7. Schema que não é a página

Fato. `SearchAction` para o blog, `BlogPosting`, autor `Person`. Impacto: dado estruturado que não corresponde ao visível. Dificuldade baixa. O FAQ de contato fica. Spec [p1/07-structured-data.md](../specs/p1/07-structured-data.md).

### P2. Páginas permanentes, calendário, imagem de compartilhamento

Não são bugs. São as únicas expansões que cabem no objetivo: três textos originais, calendário dos meses que já têm arquivo e Open Graph 1200×630 com dados do dia. Specs em `specs/p2/`.

### P3. Indicação, card e UTM

Experimentos. Não constroem produto novo. Specs em `specs/p3/`.

## Hipóteses que ainda precisam de dado

- Agosto e setembro de 2026 estão fora do índice, ou estão no índice e não ranqueiam para a data. O HTML está no ar.
- `/liturgia/hoje` ainda tem um snapshot antigo no Google com setembro de 2025. O HTML atual não tem.
- O p75 de LCP no celular passa de 2,5s, apesar do laboratório desta noite. A home ficou no limite numa corrida só.
- A reflexão e as leituras têm licença de uso. O repositório não mostra.
- O Search Console já está verificado por DNS. O HTML não está.

## Quick wins

Dá para fazer em poucas horas, sem conteúdo novo:

1. Dia litúrgico em `America/Sao_Paulo` e revalidação curta.
2. Link permanente entre `/hoje` e a URL do dia, sem mudar canonical.
3. Title datado com a data e, se o parse achar, o Evangelho.
4. Resumo de três linhas no topo, só com dado do MDX.
5. Canonical de `?page=n` na própria página.
6. `lastmod` pela data do frontmatter.
7. Apagar a meta `verification-code`.
8. Apagar o `SearchAction` do blog.
9. Desligar o modal e mostrar o formulário depois da reflexão.

## Não fazer

- Portal de notícias com `news-content/`, blog em massa, ou uma URL por variação (“evangelho de hoje”, “evangelho do dia”, “evangelho de hoje católico”).
- Keyword stuffing no title ou um bloco de texto invisível.
- `BlogPosting`, `HowTo`, FAQ ou schema de santo que a página não mostre.
- `llms.txt` como tarefa de GEO.
- Mudar GPTBot ou OAI-SearchBot nesta fase.
- Redirect de `/hoje` para a data.
- Comprar backlink, publicar em massa em paróquia, Reddit ou TabNews.
- Dependência nova para ler frontmatter, se um parse das primeiras linhas resolver.
- App, conta de usuário, comentário, homilia em áudio, ou cor litúrgica inventada.
- Tratar o Lighthouse desta noite como prova de que o p75 de campo está bom.

## Backlog na ordem de execução

1. P0-01 fuso de `/hoje`.
2. P0-05 link permanente. Usa a mesma função de data.
3. P0-02 titles datados.
4. P0-06 resumo factual. Usa o mesmo parser.
5. P0-04 `lastmod`.
6. P0-03 canonical da paginação.
7. P1-01 índice do arquivo e metadata dentro do `<head>`.
8. P1-02 um H1.
9. P1-07 dados estruturados.
10. P1-04 formulário no lugar do modal.
11. P1-03 dia anterior e próximo.
12. P1-06 remover o placeholder do Search Console. O token real espera o mantenedor.
13. P1-05 eventos do PostHog.
14. P2-01 três páginas evergreen, quando houver quem escreva o texto com calma.
15. P2-02 calendário do mês.
16. P2-03 Open Graph 1200×630.
17. P3-03 UTM nos botões de compartilhamento.
18. P3-02 link da imagem, depois da P2-03.
19. P3-01 uma frase no e-mail, só se o template do envio diário aparecer no repositório. O de confirmação pode levar a frase; não criar um sistema de envio.

P2 e P3 não começam sozinhos. O ganho de busca e de assinatura está na lista até o item 13.
