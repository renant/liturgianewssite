export type LiturgicalSeasonInfo = {
  season: string;
  color: string;
  colorBadgeClass: string;
  rank: string;
  sundayCycle: "Ano A" | "Ano B" | "Ano C";
  weekdayCycle: "Ano Par (II)" | "Ano Ímpar (I)";
  summary: string;
  prayerFocus: string;
};

function getFirstAdventSundayUtc(year: number): Date {
  const nov27 = new Date(Date.UTC(year, 10, 27));
  const dayOfWeek = nov27.getUTCDay();
  const offset = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  return new Date(Date.UTC(year, 10, 27 + offset));
}

export function getLiturgicalCycles(isoDate: string): {
  sundayCycle: "Ano A" | "Ano B" | "Ano C";
  weekdayCycle: "Ano Par (II)" | "Ano Ímpar (I)";
} {
  const [y, m, d] = isoDate.split("-").map(Number);
  const current = new Date(Date.UTC(y, m - 1, d));
  const adventStart = getFirstAdventSundayUtc(y);
  const liturgicalYear = current >= adventStart ? y + 1 : y;
  const mod = liturgicalYear % 3;
  const sundayCycle = mod === 1 ? "Ano A" : mod === 2 ? "Ano B" : "Ano C";
  const weekdayCycle = y % 2 === 0 ? "Ano Par (II)" : "Ano Ímpar (I)";
  return { sundayCycle, weekdayCycle };
}

export function describeLiturgicalCelebration(
  title: string,
  isoDate: string,
): LiturgicalSeasonInfo {
  const lower = title.toLocaleLowerCase("pt-BR");
  const { sundayCycle, weekdayCycle } = getLiturgicalCycles(isoDate);

  let rank = "Féria";
  if (lower.includes("solenidade") || lower.includes("domingo de ramos") || lower.includes("páscoa")) {
    rank = "Solenidade";
  } else if (lower.includes("festa") || lower.includes("oitava de natal")) {
    rank = "Festa";
  } else if (lower.includes("memória")) {
    rank = "Memória";
  } else if (lower.includes("domingo")) {
    rank = "Domingo";
  } else if (lower.includes("comemoração")) {
    rank = "Comemoração";
  }

  const isMartyr =
    lower.includes("mártir") ||
    lower.includes("martir") ||
    lower.includes("estêvão") ||
    lower.includes("inocentes") ||
    lower.includes("simão e judas") ||
    lower.includes("andré, apóstolo");

  if (lower.includes("advento")) {
    const isGaudete = lower.includes("3º domingo do advento");
    return {
      season: "Tempo do Advento",
      color: isGaudete ? "Rosa ou Roxo" : rank === "Solenidade" || rank === "Festa" ? "Branco" : isMartyr ? "Vermelho" : "Roxo",
      colorBadgeClass: isGaudete
        ? "bg-pink-100 text-pink-900 border-pink-300"
        : "bg-purple-100 text-purple-900 border-purple-300",
      rank,
      sundayCycle,
      weekdayCycle,
      summary:
        "O Tempo do Advento possui dupla característica: é tempo de preparação para as solenidades do Natal, em que recordamos a primeira vinda do Filho de Deus entre os homens, e simultaneamente tempo em que os corações se voltam para a expectativa da segunda vinda de Cristo no fim dos tempos (Normas Universais sobre o Ano Litúrgico, n. 39).",
      prayerFocus:
        "Cultive a vigilância interior, a sobriedade alegre e a escuta das profecias messiânicas de Isaías, preparando na família e na consciência uma morada reconciliada para o Senhor que vem.",
    };
  }

  if (
    lower.includes("natal") ||
    lower.includes("sagrada família") ||
    lower.includes("santa maria, mãe de deus") ||
    lower.includes("epifania") ||
    lower.includes("batismo do senhor") ||
    isoDate.slice(5) >= "12-25" ||
    isoDate.slice(5) <= "01-11"
  ) {
    return {
      season: "Tempo do Natal",
      color: isMartyr ? "Vermelho" : "Branco",
      colorBadgeClass: isMartyr
        ? "bg-red-100 text-red-900 border-red-300"
        : "bg-amber-50 text-amber-950 border-amber-300",
      rank,
      sundayCycle,
      weekdayCycle,
      summary:
        "No Tempo do Natal, a Igreja celebra o mistério da Encarnação do Verbo — Deus que assume a nossa humanidade em Belém para nos comunicar a filiação divina — e as primeiras manifestações (Epifania e Batismo) de Cristo como Luz para todas as nações.",
      prayerFocus:
        "Contemple em silêncio a humildade da manjedoura, agradecendo a proximidade de Deus conosco (Emanuel) e traduzindo a alegria natalina em acolhida fraterna, paz doméstica e caridade com os pequenos.",
    };
  }

  if (lower.includes("quaresma") || lower.includes("cinzas") || lower.includes("semana santa")) {
    return {
      season: "Tempo da Quaresma",
      color: isMartyr ? "Vermelho" : "Roxo",
      colorBadgeClass: "bg-purple-100 text-purple-900 border-purple-300",
      rank,
      sundayCycle,
      weekdayCycle,
      summary:
        "A Quaresma é o retiro espiritual de quarenta dias em que toda a Igreja se prepara para a celebração da Páscoa por meio da escuta mais assídua da Palavra de Deus, da conversão do coração e da prática da oração, do jejum e da esmola.",
      prayerFocus:
        "Deixe que o Evangelho examine suas escolhas profundas, busque a reconciliação sacramental e una seus pequenos sacrifícios diários à entrega redentora de Cristo.",
    };
  }

  if (lower.includes("páscoa") || lower.includes("pascal") || lower.includes("ascensão") || lower.includes("pentecostes")) {
    const isPentecost = lower.includes("pentecostes");
    return {
      season: "Tempo Pascal",
      color: isPentecost || isMartyr ? "Vermelho" : "Branco",
      colorBadgeClass: isPentecost || isMartyr
        ? "bg-red-100 text-red-900 border-red-300"
        : "bg-amber-50 text-amber-950 border-amber-300",
      rank,
      sundayCycle,
      weekdayCycle,
      summary:
        "Os cinquenta dias do Tempo Pascal, do Domingo da Ressurreição até Pentecostes, são celebrados com júbilo como um único grande dia de festa, contemplando o Cristo Ressuscitado e o crescimento da Igreja nascente nos Atos dos Apóstolos.",
      prayerFocus:
        "Renove a alegria batismal, peça a efusão do Espírito Santo e testemunhe no cotidiano a esperança da vida nova que venceu o pecado e a morte.",
    };
  }

  const isWhiteCelebration =
    rank === "Solenidade" ||
    rank === "Festa" ||
    (rank === "Memória" && !isMartyr && !lower.includes("defuntos"));
  const isAllSouls = lower.includes("defuntos");

  return {
    season: "Tempo Comum",
    color: isAllSouls
      ? "Roxo"
      : isMartyr
        ? "Vermelho"
        : isWhiteCelebration
          ? "Branco"
          : "Verde",
    colorBadgeClass: isAllSouls
      ? "bg-purple-100 text-purple-900 border-purple-300"
      : isMartyr
        ? "bg-red-100 text-red-900 border-red-300"
        : isWhiteCelebration
          ? "bg-amber-50 text-amber-950 border-amber-300"
          : "bg-emerald-100 text-emerald-900 border-emerald-300",
    rank,
    sundayCycle,
    weekdayCycle,
    summary:
      "No Tempo Comum, a Igreja acompanha de modo contínuo a vida pública, as parábolas, os milagres e o ensinamento de Jesus Cristo. A cor verde simboliza a esperança viva da fé que amadurece na perseverança cotidiana dos discípulos.",
    prayerFocus:
      "Escute o Evangelho como um diálogo pessoal com o Mestre no meio das tarefas diárias, deixando que sua sabedoria molde o trabalho, a família e o serviço ao próximo.",
  };
}

export function describeCalendarMonth(year: number, month: number): {
  heading: string;
  overview: string;
  liturgicalHighlights: string;
} {
  const { sundayCycle, weekdayCycle } = getLiturgicalCycles(
    `${year}-${String(month).padStart(2, "0")}-15`,
  );

  const notesByMonth: Record<number, { overview: string; highlights: string }> = {
    1: {
      overview:
        "Janeiro abre o ano civil ainda iluminado pela Oitava do Natal, celebrando a Solenidade de Santa Maria, Mãe de Deus, a Epifania do Senhor e a Festa do Batismo de Jesus, que inaugura a primeira etapa do Tempo Comum.",
      highlights:
        "Destaques do mês: Santa Maria Mãe de Deus (1º/01), Epifania do Senhor, Batismo do Senhor, Santo Antão, São Sebastião, Conversão de São Paulo (25/01), São Tomás de Aquino e São João Bosco.",
    },
    2: {
      overview:
        "Em fevereiro, a liturgia percorre as primeiras semanas do Tempo Comum — com a Festa da Apresentação do Senhor (Candelária) — e frequentemente inicia o caminho penitencial da Quaresma na Quarta-Feira de Cinzas.",
      highlights:
        "Destaques do mês: Apresentação do Senhor (02/02), São Brás, Santa Águeda, Nossa Senhora de Lourdes (11/02) e Cátedra de São Pedro (22/02).",
    },
    3: {
      overview:
        "Março é marcado pelo aprofundamento espiritual da Quaresma — oração, jejum e caridade fraterna — rumo à Páscoa, iluminado pelas grandes solenidades de São José e da Anunciação do Senhor.",
      highlights:
        "Destaques do mês: Solenidade de São José, Esposo da Virgem Maria (19/03), Solenidade da Anunciação do Senhor (25/03) e os escrutínios batismais dos domingos quaresmais.",
    },
    4: {
      overview:
        "Abril concentra o coração do Ano Litúrgico com a celebração da Semana Santa, do Sagrado Tríduo Pascal e da Oitava da Páscoa, abrindo os cinquenta dias de alegria do Tempo Pascal.",
      highlights:
        "Destaques do mês: Tríduo Pascal e Domingo da Ressurreição, Domingo da Divina Misericórdia, São Marcos Evangelista (25/04) e Santa Catarina de Sena (29/04).",
    },
    5: {
      overview:
        "Maio une o júbilo do Tempo Pascal — culminando na Ascensão do Senhor e na Solenidade de Pentecostes — à tradicional devoção mariana das comunidades e famílias católicas.",
      highlights:
        "Destaques do mês: São José Operário (1º/05), Santos Filipe e Tiago, Nossa Senhora de Fátima (13/05), São Matias, Ascensão do Senhor, Pentecostes e Visitação de Nossa Senhora (31/05).",
    },
    6: {
      overview:
        "Junho celebra grandes solenidades dogmáticas e devocionais do calendário católico logo após o ciclo pascal, além dos santos populares muito queridos pelas paróquias brasileiras.",
      highlights:
        "Destaques do mês: Santíssima Trindade, Santíssimo Corpo e Sangue de Cristo (Corpus Christi), Sagrado Coração de Jesus, Santo Antônio (13/06), Natividade de São João Batista (24/06) e Santos Pedro e Paulo (29/06).",
    },
    7: {
      overview:
        "Em julho, a leitura semicontínua do Tempo Comum convida à escuta perseverante dos profetas do Antigo Testamento e das parábolas do Reino, acompanhada pelo testemunho dos apóstolos e santos.",
      highlights:
        "Destaques do mês: São Tomé Apóstolo (03/07), São Bento Abade (11/07), Nossa Senhora do Carmo (16/07), Santa Maria Madalena (22/07), São Tiago Maior (25/07), Santos Joaquim e Ana (26/07) e Santo Inácio de Loyola (31/07).",
    },
    8: {
      overview:
        "Agosto é tradicionalmente celebrado pela Igreja no Brasil como o Mês Vocacional, iluminado pela Festa da Transfiguração do Senhor e pela Solenidade da Assunção da Bem-aventurada Virgem Maria.",
      highlights:
        "Destaques do mês: São João Maria Vianney (04/08), Transfiguração do Senhor (06/08), São Lourenço (10/08), Santa Clara (11/08), Assunção de Nossa Senhora (15/08), São Bartolomeu (24/08) e Santo Agostinho (28/08).",
    },
    9: {
      overview:
        "Setembro é celebrado no Brasil como o Mês da Bíblia (em razão da memória de São Jerônimo, tradutor das Escrituras), convidando fiéis e famílias a intensificarem a prática diária da Lectio Divina.",
      highlights:
        "Destaques do mês: Natividade de Nossa Senhora (08/09), Exaltação da Santa Cruz (14/09), Nossa Senhora das Dores (15/09), São Mateus Apóstolo e Evangelista (21/09), Santos Arcanjos Miguel, Gabriel e Rafael (29/09) e São Jerônimo (30/09).",
    },
    10: {
      overview:
        "Outubro é o Mês Missionário e do Santo Rosário. No Brasil, ganha relevo especial com a Solenidade de Nossa Senhora da Conceição Aparecida, Padroeira do Brasil, em 12 de outubro.",
      highlights:
        "Destaques do mês: Santa Teresinha do Menino Jesus (1º/10), Santos Anjos da Guarda (02/10), São Francisco de Assis (04/10), Nossa Senhora do Rosário (07/10), Nossa Senhora Aparecida (12/10), Santa Teresa de Jesus (15/10), São Lucas Evangelista (18/10) e Santos Simão e Judas (28/10).",
    },
    11: {
      overview:
        "Novembro conduz a Igreja à meditação sobre a comunhão dos santos, a esperança da vida eterna e a vigilância escatológica, encerrando o Ano Litúrgico com a Solenidade de Cristo Rei e iniciando o novo ciclo no 1º Domingo do Advento.",
      highlights:
        "Destaques do mês: Solenidade de Todos os Santos, Comemoração de Todos os Fiéis Defuntos (02/11), Dedicação da Basílica do Latrão (09/11), São Martinho de Tours (11/11), Santa Isabel da Hungria (17/11), Cristo Rei do Universo e 1º Domingo do Advento.",
    },
    12: {
      overview:
        "Dezembro vive a preparação espiritual do Tempo do Advento — dividido entre a esperança na vinda gloriosa do Senhor e as Férias Maiores de 17 a 24 de dezembro — até explodir de alegria na Solenidade do Natal de Nosso Senhor Jesus Cristo.",
      highlights:
        "Destaques do mês: São Francisco Xavier (03/12), Santo Ambrósio (07/12), Solenidade da Imaculada Conceição (08/12), Nossa Senhora de Guadalupe (12/12), São João da Cruz (14/12), Solenidade do Natal do Senhor (25/12) e Festa da Sagrada Família.",
    },
  };

  const monthData = notesByMonth[month] ?? notesByMonth[1];
  return {
    heading: `Guia Litúrgico do Mês (${sundayCycle} · ${weekdayCycle})`,
    overview: monthData.overview,
    liturgicalHighlights: monthData.highlights,
  };
}
