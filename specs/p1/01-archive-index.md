# P1-01 — Arquivo de liturgias sem importar todos os MDX

## Fato

`getLiturgia()` em `app/liturgia/actions.tsx` faz `import()` de cada arquivo em `liturgia-content` a cada request. São 433 módulos. Em produção, `/liturgia` veio com `cache-control: private, no-store` e o download completo do HTML levou cerca de 1,2s, contra cerca de 0,1s nas páginas estáticas. O feed `/liturgia/feed.xml` usa a mesma função.

A rota é dinâmica, então o Next envia o `<head>` cedo (cerca de 2 KB) e só depois o resto. Em 28/09/2026, `<title>`, meta description, canonical e JSON-LD de `/liturgia` e de `/blog` estavam fora do `</head>`, dezenas de quilobytes depois. O Lighthouse marcou a description do arquivo como ausente. As páginas estáticas, inclusive `/liturgia/hoje`, colocam esses metadados dentro do `<head>`.

## Resultado

A listagem e o feed leem só o frontmatter (`title`, `date`, slug). O comportamento de página, busca por título e ordenação por data permanece.

## Fora de escopo

- Não paginar no banco. Não há banco.
- Não adicionar `gray-matter` se um parse das primeiras linhas resolver.
- Não transformar a rota em client-side rendering.

## Arquivos

- `app/liturgia/actions.tsx`
- `app/liturgia/feed.xml/route.ts` passa a herdar o ganho
- Se o blog repetir o mesmo padrão em `app/blog/actions.tsx`, aplicar o mesmo método lá. Há um único post; o ganho é de consistência.

## Implementação

- Ler o arquivo como texto e extrair `export const metadata = { ... }` do início. O formato atual é uma linha com `title` e `date`.
- Guardar o índice em memória no processo (variável de módulo). Invalidar não é necessário entre deploys: processo novo, índice novo.
- Continuar a filtrar por título, ordenar por `date` e fatiar pela página.
- Datas `YYYY-MM-DD` são datas civis. Não formatar com `toLocaleDateString` em UTC de um jeito que mostre o dia anterior no Brasil. Formatar a partir dos componentes da string.

## Aceite

- Abrir `/liturgia` não executa `import()` dinâmico dos 433 MDX.
- A primeira página ainda lista os dias mais recentes, 20 por página, com o mesmo título visível de antes.
- `/liturgia?page=2` continua linkando os dias seguintes da ordenação.
- O feed lista até 30 itens com o título do frontmatter.
- No HTML de `/liturgia` e de `/blog`, `<title>`, meta description e canonical aparecem antes de `</head>`. Se a busca com `?search=` precisar continuar dinâmica, pelo menos a listagem padrão (sem busca) precisa cumprir isso.

## Validação

Build. Comparar os títulos da primeira página com os de produção antes da mudança (os dias mais recentes do repositório). Medir o tempo de resposta local de `/liturgia` com `next start`; o objetivo é sair da casa de 1s causada pelos imports.
