import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import JsonLd from "@/components/jsonld/JsonLd";
import { NewsletterPanel } from "@/components/newsletter-panel";
import { buildPageMetadata, DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";

const title = "Como acompanhar a liturgia diária";
const description = "Um caminho simples para ler as leituras do dia com atenção, oração e constância.";
const path = "/acompanhar";

export const metadata: Metadata = buildPageMetadata({ title, description, path, type: "article" });

export default function Page() {
  return (
    <div className="reading-container space-y-8">
      <Breadcrumbs items={[{ label: title, href: path }]} className="mb-4" />
      <article className="editorial-prose">
        <h1>{title}</h1>
        <p>
          A liturgia diária aproxima a vida comum das leituras celebradas pela Igreja em todo o mundo. Não é preciso transformar esse encontro em uma tarefa longa ou acadêmica: constância, silêncio interior e atenção costumam ser muito mais fecundos do que a pressa para terminar. Quando abrimos a Palavra de Deus a cada manhã, permitimos que o próprio Cristo ilumine nossas decisões, nossos relacionamentos e o modo como enfrentamos os desafios cotidianos.
        </p>

        <h2>Por que ler a liturgia todos os dias?</h2>
        <p>
          Na tradição católica, a Sagrada Escritura não é um livro do passado, mas uma palavra viva através da qual o Pai conversa com os seus filhos (cf. <em>Dei Verbum</em>, n. 21). Ao seguir a seleção diária proposta pelo Lecionário da Igreja, você não lê trechos isolados ao acaso: caminha em comunhão com milhões de fiéis, percorrendo de modo orgânico a Lei, os Profetas, os Salmos, as Cartas Apostólicas e os quatro Evangelhos ao longo do{" "}
          <Link href="/tempo-liturgico">ano litúrgico</Link>.
        </p>

        <h2>1. Prepare um momento possível na sua rotina</h2>
        <p>
          O primeiro segredo da perseverança espiritual é o realismo. Escolha um horário fixo que caiba de verdade na sua rotina — como os primeiros dez ou quinze minutos da manhã antes de checar mensagens, o trajeto para o trabalho ou o recolhimento da noite — e reduza as distrações por alguns instantes.
        </p>
        <p>
          Comece fazendo o Sinal da Cruz e pedindo a luz do Espírito Santo para compreender e acolher o que vai ler. Em seguida, observe a data, a celebração do dia e o tempo litúrgico, depois leia os textos na ordem em que aparecem. Você pode abrir agora a{" "}
          <Link href="/liturgia/hoje">liturgia de hoje</Link>.
        </p>

        <h2>2. Compreenda a ordem das leituras</h2>
        <p>
          Cada elemento da Liturgia da Palavra possui um papel próprio na formação do coração cristão:
        </p>
        <ul>
          <li>
            <strong>Primeira Leitura:</strong> Apresenta a história da salvação no Antigo Testamento, nos Atos dos Apóstolos (durante o Tempo Pascal) ou nas Epístolas, preparando o horizonte espiritual do Evangelho.
          </li>
          <li>
            <strong>Salmo Responsorial:</strong> É a resposta poética e orante da assembleia à Palavra ouvida. Reze pausadamente o refrão do salmo, transformando-o em prece pessoal.
          </li>
          <li>
            <strong>Segunda Leitura (domingos e solenidades):</strong> Traz a exortação pastoral dos Apóstolos às primeiras comunidades cristãs.
          </li>
          <li>
            <strong>Evangelho do Dia:</strong> É o ápice da leitura diária, onde escutamos diretamente os passos, parábolas, gestos e ensinamentos de Jesus Cristo.
          </li>
        </ul>

        <h2>3. Leia, escute e guarde uma frase para o dia</h2>
        <p>
          Inspirando-se no método tradicional da <Link href="/lectio-divina">Lectio divina</Link>, faça uma primeira leitura tranquila para compreender o sentido geral do texto. Na segunda leitura, perceba uma palavra, uma atitude de Jesus ou um convite que toca mais de perto a situação que você está vivendo hoje.
        </p>
        <p>
          Guardar uma única frase ou o refrão do salmo na memória ao longo do dia — recordando-a antes de uma reunião importante, no cuidado com a família ou diante de uma dificuldade — ajuda a Palavra de Deus a descer da mente para o coração e chegar às decisões concretas.
        </p>

        <h2>4. Crie continuidade e caminhe com a Igreja</h2>
        <p>
          Nos dias de semana, o Lecionário segue uma leitura semicontínua: um mesmo livro bíblico é lido em sequência dia após dia. Por isso, retomar as leituras todos os dias permite reconhecer temas, promessas e movimentos espirituais que uma leitura isolada não mostra. Caso perca um dia, você sempre pode consultar o{" "}
          <Link href="/liturgia">calendário litúrgico</Link> para retomar o fio da meditação.
        </p>

        <h2>5. Como unir a leitura pessoal à celebração da Santa Missa</h2>
        <p>
          A leitura individual ou familiar da liturgia diária não substitui a participação sacramental na Eucaristia, mas prepara o coração de maneira extraordinária para vivê-la com mais fruto. A <em>Instrução Geral do Missal Romano</em> (n. 55) recorda que, na Liturgia da Palavra, o próprio Cristo está presente e fala ao seu povo, e o Espírito Santo torna eficaz a palavra proclamada no coração dos ouvintes.
        </p>
        <p>
          Quando você lê com antecedência as leituras do domingo ou da Missa ferial, a escuta na assembleia litúrgica deixa de ser passiva: você reconhece as conexões entre o Antigo Testamento e o Evangelho, acompanha melhor a homilia do sacerdote e responde ao Salmo Responsorial com verdadeira sintonia interior. E nos dias em que as obrigações de trabalho, estudo ou saúde impedem sua presença física na igreja, rezar com a liturgia diária mantém você espiritualmente unido à mesa da Palavra celebrada em todo o mundo católico.
        </p>

        <h2>6. Superando as dificuldades mais comuns na oração diária</h2>
        <ul>
          <li>
            <strong>Falta de tempo pela manhã:</strong> Não espere ter meia hora livre para abrir as leituras. Dez minutos bem aproveitados antes de iniciar o expediente, ou mesmo durante o deslocamento diário, são suficientes para ler com recolhimento e rezar o Evangelho.
          </li>
          <li>
            <strong>Textos bíblicos mais difíceis do Antigo Testamento:</strong> É natural encontrar passagens históricas ou proféticas menos familiares na Primeira Leitura. Nesses dias, apoie-se na luz do Evangelho e na reflexão pastoral da página, lembrando que toda a Escritura converge para Jesus Cristo (cf. Lc 24,27).
          </li>
          <li>
            <strong>Aridez espiritual ou distração:</strong> Quando a mente parecer dispersa, volte suavemente ao texto lendo em voz baixa ou sussurrada, repita o versículo do Salmo como uma jaculatória e confie que a fidelidade perseverante agrada profundamente a Deus.
          </li>
        </ul>

        <p>
          Para aprofundar sua formação, consulte também nossos artigos no{" "}
          <Link href="/blog">blog de espiritualidade e liturgia</Link> ou{" "}
          <Link href="#newsletter">assine gratuitamente a newsletter</Link> para receber esse lembrete todas as manhãs em seu e-mail.
        </p>
        <hr />
        <p className="text-xs text-slate-600">
          <em>Referências documentais: Constituição Dogmática Dei Verbum (nn. 21-25), Instrução Geral do Missal Romano (IGMR, nn. 55-67), Catecismo da Igreja Católica (nn. 101-108, 1177).</em>
        </p>
      </article>
      <NewsletterPanel source="acompanhar" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description,
          image: [DEFAULT_OG_IMAGE.url],
          author: { "@type": "Organization", name: "LiturgiaNews", url: SITE_URL },
          publisher: {
            "@type": "Organization",
            name: "LiturgiaNews",
            url: SITE_URL,
            logo: { "@type": "ImageObject", url: `${SITE_URL}/images/android-chrome-192x192.png`, width: 192, height: 192 },
          },
          mainEntityOfPage: `${SITE_URL}${path}`,
          inLanguage: "pt-BR",
        }}
      />
    </div>
  );
}
