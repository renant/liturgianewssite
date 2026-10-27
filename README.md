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

A fonte precisa disponibilizar o calendário e o artigo de cada data. Quando uma data não estiver disponível ou não corresponder ao artigo, a página existente é preservada, as demais datas continuam e o workflow sinaliza a pendência após salvar as páginas geradas com sucesso.

Validação local: `node --test scripts/future-liturgy-format.test.mjs scripts/generate-future-liturgies.test.mjs`.
