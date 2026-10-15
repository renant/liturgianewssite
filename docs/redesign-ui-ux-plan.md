# Plano de redesign do LiturgiaNews

Data: 14 de outubro de 2026, horário de Brasília.
Status: direção aprovada e implementada localmente, preservando as cores claras originais. Validação em [redesign-implementation.md](redesign-implementation.md).

## Direção recomendada

Transformar o site em uma experiência editorial de leitura e oração: chegar à liturgia de hoje, escolher outra data no calendário e ler sem interrupções. A newsletter continua visível, com convite após a leitura e na página inicial.

O calendário substitui integralmente a listagem de liturgias. A entrada continua em `/liturgia`, com o mês atual; as URLs mensais e datadas já existentes permanecem. A identidade mantém a serifada nos títulos e o âmbar como destaque, com o fundo claro original, menos caixas e melhor hierarquia.

## Escopo e evidências

- Revisão do código das rotas públicas, componentes compartilhados, estilos, metadados, sitemap e robots.
- Navegação local em 19 URLs representativas, nas larguras de 390 e 1440 px: inicial, arquivo, calendário, hoje, liturgia passada, liturgia futura, blog, artigo, sobre, três guias, contato, apoio, privacidade, duas confirmações, erro e 404.
- Capturas e inspeção de títulos, canonical, headings, landmarks, nomes dos links e overflow. Todas as páginas amostradas têm um H1 e não apresentaram overflow horizontal nessas duas larguras.
- A primeira seção de leituras em `/liturgia/hoje` começa aproximadamente em y=984 px no mobile e y=738 px no desktop, na coleta local. A redundância antecede o conteúdo principal.
- Há 456 arquivos de liturgia, de 21/07/2025 a 21/10/2026. Outubro tem conteúdo até o dia 21; os dias posteriores precisam de estado indisponível.
- Amostra de passado: `02-setembro-2026`; de futuro: `17-outubro-2026`. Não houve verificação individual das 456 páginas.
- Esta avaliação não é medição de produção, Lighthouse ou dados de campo. Teclado completo, leitor de tela, zoom, envio de formulários e dispositivos físicos entram na validação da implementação.
- Metadados e medidas coletadas: [baseline da revisão](redesign-audit-baseline.json). Resultados registrados antes de qualquer implementação visual.

## Problemas prioritários

1. **Leitura começa tarde.** O título e a data reaparecem no resumo e no MDX. A celebração aparece no cabeçalho e novamente no artigo. Dois cartões grandes de navegação aumentam a distância até as leituras.
2. **Calendário sem estrutura de calendário.** A rota mensal distribui cartões em uma, duas ou três colunas, sem semana, alinhamento do primeiro dia ou marca de hoje. No celular, é uma lista longa.
3. **Navegação prioriza páginas auxiliares.** O cabeçalho mostra Privacidade e Contato, mas não oferece Calendário ou Blog. No mobile, ocupa várias linhas.
4. **Estilo fragmentado.** Há fundos e paddings repetidos dentro do layout; a largura de leitura fica em 512 px mesmo no desktop. Geist é carregada como variável, mas a fonte do corpo observada é a pilha padrão do sistema.
5. **Acessibilidade no compartilhamento.** No mobile, Facebook, X, LinkedIn e E-mail ficam sem nome acessível porque o texto é ocultado e os ícones são decorativos.
6. **Referências ausentes nos conteúdos novos.** `extractLiturgyFacts` reconhece o Markdown antigo, mas não `<strong>Evangelho</strong> (Lc 12,8-12)` e a primeira leitura do MDX futuro. Isso prejudica resumo, description e imagem social.
7. **Metadados inconsistentes.** A inicial repete “LiturgiaNews” no title. As confirmações e `/error` herdam title e canonical da inicial e `index, follow`, embora estejam bloqueadas no robots. Há dois `main` em arquivo, blog e apoio.

## Sistema visual e navegação global

### Identidade

- Fundo creme próximo ao fundo original; texto escuro neutro; âmbar escuro para ações e detalhes. Retirar os gradientes repetidos e as bordas amarelas de blocos puramente textuais.
- Preservar inicialmente a serifada do sistema nos títulos; aplicar de fato a Geist já instalada à interface e ao corpo. Evitar baixar outra família antes de medir necessidade.
- Texto de leitura de 18 px, entrelinha 1,7–1,8; rótulos de interface de pelo menos 14 px. Título principal de 28–32 px no celular e 36–40 px em desktop, com quebra equilibrada.
- Coluna de leitura de aproximadamente 65 caracteres, limitada a 720 px; estrutura geral de até 1152 px. Calendário ocupa uma área mais larga que o artigo.
- Margens laterais de 16 px em mobile, 24 px em tablet e 32 px em desktop. Ritmo de espaçamento de 4/8/12/16/24/32/48 px, sem somar wrappers de página e layout.
- Divisores sutis entre áreas; caixas reservadas para formulários e ações. Sem ilustração pesada ou efeito que concorra com a leitura.

### Cabeçalho e rodapé

- Desktop: marca, **Hoje**, **Calendário**, **Blog** e ação **Receber por e-mail** que abre a seção real de inscrição na inicial.
- Mobile: marca e ação compacta de inscrição; segunda linha curta com Hoje, Calendário e Blog. Evitar menu oculto para os três destinos principais.
- Estado ativo visível e `aria-current`. A seção Calendário permanece ativa nas páginas de outras datas.
- Sobre, Contato, Privacidade, Apoiar e os três guias ficam organizados no rodapé. O Blog passa a ter entrada na navegação principal.
- Usar `components/layout/header.tsx` e `footer.tsx` como fonte única; hoje o layout repete essa estrutura sem importar esses componentes.
- Um `main` por documento. Manter o atalho “Pular para o conteúdo principal”.

## Calendário como única exploração de datas

### Rotas

- `/liturgia`: calendário do mês atual em Brasília. Menu e link da inicial usam esse destino, com texto **Calendário litúrgico**.
- `/liturgia/calendario/[ano]/[mes]`: mês específico, com URL compartilhável e canonical próprio. Preservar a grafia das URLs existentes, inclusive meses acentuados.
- Liturgia datada: **Calendário** retorna ao mês da liturgia lida, não ao mês corrente.
- Parâmetros antigos de lista (`page`, `search`, `sort`, `limit`) deixam de criar apresentações distintas. Usar canonical limpo em `/liturgia` e deixar de gerar esses links.
- Não redirecionar permanentemente `/liturgia` para um mês que muda. O índice passa a renderizar o calendário diretamente, mantendo seu valor de entrada estável.
- Se o mês atual não tiver conteúdo, apresentar o mês atual com estado claro e acesso ao último mês disponível. Não saltar silenciosamente para outra data.

### Composição

1. H1 “Calendário litúrgico” e descrição curta.
2. Link destacado no topo: **Abrir a liturgia de hoje** → `/liturgia/hoje`.
3. Barra do mês: mês anterior, mês/ano atual, próximo mês; seletor de mês e ano para datas distantes. Navegação restrita aos meses existentes, com fallback navegável sem JavaScript.
4. Grade de sete colunas, domingo a sábado; alinhamento real do primeiro dia e espaços inertes fora do mês.
5. Hoje tem marca textual e `aria-current="date"`; dia indisponível tem estilo e descrição próprios, sem link falso. Não usar apenas cor para diferenciar estados.

### Mobile

- Preservar as sete colunas. Mostrar número do dia, área tocável e marca de hoje; retirar os títulos extensos das células estreitas.
- Dias publicados são links reais que abrem diretamente a liturgia, com nome acessível incluindo a data completa e a celebração.
- Para caber em 320 px com margens de 16 px, usar sete faixas sem gap, altura mínima de 44 px e largura disponível por coluna; não exigir 44 px de largura em cada célula se isso causar overflow.
- Não criar lista alternativa, carrossel obrigatório nem painel que exija dois toques para ler uma data.

### Desktop

- Células podem trazer a celebração em até duas linhas e número com maior destaque. O nome completo continua acessível pelo link e na página do dia; não depender de tooltip.
- Navegação entre meses fica junto ao mês, e o link de hoje permanece à vista.

## Liturgia de hoje e liturgias datadas

### Abertura única

Ordem recomendada:

1. Linha discreta: **Calendário** à esquerda; **Liturgia de hoje** à direita apenas quando o dia lido não for hoje.
2. Um H1: “Liturgia de 2 de setembro de 2026”. Em `/hoje`, “Liturgia de hoje” pode preceder a data no mesmo H1, sem outro bloco repetido.
3. Uma linha de contexto: dia da semana e celebração. Retirar o dia da semana duplicado do título de contexto quando já estiver apresentado separadamente; manter a informação integral uma vez.
4. Índice curto de seções existentes, como Leituras, Evangelho, Reflexão e Notícias, com links para âncoras estáveis. Omitir as seções ausentes; não mostrar placeholders.
5. Uma linha de navegação: **← Anterior** e **Próximo →**, com data completa no nome acessível. Ela ocupa a largura da coluna sem cartões empilhados. Repetir no fim da leitura para continuidade.
6. Artigo começando pelas leituras, com títulos claros para Primeira leitura, Salmo, eventual Segunda leitura e Evangelho.

### Remoções solicitadas

- Retirar **Voltar para a lista** e substituir o destino por calendário do mês correspondente.
- Retirar o cartão `LiturgySummary` da apresentação de leitura: ele repete data e referências que já existem nos títulos das leituras. Preservar a extração dos fatos para SEO e imagens sociais.
- Retirar a primeira heading e o parágrafo inicial de data duplicados do corpo MDX na renderização da liturgia.
- Retirar **Endereço permanente deste dia** de `/liturgia/hoje`. A página datada continua existindo e sendo descoberta no calendário, sitemap e navegação.
- Retirar **A reflexão e as notícias serão adicionadas neste dia.** Sem caixa de aviso substituta.
- Na própria data de hoje, não adicionar link autorreferente “Esta é a liturgia de hoje”.

### Conteúdo, navegação e conversão

- Leituras completas permanecem no HTML de mobile e desktop. Não esconder a liturgia atrás de tabs que carregam texto apenas depois de um clique.
- Normalização do MDX restrita ao cabeçalho redundante e à data inicial. Não usar CSS para ocultar filhos por posição, nem regras que removam parágrafos de leitura por parecerem datas.
- Tratar Markdown legado e HTML `<strong>` dos conteúdos recentes. Estruturar as referências como headings das leituras, com IDs únicos e previsíveis.
- Preservar versículos, respostas e refrões. Não confundir repetição litúrgica intencional com repetição de interface.
- Dia anterior/próximo só existe quando a data civil adjacente tiver conteúdo. Em lacunas, omitir o link correspondente; não pular silenciosamente vários dias.
- Compartilhamento compacto após o artigo, com nomes acessíveis em todos os tamanhos. No mobile, priorizar compartilhar pelo dispositivo quando disponível e oferecer fallback com links identificados; cancelamento não é erro.
- Convite de newsletter após a liturgia, sem modal automático. Texto curto, label de e-mail visível, estado de envio e erro associado ao campo.

## Demais páginas: avaliação e resultado proposto

### Inicial `/`

Hoje a apresentação e o formulário ocupam uma coluna estreita e centralizada mesmo no desktop; leitura e calendário aparecem como links abaixo da inscrição.

Proposta: abertura editorial com mensagem breve e acesso imediato a **Ler a liturgia de hoje** e **Calendário**. Newsletter em seção própria, próxima da abertura. Em desktop, mensagem e inscrição podem dividir espaço; em mobile, ações de leitura precedem o formulário. Manter a missão da newsletter explícita e corrigir a marca repetida no title.

### Blog `/blog`

Hoje há um artigo e uma estrutura visual de três colunas; aparecem “1 de 1” e contagem sem utilidade para esse volume.

Proposta: lista editorial simples com título, resumo e data, crescendo para duas colunas apenas se houver volume. Ocultar paginação quando houver uma página. Manter URLs e filtros válidos do blog; retirar somente a listagem de liturgias. Reusar o mesmo container e hierarquia global.

### Artigo `/blog/[slug]`

Proposta: mesma largura confortável da liturgia, breadcrumb curto, H1 do artigo sem repetição, metadados de publicação discretos, compartilhamento e newsletter sem caixas pesadas. Conservar citações, conteúdo, links e dados de autoria existentes. Corrigir title com marca repetida e links de compartilhamento sem nome no mobile.

### Guias `/acompanhar`, `/lectio-divina`, `/tempo-liturgico`

Hoje usam `prose` com apresentação distinta das outras páginas editoriais.

Proposta: aplicar o padrão de artigo e navegação de contexto; manter texto completo e convite discreto para a liturgia de hoje. Em `/tempo-liturgico`, trocar “arquivo de liturgias” por **calendário litúrgico**. Não inventar dados de cores litúrgicas que o conteúdo não fornece.

### Sobre `/sobre`

Proposta: narrativa curta com missão e funcionamento, largura de leitura consistente e um convite final para acompanhar. Corrigir acentuação dos textos existentes; não criar números de leitores, depoimentos ou identidade de equipe sem fonte.

### Contato `/contact`

Proposta: formulário como área principal e perguntas frequentes ao lado no desktop, abaixo no mobile. Usar erros por campo com `aria-invalid`/`aria-describedby`, foco no primeiro erro e confirmação anunciada. Permitir redimensionar a mensagem verticalmente. Preservar double opt-in e integrações; não enviar mensagens de teste reais nesta fase.

### Apoio `/donate`

Proposta: finalidade breve e ação de doação perto da abertura. Em mobile, o botão abre o LivePix no mesmo aparelho; o QR code fica como alternativa. Em desktop, ação e QR podem ficar lado a lado. Usar “QR code abaixo” no mobile e evitar a indicação fixa “ao lado”. Preservar o destino de pagamento existente; remover o segundo landmark `main`.

### Privacidade `/privacidade`

Proposta: documento legível com seções claras, acentuação correta e link de contato. Apresentação consistente, sem reescrever alegações sobre tratamento de dados sem revisão factual. Atualizar data de revisão apenas se houver revisão real do conteúdo.

### Inscrição pendente `/confirm-subscription`

Proposta: “Confirme seu e-mail”, explicação curta e dois passos para localizar a mensagem. Disponibilizar **Ler a liturgia de hoje** enquanto aguarda. Não incluir botão de reenviar sem implementar controle de envio. Não alegar que houve envio ao acessar a URL diretamente sem contexto.

### Inscrição confirmada `/subscription-confirmed`

Proposta: confirmação breve e próxima ação **Ler a liturgia de hoje**. Preservar o rastreamento existente sem duplicar eventos ao voltar ou atualizar. Revisar a promessa de “amanhã” conforme o funcionamento real dos envios.

### Erro `/error` e página inexistente

Proposta: mensagem clara e caminhos úteis para hoje e calendário, usando o mesmo sistema visual. Confirmações e `/error` recebem title próprio e `noindex`; evitar canonical herdado da inicial. Uma liturgia inexistente deve usar resposta 404 real, sem “não encontrada” com status 200. `/error` é uma página de feedback do fluxo, não equivale automaticamente a uma resposta HTTP 500.

## SEO durante o redesign

### Endereços e descoberta

- Manter slugs das liturgias, dos artigos e dos meses. A troca de apresentação em `/liturgia` preserva sua URL.
- Manter `/liturgia/hoje` indexável, com canonical próprio, e cada liturgia datada com canonical próprio, conforme a decisão atual do projeto. A retirada do link permanente é visual; não é retirada da URL datada.
- A semelhança entre hoje e a data correspondente continua existindo. Acompanhar a canonical escolhida pelo Google no Search Console; canonical declarado é um sinal, não garantia de indexação. Não alegar que o redesign elimina duplicidade de conteúdo.
- No calendário mensal, links reais para todos os dias publicados e navegação para meses existentes. No índice, seletor navegável para todos os meses disponíveis, permitindo alcançar o histórico sem depender de muitos “meses anteriores”.
- Ajustar breadcrumbs e seus dados estruturados ao contexto Calendário → mês → dia, sem uma camada que leve à lista removida.
- Manter o sitemap com URLs datadas e mensais; retirar apenas URLs efetivamente descontinuadas. Nenhuma URL datada é descontinuada nesta proposta.
- Usar `publishedAt`/`updatedAt` reais para datas de publicação e `lastmod`; a data de celebração é um campo diferente. Não publicar `lastmod` futuro apenas porque a liturgia é de uma data futura.
- Preservar feeds, APIs, inscrições e parâmetros de atribuição usados no compartilhamento.

Os sinais de canonical e os links internos precisam ser consistentes, conforme a [documentação do Google sobre canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls). Se alguma URL precisar mudar posteriormente, preparar mapeamento específico e validação de redirects seguindo o [guia de migrações do Google](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).

### Conteúdo e metadados

- Um H1 por página e hierarquia de seções coerente. O objetivo é clareza do documento; a simples contagem de H1 não garante ranking.
- Títulos e descriptions específicos, sem repetir a marca ou prometer reflexão numa página que só tem leituras.
- Corrigir a extração de referências dos MDX com HTML antes de usar esses fatos em title, description e Open Graph.
- Metadados, conteúdo principal e dados estruturados equivalentes em mobile e desktop. O Google usa a versão mobile para indexação, conforme as [orientações de mobile-first indexing](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing).
- Validar `Article`, `BreadcrumbList` e a coleção mensal com informações que existem na página. Não acrescentar schema ou keyword stuffing só para obter snippets.
- Evitar duas marcações divergentes de breadcrumb, hoje presentes como microdata no componente e JSON-LD na página.
- Confirmar status 200 para conteúdo real e 404 para slugs inválidos. `noindex` deve ser rastreável para ser observado: revisar conjuntamente o bloqueio atual das páginas transacionais no robots, limitado a essas rotas e sem mudar política de bots de IA.

### Desempenho

- Preservar Server Components e geração estática onde adequada. JavaScript cliente apenas onde a interação exigir.
- Não adicionar biblioteca de calendário para uma grade mensal de links. Usar as dependências existentes.
- Imagens com dimensão reservada; nenhuma imagem decorativa pesada no topo da liturgia.
- A data de hoje e o mês corrente precisam atualizar em Brasília e não ficar congelados na data do build. Definir e verificar revalidação de até 5 minutos, inclusive em mudança de mês e ano.
- Medir depois da implementação: metas de campo no p75 de LCP ≤2,5 s, INP ≤200 ms e CLS ≤0,1. São metas, não resultados desta revisão; referência: [Core Web Vitals](https://web.dev/articles/vitals).

## Acessibilidade e comportamento responsivo

- Foco visível, ordem de leitura previsível e navegação completa por teclado.
- Alvos de toque confortáveis: 44 px de altura como meta de projeto. O mínimo WCAG 2.2 de 24×24 px tem exceções de espaçamento; não confundir a meta de conforto com o requisito mínimo. [Referência W3C](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
- Contraste de texto normal de pelo menos 4,5:1; texto grande 3:1. Validar a paleta final, incluindo estados inativos e foco. [Referência W3C](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
- Sem rolagem horizontal em 320/390/768/1024/1440 px. Conferir também paisagem, zoom de 200% e reflow de 400% em desktop.
- Preferência de movimento reduzido aplicada às transições e rolagem suave; não adicionar animações à leitura.
- Nomes acessíveis nos controles compactos, feedback de formulários anunciado e preservação dos valores em erros.
- Dias indisponíveis, celebrações muito longas, mês com seis semanas, bissexto, lacuna no conteúdo e início/fim do acervo têm apresentações definidas.

## Implementação em cinco etapas

### 1. Base visual e estrutura compartilhada

Arquivos: `app/globals.css`, `tailwind.config.ts`, `app/layout.tsx`, `components/layout/header.tsx`, `components/layout/footer.tsx`, `components/ui/button.tsx`, `components/breadcrumbs/breadcrumbs.tsx`.

Entregar fontes aplicadas, tokens, containers, navegação Hoje/Calendário/Blog, foco, movimento reduzido e um único `main`. Validar inicial, contato e guia como representantes antes de propagar os estilos.

### 2. Calendário e entrada da seção

Arquivos: `app/liturgia/page.tsx`, `app/liturgia/calendario/[ano]/[mes]/page.tsx`, `lib/liturgical-date.ts`, `lib/content-metadata.ts`, novo componente compartilhado de calendário.

Entregar grade de semanas, atalho de hoje, seletor de mês/ano, limites do acervo e estados indisponíveis. Atualizar links em inicial, guias, 404 e breadcrumbs. Preservar funções de dados usadas por feeds; remover código da listagem somente quando comprovadamente sem consumidores.

### 3. Leitura das liturgias

Arquivos: `app/liturgia/hoje/page.tsx`, `app/liturgia/[slug]/page.tsx`, `components/liturgy/*`, `mdx-components.tsx`, `lib/liturgy-facts.ts`, `components/social-share/social-share.tsx`, formulário compartilhado da newsletter.

Entregar abertura única, normalização do cabeçalho MDX, navegação compacta, referências corretas, índice de seções reais e convite de inscrição. Usar um componente de apresentação compartilhado para hoje e datas, mantendo suas regras de metadata separadas. Não alterar o blog por acidente ao personalizar o MDX da liturgia.

### 4. Todas as páginas auxiliares

Aplicar o plano da inicial, blog, artigo, três guias, sobre, contato, apoio, privacidade, confirmações, erro e 404. Revisar também os estados de envio, falha e sucesso dos formulários. Nenhuma necessidade de alterar o scrapper ou os templates de e-mail para este redesign do site.

### 5. Validação e preparação de publicação

- Rodar lint, verificação de tipos e build. Comparar HTML final, canonical, title, status e sitemap das rotas representativas.
- Testes focados para normalização do MDX legado/novo, extração de referências, cálculo da grade e navegação entre datas/meses. Não criar testes que apenas espelham classes CSS.
- Testar os horários 20h59/21h/23h59/00h de Brasília e virada de mês/ano com relógio fixo; verificar atualização em cache e fuso do servidor.
- Testar fevereiro bissexto, mês com seis semanas, celebração longa e dias sem conteúdo. Seleção por teclado e leitura dos nomes acessíveis fazem parte do aceite.
- Comparação visual de todas as famílias de página em mobile/desktop. Medir desempenho em build de produção; não usar os números do servidor de desenvolvimento como Core Web Vitals.
- Validar formulários com transporte de e-mail simulado; não disparar inscrições ou mensagens reais para testar layout.
- Publicação fica como etapa posterior à implementação e validação.

## Critérios de aceite do produto

- [ ] A lista de liturgias e seus cartões de “Próximos dias” foram substituídos pelo calendário.
- [ ] Links “Ver todas as liturgias” e “Voltar para a lista” viraram links de calendário com contexto correto.
- [ ] O topo do calendário abre `/liturgia/hoje` em uma ação.
- [ ] O dia publicado abre diretamente, sem seleção intermediária obrigatória.
- [ ] Abertura da liturgia mostra uma data e uma celebração, sem repetir título ou resumo.
- [ ] Não há “Endereço permanente deste dia” nem aviso de reflexão/notícias futuras.
- [ ] Navegação anterior/próximo é compacta e não aponta para conteúdo ausente.
- [ ] Leituras ficam visíveis mais cedo; meta para o exemplo de hoje em 390×844: início da seção de leituras antes de 600 px, ajustando o limite para títulos excepcionalmente longos.
- [ ] Todas as páginas públicas seguem os mesmos padrões de largura, tipografia e navegação.
- [ ] Calendário funciona em 320 px sem overflow e preserva dias/semana alinhados.
- [ ] Os quatro compartilhamentos hoje sem nome estão identificados no mobile.
- [ ] URLs históricas, links mensais, feeds e inscrições continuam funcionando.
- [ ] SEO e desempenho foram medidos no build final; não há promessa de ganho de ranking sem dados.

## Relação com as specs anteriores

Esta proposta substitui as decisões de interface de P0-05 (link permanente visível), P0-06 (cartão de resumo), P1-02 (celebração repetida como heading) e P2-02 (calendário em cartões), conforme o pedido atual. Preserva as decisões de URLs indexáveis, fuso de Brasília, conteúdo completo e ausência de modal sobre a leitura. A auditoria de setembro é contexto histórico; seus números não representam esta coleta.

## Skill configurada

`web-design-guidelines` instalada em `.agents/skills/web-design-guidelines/SKILL.md`, somente neste repositório, a partir de [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines). Instalação feita pelo helper de skills com destino local explícito. Disponível à descoberta em um próximo turno.

A revisão usou a versão atual das [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md). Os apontamentos rastreáveis estão em `docs/web-design-guidelines-review.md`.
