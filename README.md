# LiturgiaNews

Site em Next.js que permite aos usuários se inscreverem em uma newsletter diária sobre liturgia católica.

## Funcionalidades

- Sistema de inscrição em newsletter com confirmação por e-mail
- Formulário de contato com notificações por e-mail
- Design responsivo utilizando Tailwind CSS
- Tratamento de formulários server-side com validação Zod
- Envio de e-mails via API Resend
- Construído com React moderno e TypeScript

## Stack Tecnológica

- **Framework**: Next.js 15.1 com App Router
- **Estilização**: Tailwind CSS
- **Serviço de E-mail**: Resend
- **Validação de Formulários**: Zod
- **Componentes UI**: Componentes personalizados usando shadcn/ui

## Estrutura do Projeto

- app: Páginas e rotas API do Next.js
- components: Componentes React reutilizáveis
- hooks: Hooks React personalizados
- lib: Funções utilitárias
- public: Arquivos estáticos

## Principais Recursos

### Inscrição na Newsletter

- Fluxo de inscrição com confirmação dupla
- Sistema de confirmação por e-mail
- Gerenciamento de inscrição via e-mail

### Formulário de Contato

- Validação de formulário com tratamento de erros
- Notificações por e-mail para submissões
- Seção de Perguntas Frequentes

## Geração de liturgias futuras

- **Diária, às 08h de São Paulo:** revalida os próximos 7 dias (amanhã até hoje + 7). Cria páginas ausentes e corrige leituras diferentes da fonte, preservando a data de publicação, reflexões e notícias. Páginas sem mudanças não são regravadas.
- **A cada 30 dias, às 07h de São Paulo:** gera páginas ausentes para os próximos 90 dias, sem substituir páginas existentes. O calendário usa 27/10/2026 como referência; as próximas datas são 26/11/2026 e 26/12/2026. O workflow verifica diariamente se chegou a data, pois o cron não expressa intervalos contínuos de 30 dias entre meses.

Ambos podem ser executados manualmente pelo GitHub Actions e compartilham o mesmo grupo de concorrência para evitar gravações simultâneas. A execução manual de 90 dias não altera o calendário das execuções agendadas.

A fonte precisa disponibilizar o calendário e o artigo de cada data. Na geração de 90 dias, `--allow-unavailable` trata datas sem link em um calendário válido como pendências, com aviso no GitHub Actions, sem falhar a execução. Elas serão tentadas nas próximas gerações de 90 dias ou na rotina diária quando entrarem na janela de 7 dias. A geração pode, portanto, ficar parcial enquanto a fonte não publicar todo o período.

A rotina diária continua falhando se faltar qualquer um dos próximos 7 dias. Erros de conexão, calendário inválido, leituras incompletas e artigos de outra data causam falha em ambos os workflows. Páginas existentes são preservadas em caso de erro, e as demais datas continuam sendo processadas e salvas.

Os dois workflows geram `## Reflexão do Evangelho` a partir das leituras usando a OpenAI Responses API e o modelo `gpt-5.6-terra`. Antes da primeira execução, cadastre `OPENAI_API_KEY` nos Secrets do GitHub. O modelo pode ser alterado pela variável `OPENAI_REFLECTION_MODEL`. Cada reflexão tem de 2 a 3 parágrafos e entre 150 e 260 palavras, relacionando o Evangelho, as outras leituras e o contexto litúrgico. O workflow valida o formato e a extensão; isso não substitui revisão editorial e doutrinal.

Reflexões geradas recebem hashes das leituras e do texto nos metadados para evitar novas chamadas quando o conteúdo não muda. Reflexões editoriais existentes são preservadas; se as leituras mudarem, o workflow avisa que a revisão pode ser necessária. Páginas futuras já existentes sem reflexão são completadas nas janelas de 7 ou 90 dias.

Estimativa da OpenAI para `gpt-5.6-terra` (US$ 2 por milhão de tokens de entrada e US$ 12 por milhão de tokens de saída): aproximadamente **US$ 0,65–2,40 para 90 reflexões** ou **US$ 0,05–0,19 para 7**, assumindo 1.500–5.000 tokens de leitura/contexto e cerca de 350 tokens gerados por reflexão. O custo varia com o tamanho das leituras e só ocorre para reflexões novas ou regeneradas. Consulte os [preços oficiais do modelo](https://developers.openai.com/api/docs/models/gpt-5.6-terra).

Validação local: `node --test scripts/future-liturgy-format.test.mjs scripts/generate-future-liturgies.test.mjs`.
