# Specs de evolução do LiturgiaNews

Estas specs implementam o backlog da auditoria em [docs/growth-seo-performance-audit.md](../docs/growth-seo-performance-audit.md). Elas não autorizam redesenhar o produto.

## Antes de escrever código

1. Leia [00-context.md](00-context.md).
2. Escolha **uma** spec. Não misture o escopo de outra.
3. O objetivo do site continua sendo: mais gente lê a liturgia do dia e assina a newsletter gratuita.
4. Se a spec depender de um dado que não está no MDX, omita esse dado. Não invente cor litúrgica, citação, autor ou token.
5. Não altere `robots.txt` para GPTBot, OAI-SearchBot, Google-Extended ou bots parecidos. A política de rastreamento para busca e para treino fica como está até uma decisão humana.
6. Não crie `llms.txt`.
7. Não adicione dependência nova se a spec não pedir.

## Definição de pronto

- Os critérios de aceite da spec passam.
- A validação descrita na spec foi executada e o resultado está no relato final.
- Nenhuma página, schema, artigo ou integração fora da spec foi criada.

## Ordem sugerida

P0, na ordem dos arquivos `01` a `06`. Depois P1. P2 e P3 só com pedido explícito.

## Não fazer

- Portal de notícias, blog em massa ou páginas geradas só para variações de palavra-chave.
- Keyword stuffing em title, description ou texto visível.
- Schema.org que não corresponda ao que a página mostra.
- Comprar backlink, spam em paróquia, Reddit, TabNews ou grupos.
- Modal que cubra a leitura para pedir e-mail.
- Redirect de `/liturgia/hoje` para a URL datada.
- Publicar `news-content/` como seção do site.
