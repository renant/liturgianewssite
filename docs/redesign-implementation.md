# Redesign implementado — LiturgiaNews

14 de outubro de 2026 · implementação local pronta para revisão, sem publicação.

## Resultado

- A identidade mantém o fundo creme próximo ao `amber-50` original, títulos escuros e âmbar nas ações. A prévia escura foi somente uma referência de estrutura.
- `/liturgia` agora é o calendário mensal. Todos os dias publicados abrem diretamente suas liturgias. Meses anteriores, escolha de mês/ano e acesso rápido à liturgia de hoje usam links reais.
- As páginas de leitura têm uma abertura única, navegação compacta antes e depois do artigo e índice das seções que realmente existem. Saíram o resumo repetido, o link de endereço permanente e o aviso de reflexão/notícias futuras.
- O MDX mantém o texto das leituras. A transformação atua na apresentação da abertura e nos títulos das leituras, inclusive nos arquivos recentes com HTML. Não altera os arquivos do acervo.
- Cabeçalho e rodapé são compartilhados; inicial, blog, guias, sobre, contato, apoio, privacidade, confirmações e erro seguem a mesma base visual.
- Compartilhamentos possuem nomes acessíveis no mobile. Formulários apresentam erros por campo, preservam os valores e focam o primeiro campo inválido. O atalho para o conteúdo principal também recebe foco corretamente.

## SEO e endereços

- URLs históricas de dias e meses preservadas. Não há redirect permanente para o mês corrente.
- Corrigida a resolução dos parâmetros acentuados no build, incluindo março. Canonicals preservam os endereços existentes.
- `/liturgia/hoje` e as páginas datadas mantêm seus canonicals próprios, conforme a decisão anterior do projeto. A semelhança do conteúdo entre essas URLs continua existindo.
- Parâmetros antigos da lista não produzem outra apresentação; o canonical de entrada é `/liturgia`.
- Confirmações e erro têm title próprio e `noindex`, sem canonical herdado da inicial. Os bloqueios dessas páginas no robots foram removidos para permitir a leitura do `noindex`; o bloqueio das APIs e a política de bots de IA não mudaram.
- Referências bíblicas dos conteúdos com HTML passaram a alimentar corretamente descriptions e imagens sociais. Breadcrumbs e dados estruturados usam o contexto do calendário.
- O sitemap diferencia publicação/atualização da data de celebração. A verificação final não encontrou `lastmod` futuro.
- Calendário, páginas de liturgia e sitemap usam revalidação de 300 segundos sob demanda. O cálculo de hoje usa Brasília; ISR pode servir a versão anterior na primeira solicitação que dispara uma revalidação.

## Validação realizada

- **Build de produção:** 497 páginas geradas, sem erro de compilação ou tipagem. Metadados dos documentos gerados não apresentam 404 inesperado; os documentos internos de 404/erro conservam seus status próprios.
- **Qualidade:** lint e verificação de tipos passaram.
- **25 testes:** fuso e virada de mês/ano, fevereiro bissexto, grade de seis semanas, referências antigas/novas, âncoras únicas, conteúdo preservado e parâmetros acentuados/inválidos.
- **Acervo completo:** a transformação dos 456 MDX preservou os parágrafos longos e todos os links originais. Refrões e datas dentro do conteúdo também têm cobertura específica.
- **Rotas:** 456 liturgias e 16 meses responderam 200; datas/meses inexistentes responderam 404. O sitemap contém 484 URLs.
- **Navegador:** 19 URLs em 390 e 1440 px, com um H1 e um main por página, sem overflow horizontal, IDs duplicados ou âncoras quebradas. Os links visíveis possuem nome; links dentro do seletor fechado foram excluídos da checagem de visibilidade.
- **Larguras adicionais:** calendário, hoje e contato conferidos em 320, 768 e 1024 px. O seletor aberto ficou entre x=16 e x=272 em uma tela de 320 px.
- **Leitura mobile:** a seção de leituras de hoje passou de aproximadamente 984 px para 499 px a partir do topo, na comparação das amostras locais de 390 px.
- **Formulários:** submissões inválidas verificadas na interface; sucesso e falha das ações testados com transporte simulado. Nenhum e-mail real foi enviado nos testes. O double opt-in foi preservado.
- **Desempenho local:** seis amostras sem limitação de CPU/rede, nas páginas inicial, calendário e hoje, em mobile/desktop. Candidatos de LCP entre 32 e 56 ms e CLS 0 na janela observada. Esses números de localhost não representam desempenho de produção, INP nem p75 de campo.

Os dados estão em [redesign-audit-after.json](redesign-audit-after.json), comparáveis à [baseline anterior](redesign-audit-baseline.json).

## Organização e compatibilidade

- Apresentação da liturgia compartilhada em `components/liturgy/liturgy-page.tsx`; calendário em `components/liturgy/calendar.tsx`.
- Transformação de MDX restrita a `liturgia-content` em `lib/remark-liturgy.mjs`. O H1 do blog permanece intacto.
- Helpers de datas, calendário e parâmetros possuem testes próprios. Newsletter e contato continuam usando as integrações existentes.
- Zod atualizado de `^3.24.2` para `^3.25.76`, ainda na versão 3, para atender à dependência do verificador de lint instalado. O lockfile foi atualizado e os fluxos de validação foram retestados.
- Sem biblioteca nova de calendário, migração de framework, alterações no scrapper ou reescrita do acervo.

## Limites da verificação

Esta revisão usa navegador automatizado e emulação de larguras. Não substitui testes em aparelhos físicos, leitores de tela e dados de campo após a publicação. Não houve acesso ao Search Console nem promessa de ganho de ranking. A publicação continua sendo uma etapa separada.
