# AGENTS.md — Guia para Agentes de IA (`liturgianews.site`)

Este documento define as diretrizes arquiteturais, editoriais e técnicas do repositório **LiturgiaNews** (`https://www.liturgianews.site`). Todo agente de IA que criar ou atualizar liturgias, reflexões, artigos do blog ou componentes do site deve seguir estas regras rigorosamente.

---

## 1. Visão Geral e Comandos do Projeto

- **Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS e MDX (`@next/mdx` com plugin customizado `lib/remark-liturgy.mjs`).
- **Diretórios de conteúdo:**
  - `liturgia-content/*.mdx`: Liturgias diárias indexadas pelo slug `<dd>-<mês>-<aaaa>.mdx` (ex.: `07-novembro-2026.mdx`).
  - `content/*.mdx`: Artigos originais de formação litúrgica e espiritualidade católica exibidos em `/blog`.
  - `news-content/*.mdx`: Digests diários de notícias católicas (acervo auxiliar).
- **Comandos obrigatórios de validação:**
  ```bash
  bun run test        # Executa testes unitários (lib/*.test.*) e de scripts (scripts/*.test.mjs)
  bun run typecheck   # Gera tipos de rotas do Next.js e valida TypeScript (tsc --noEmit)
  bun run lint        # Executa ESLint
  bun run build       # Compila e pré-renderiza todas as páginas estáticas (SSG)
  ```

---

## 2. Geração e Atualização de Liturgias Diárias (`liturgia-content/*.mdx`)

### 2.1. Estrutura Obrigatória do Arquivo MDX

Todo arquivo em `liturgia-content/<dd>-<mês>-<aaaa>.mdx` **deve** conter:

1. **Exportação de `metadata` na linha 1:**
   ```mdx
   export const metadata = {
     title: "31ª Semana do Tempo Comum | Sábado",
     date: "2026-11-07",
     publishedAt: "2026-10-26T14:51:51.616Z",
     updatedAt: "2026-10-26T15:14:31.650Z",
   };
   ```

   - `date` deve estar no formato ISO `YYYY-MM-DD`.
   - `publishedAt` e `updatedAt` nunca podem ser timestamps no futuro em relação ao momento do build.
2. **Cabeçalho e data por extenso:**

   ```mdx
   # 31ª Semana do Tempo Comum | Sábado

   sábado, 07 de novembro de 2026
   ```

3. **Seção `## Leituras do Dia`:**
   - Contendo a **Primeira Leitura**, o **Responsório / Salmo Responsorial**, a **Segunda Leitura** (em domingos e solenidades) e o **Evangelho**, com suas respectivas referências entre parênteses — ex.: `<strong>Primeira Leitura</strong> (Fl 4,10-19)` e `<strong>Evangelho</strong> (Lc 16,9-15)`.
4. **Seção `## Reflexão do Evangelho` (OBRIGATÓRIA):**
   - **Regra crítica (Conformidade AdSense & Qualidade Editorial):** **Nenhuma** página em `liturgia-content/*.mdx` pode existir sem a seção `## Reflexão do Evangelho`. Páginas contendo apenas o texto bíblico copiado sem reflexão autoral violam as diretrizes de _Conteúdo Replicado / Conteúdo de Baixo Valor_ do Google AdSense e quebram o teste automatizado em `lib/seo-and-routes.test.ts`.
5. **Seção `## Notícias do Vaticano` (Opcional):**
   - Quando presente, lista links oficiais do portal _Vatican News_ com a data abaixo de cada link.

### 2.2. Diretrizes para Escrever a `## Reflexão do Evangelho`

Ao gerar ou revisar a seção `## Reflexão do Evangelho` de qualquer dia:

- **Especificidade bíblica:** A reflexão nunca deve ser um texto genérico que serviria para qualquer dia. Ela deve citar e articular diretamente:
  1. A passagem e a mensagem central do **Evangelho do dia** (personagens, parábola, milagre ou discurso de Jesus).
  2. A conexão temática com a **Primeira Leitura** (ou Segunda Leitura, nos domingos/solenidades) e o **Salmo Responsorial**.
  3. O contexto do **Tempo Litúrgico** (Advento, Natal, Quaresma, Páscoa ou Tempo Comum) ou da **Memória/Festa/Solenidade do Santo** celebrado naquela data.
- **Extensão e formato:** Escreva **2 a 3 parágrafos bem desenvolvidos** (entre **150 e 260 palavras** no total), em prosa fluida e calorosa, sem listas de tópicos (pois o roteiro estruturado em tópicos de _Lectio Divina_ já é renderizado automaticamente pelo componente `LiturgyPage`).
- **Fidelidade doutrinal e tom pastoral:** Mantenha fidelidade ao Magistério da Igreja Católica, ao Catecismo da Igreja Católica (CIC) e à tradição patrística. Conclua o último parágrafo com uma aplicação prática de conversão, esperança, oração ou caridade fraterna para o cotidiano do leitor.

### 2.3. Codificação UTF-8 e Proibição de Entidades HTML

- **Proibido deixar entidades HTML no MDX:** Nunca salve arquivos `.mdx` contendo `&atilde;`, `&eacute;`, `&ccedil;`, `&oacute;`, `&acirc;`, `&mdash;`, `&nbsp;` ou similares. Todo texto deve estar em **UTF-8 puro** (`ã`, `é`, `ç`, `ó`, `â`, `—`).
- Caso importe textos de fontes externas via `scripts/generate-future-liturgies.mjs`, utilize sempre o conversor `htmlToMarkdown` de `scripts/future-liturgy-format.mjs` e certifique-se de adicionar a `## Reflexão do Evangelho` antes de commitar.

---

## 3. Geração de Artigos do Blog (`content/*.mdx`) e Guias

### 3.1. Estrutura do Frontmatter (`export const metadata`)

Todo artigo em `content/<slug>.mdx` deve exportar `metadata` no topo do arquivo:

```mdx
export const metadata = {
  title: "Título Claro e Descritivo com a Palavra-Chave Principal",
  description:
    "Resumo objetivo de 140 a 160 caracteres explicando o que o leitor aprenderá no artigo.",
  date: "YYYY-MM-DD",
  author: "Equipe Editorial LiturgiaNews",
  tags: ["Tag 1", "Tag 2", "Tag 3"],
};
```

### 3.2. Padrão de Qualidade Editorial (E-E-A-T e AdSense)

Para manter alto valor editorial no portal:

1. **Profundidade e Originalidade:** Artigos de blog devem ter entre **800 e 1.200 palavras**, texto 100% original, didático e teologicamente preciso.
2. **Estrutura Escaneável:**
   - Um único `# H1` no início (igual ou alinhado ao `title`).
   - Seções organizadas com `## H2` e `### H3`.
   - Passos práticos de aplicação espiritual para fiéis leigos, famílias e agentes de pastoral.
3. **Links Internos Contextuais:** Sempre inclua links naturais no corpo do texto para:
   - `[liturgia de hoje](/liturgia/hoje)`
   - `[calendário litúrgico](/liturgia)`
   - Guias permanentes: `[/acompanhar](/acompanhar)`, `[/lectio-divina](/lectio-divina)` ou `[/tempo-liturgico](/tempo-liturgico)`.
4. **Fontes e Referências Oficiais:** Encerre todo artigo formativo com uma linha de referências documentais da Igreja, por exemplo:
   - _Catecismo da Igreja Católica (CIC)_ (citando os parágrafos `nn. ...`).
   - _Instrução Geral do Missal Romano (IGMR)_.
   - _Constituição Conciliar Sacrosanctum Concilium_ ou _Dei Verbum_.
   - _Normas Universais sobre o Ano Litúrgico e o Calendário_.

---

## 4. Invariantes de SEO, AdSense e Testes Automatizados

Antes de finalizar qualquer tarefa, garanta que os seguintes invariantes permanecem intactos:

1. **Google AdSense e `ads.txt`:**
   - `app/layout.tsx` deve manter a meta tag `google-adsense-account` e o script `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=..." crossOrigin="anonymous" data-adsense-loader="true" />` no `<head>`.
   - A rota `/ads.txt` (`app/ads.txt/route.ts`) deve responder `200 OK` no padrão IAB.
   - Os blocos `<AdUnit />` permanecem restritos às páginas de leitura da liturgia (`after-reflection` e `after-reading`), nunca poluindo páginas de status, erro ou login/confirmação.
2. **Páginas Institucionais e Transparência:**
   - As páginas `/sobre`, `/privacidade`, `/termos`, `/contact` e `/donate` devem permanecer acessíveis no rodapé (`components/layout/footer.tsx`) e listadas em `app/sitemap.ts`.
3. **Fuso Horário e Datas:**
   - A data litúrgica corrente em `/liturgia/hoje`, na Home (`/`) e nos feeds RSS é sempre calculada no fuso `America/Sao_Paulo` (`getLiturgicalDate()` em `lib/liturgical-date.ts`).
   - O `sitemap.xml` nunca deve emitir `lastModified` no futuro, e o feed RSS (`/liturgia/feed.xml`) nunca deve listar liturgias futuras (`entry.date > todayIso`).
4. **Verificação Final:**
   - Execute `bun run test && bun run typecheck && bun run lint` após qualquer alteração em `liturgia-content/` ou `content/`
