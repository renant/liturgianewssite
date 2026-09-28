# P0-02 — Title e description das páginas datadas

## Fato

`/liturgia/28-setembro-2026` publica o title `26ª Semana do Tempo Comum | Segunda-feira`. A busca “liturgia 28 de setembro de 2026” ou “evangelho de hoje” não encontra essa frase. Os concorrentes que aparecem colocam a data e a citação do Evangelho no title. Nenhum MDX tem `description` no frontmatter; a meta description cai no título litúrgico.

## Resultado

O `<title>` e a meta description da URL datada dizem a data por extenso e, quando der para ler no arquivo, a citação do Evangelho. O canonical continua a própria URL datada.

## Fora de escopo

- Não alterar o H1 nesta spec (P1-02).
- Não criar lista longa de keywords.
- Não mudar `/liturgia/hoje`, que já tem data no title.
- Não inventar citação se o parse falhar.

## Arquivos

- `app/liturgia/[slug]/page.tsx`
- Leitura do arquivo em `liturgia-content/{slug}.mdx`
- Pode reutilizar um parser pequeno em `lib/liturgy-facts.ts`

## Implementação

Ler o texto do MDX. Extrair:

- Data de `metadata.date` (`YYYY-MM-DD`), formatada em português com mês por extenso, sem depender do fuso. `2026-09-28` é sempre “28 de setembro de 2026”.
- Citação do Evangelho pela primeira ocorrência de `Evangelho` seguida de uma referência bíblica entre parênteses, por exemplo `Lc 9,46-50`.
- Referência da primeira leitura, se existir, só para a description.

Title:

`Liturgia de 28 de setembro de 2026: Evangelho Lc 9,46-50`

Se não houver citação:

`Liturgia de 28 de setembro de 2026 | 26ª Semana do Tempo Comum`

Description, uma frase, com o título litúrgico do frontmatter e as referências encontradas. Exemplo:

`Liturgia diária de 28 de setembro de 2026, 26ª Semana do Tempo Comum. Evangelho Lc 9,46-50. Primeira leitura: Jó 1,6-22.`

Aplicar o mesmo texto no Open Graph e no Twitter. Não repetir “liturgia diária” em sequência de sinônimos.

## Aceite

- A página `28-setembro-2026` tem title com “28 de setembro de 2026” e “Lc 9,46-50”.
- O title não é só o nome da semana.
- Canonical inalterado.
- Um arquivo sem padrão reconhecível não ganha citação inventada.

## Validação

`bun run build` e inspeção do HTML de `/liturgia/28-setembro-2026` e de um dia cujo corpo não case o regex, se existir. Conferir que o title tem menos de 70 caracteres quando a citação for curta; se passar, encurtar a citação, não o ano.
