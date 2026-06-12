// Estrutura acadêmica oficial: Disciplina → Módulo → Tema → Microtema
// Base inicial. Preparada para crescer para centenas de disciplinas.
import { SEMESTRE_4 } from "./curriculum/semestre4";

export interface Microtheme {
  id: string;
  nome: string;
}

export interface Theme {
  id: string;
  nome: string;
  microthemes: Microtheme[];
}

export interface CurriculumModule {
  id: string;
  nome: string;
  themes: Theme[];
}

export interface DisciplineCurriculum {
  catalogId: string; // referencia SUBJECT_CATALOG.id
  modules: CurriculumModule[];
}

// helper para gerar ids estáveis curtos
const k = (prefix: string, ...parts: string[]) =>
  [prefix, ...parts].join(".").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9.\-]/g, "");

// ============================================================
// DIREITO CONSTITUCIONAL
// ============================================================
const constitucional: DisciplineCurriculum = {
  catalogId: "constitucional",
  modules: [
    {
      id: k("const", "teoria"),
      nome: "Teoria da Constituição",
      themes: [
        {
          id: k("const", "teoria", "conceito"),
          nome: "Conceito e classificação das constituições",
          microthemes: [
            { id: k("const", "teoria", "conceito", "1"), nome: "Conceito de Constituição" },
            { id: k("const", "teoria", "conceito", "2"), nome: "Classificações (rígida, flexível, semirrígida)" },
            { id: k("const", "teoria", "conceito", "3"), nome: "Quanto à forma, origem e extensão" },
            { id: k("const", "teoria", "conceito", "4"), nome: "Constituição material e formal" },
          ],
        },
        {
          id: k("const", "teoria", "poder"),
          nome: "Poder Constituinte",
          microthemes: [
            { id: k("const", "teoria", "poder", "1"), nome: "Poder Constituinte Originário" },
            { id: k("const", "teoria", "poder", "2"), nome: "Poder Constituinte Derivado Reformador" },
            { id: k("const", "teoria", "poder", "3"), nome: "Poder Constituinte Derivado Decorrente" },
            { id: k("const", "teoria", "poder", "4"), nome: "Limites materiais e formais" },
          ],
        },
        {
          id: k("const", "teoria", "interp"),
          nome: "Hermenêutica constitucional",
          microthemes: [
            { id: k("const", "teoria", "interp", "1"), nome: "Métodos de interpretação" },
            { id: k("const", "teoria", "interp", "2"), nome: "Princípios de interpretação constitucional" },
            { id: k("const", "teoria", "interp", "3"), nome: "Eficácia das normas constitucionais" },
          ],
        },
      ],
    },
    {
      id: k("const", "fund"),
      nome: "Princípios Fundamentais",
      themes: [
        {
          id: k("const", "fund", "republica"),
          nome: "Fundamentos da República",
          microthemes: [
            { id: k("const", "fund", "republica", "1"), nome: "Soberania" },
            { id: k("const", "fund", "republica", "2"), nome: "Cidadania" },
            { id: k("const", "fund", "republica", "3"), nome: "Dignidade da pessoa humana" },
            { id: k("const", "fund", "republica", "4"), nome: "Valores sociais do trabalho e da livre iniciativa" },
            { id: k("const", "fund", "republica", "5"), nome: "Pluralismo político" },
          ],
        },
        {
          id: k("const", "fund", "objetivos"),
          nome: "Objetivos fundamentais e princípios das relações internacionais",
          microthemes: [
            { id: k("const", "fund", "objetivos", "1"), nome: "Objetivos fundamentais (art. 3º)" },
            { id: k("const", "fund", "objetivos", "2"), nome: "Princípios nas relações internacionais (art. 4º)" },
            { id: k("const", "fund", "objetivos", "3"), nome: "Integração latino-americana" },
          ],
        },
      ],
    },
    {
      id: k("const", "direitos"),
      nome: "Direitos e Garantias Fundamentais",
      themes: [
        {
          id: k("const", "direitos", "individuais"),
          nome: "Direitos e deveres individuais e coletivos",
          microthemes: [
            { id: k("const", "direitos", "individuais", "1"), nome: "Igualdade (art. 5º, caput e I)" },
            { id: k("const", "direitos", "individuais", "2"), nome: "Legalidade e devido processo legal" },
            { id: k("const", "direitos", "individuais", "3"), nome: "Liberdade de expressão, reunião e associação" },
            { id: k("const", "direitos", "individuais", "4"), nome: "Direito à vida, intimidade e privacidade" },
            { id: k("const", "direitos", "individuais", "5"), nome: "Habeas Corpus" },
            { id: k("const", "direitos", "individuais", "6"), nome: "Habeas Data" },
            { id: k("const", "direitos", "individuais", "7"), nome: "Mandado de Segurança (individual e coletivo)" },
            { id: k("const", "direitos", "individuais", "8"), nome: "Mandado de Injunção" },
            { id: k("const", "direitos", "individuais", "9"), nome: "Ação Popular e Ação Civil Pública" },
          ],
        },
        {
          id: k("const", "direitos", "sociais"),
          nome: "Direitos sociais",
          microthemes: [
            { id: k("const", "direitos", "sociais", "1"), nome: "Rol dos direitos sociais (art. 6º)" },
            { id: k("const", "direitos", "sociais", "2"), nome: "Direitos dos trabalhadores (art. 7º)" },
            { id: k("const", "direitos", "sociais", "3"), nome: "Liberdade sindical e direito de greve" },
          ],
        },
        {
          id: k("const", "direitos", "nacionalidade"),
          nome: "Nacionalidade e direitos políticos",
          microthemes: [
            { id: k("const", "direitos", "nacionalidade", "1"), nome: "Brasileiros natos e naturalizados" },
            { id: k("const", "direitos", "nacionalidade", "2"), nome: "Perda da nacionalidade" },
            { id: k("const", "direitos", "nacionalidade", "3"), nome: "Direitos políticos positivos e negativos" },
            { id: k("const", "direitos", "nacionalidade", "4"), nome: "Inelegibilidades" },
            { id: k("const", "direitos", "nacionalidade", "5"), nome: "Partidos políticos" },
          ],
        },
      ],
    },
    {
      id: k("const", "org"),
      nome: "Organização do Estado",
      themes: [
        {
          id: k("const", "org", "federacao"),
          nome: "Federação brasileira",
          microthemes: [
            { id: k("const", "org", "federacao", "1"), nome: "União, Estados, DF e Municípios" },
            { id: k("const", "org", "federacao", "2"), nome: "Repartição de competências" },
            { id: k("const", "org", "federacao", "3"), nome: "Intervenção federal e estadual" },
          ],
        },
        {
          id: k("const", "org", "admin"),
          nome: "Administração Pública na CF",
          microthemes: [
            { id: k("const", "org", "admin", "1"), nome: "Princípios constitucionais (LIMPE)" },
            { id: k("const", "org", "admin", "2"), nome: "Servidores públicos" },
            { id: k("const", "org", "admin", "3"), nome: "Regime jurídico e estabilidade" },
          ],
        },
      ],
    },
    {
      id: k("const", "poderes"),
      nome: "Organização dos Poderes",
      themes: [
        {
          id: k("const", "poderes", "leg"),
          nome: "Poder Legislativo",
          microthemes: [
            { id: k("const", "poderes", "leg", "1"), nome: "Congresso Nacional e suas Casas" },
            { id: k("const", "poderes", "leg", "2"), nome: "Processo legislativo" },
            { id: k("const", "poderes", "leg", "3"), nome: "Espécies normativas" },
            { id: k("const", "poderes", "leg", "4"), nome: "CPI" },
          ],
        },
        {
          id: k("const", "poderes", "exec"),
          nome: "Poder Executivo",
          microthemes: [
            { id: k("const", "poderes", "exec", "1"), nome: "Atribuições do Presidente" },
            { id: k("const", "poderes", "exec", "2"), nome: "Responsabilização (crime comum e de responsabilidade)" },
            { id: k("const", "poderes", "exec", "3"), nome: "Medidas Provisórias" },
          ],
        },
        {
          id: k("const", "poderes", "jud"),
          nome: "Poder Judiciário",
          microthemes: [
            { id: k("const", "poderes", "jud", "1"), nome: "Estrutura do Judiciário" },
            { id: k("const", "poderes", "jud", "2"), nome: "Garantias e vedações" },
            { id: k("const", "poderes", "jud", "3"), nome: "STF e STJ — competências" },
            { id: k("const", "poderes", "jud", "4"), nome: "CNJ" },
          ],
        },
      ],
    },
    {
      id: k("const", "controle"),
      nome: "Controle de Constitucionalidade",
      themes: [
        {
          id: k("const", "controle", "geral"),
          nome: "Sistemas e formas de controle",
          microthemes: [
            { id: k("const", "controle", "geral", "1"), nome: "Controle difuso" },
            { id: k("const", "controle", "geral", "2"), nome: "Controle concentrado" },
            { id: k("const", "controle", "geral", "3"), nome: "Cláusula de reserva de plenário" },
          ],
        },
        {
          id: k("const", "controle", "acoes"),
          nome: "Ações do controle concentrado",
          microthemes: [
            { id: k("const", "controle", "acoes", "1"), nome: "ADI" },
            { id: k("const", "controle", "acoes", "2"), nome: "ADC" },
            { id: k("const", "controle", "acoes", "3"), nome: "ADO" },
            { id: k("const", "controle", "acoes", "4"), nome: "ADPF" },
            { id: k("const", "controle", "acoes", "5"), nome: "Efeitos das decisões" },
          ],
        },
      ],
    },
  ],
};

// ============================================================
// DIREITO CIVIL (Parte Geral + Obrigações — base inicial)
// Atende tanto "Direito Civil I" quanto "Direito Civil II"
// ============================================================
const civilModulosBase: CurriculumModule[] = [
  {
    id: k("civil", "lindb"),
    nome: "LINDB e aplicação da lei",
    themes: [
      {
        id: k("civil", "lindb", "vigencia"),
        nome: "Vigência e eficácia da lei",
        microthemes: [
          { id: k("civil", "lindb", "vigencia", "1"), nome: "Vigência, vacatio legis e revogação" },
          { id: k("civil", "lindb", "vigencia", "2"), nome: "Obrigatoriedade das leis" },
          { id: k("civil", "lindb", "vigencia", "3"), nome: "Conflito de leis no tempo" },
        ],
      },
      {
        id: k("civil", "lindb", "integracao"),
        nome: "Integração e interpretação",
        microthemes: [
          { id: k("civil", "lindb", "integracao", "1"), nome: "Analogia, costume, princípios gerais e equidade" },
          { id: k("civil", "lindb", "integracao", "2"), nome: "Interpretação da norma" },
          { id: k("civil", "lindb", "integracao", "3"), nome: "Direito intertemporal" },
        ],
      },
    ],
  },
  {
    id: k("civil", "pgeral"),
    nome: "Parte Geral",
    themes: [
      {
        id: k("civil", "pgeral", "natural"),
        nome: "Pessoa Natural",
        microthemes: [
          { id: k("civil", "pgeral", "natural", "1"), nome: "Personalidade e capacidade" },
          { id: k("civil", "pgeral", "natural", "2"), nome: "Capacidade civil (Estatuto da PCD)" },
          { id: k("civil", "pgeral", "natural", "3"), nome: "Emancipação" },
          { id: k("civil", "pgeral", "natural", "4"), nome: "Direitos da personalidade" },
          { id: k("civil", "pgeral", "natural", "5"), nome: "Ausência e morte presumida" },
          { id: k("civil", "pgeral", "natural", "6"), nome: "Domicílio" },
        ],
      },
      {
        id: k("civil", "pgeral", "juridica"),
        nome: "Pessoa Jurídica",
        microthemes: [
          { id: k("civil", "pgeral", "juridica", "1"), nome: "Conceito e classificação" },
          { id: k("civil", "pgeral", "juridica", "2"), nome: "Início e fim da personalidade" },
          { id: k("civil", "pgeral", "juridica", "3"), nome: "Desconsideração da personalidade jurídica" },
          { id: k("civil", "pgeral", "juridica", "4"), nome: "Associações, fundações e sociedades" },
        ],
      },
      {
        id: k("civil", "pgeral", "bens"),
        nome: "Bens",
        microthemes: [
          { id: k("civil", "pgeral", "bens", "1"), nome: "Classificações dos bens" },
          { id: k("civil", "pgeral", "bens", "2"), nome: "Bens considerados em si mesmos" },
          { id: k("civil", "pgeral", "bens", "3"), nome: "Bens reciprocamente considerados" },
          { id: k("civil", "pgeral", "bens", "4"), nome: "Bens públicos" },
        ],
      },
      {
        id: k("civil", "pgeral", "fato"),
        nome: "Fato Jurídico",
        microthemes: [
          { id: k("civil", "pgeral", "fato", "1"), nome: "Negócio jurídico — elementos" },
          { id: k("civil", "pgeral", "fato", "2"), nome: "Defeitos do negócio jurídico" },
          { id: k("civil", "pgeral", "fato", "3"), nome: "Invalidade — nulidade e anulabilidade" },
          { id: k("civil", "pgeral", "fato", "4"), nome: "Prescrição e decadência" },
          { id: k("civil", "pgeral", "fato", "5"), nome: "Prova" },
        ],
      },
    ],
  },
  {
    id: k("civil", "obrig"),
    nome: "Direito das Obrigações",
    themes: [
      {
        id: k("civil", "obrig", "geral"),
        nome: "Teoria geral das obrigações",
        microthemes: [
          { id: k("civil", "obrig", "geral", "1"), nome: "Conceito e estrutura" },
          { id: k("civil", "obrig", "geral", "2"), nome: "Modalidades — dar, fazer, não fazer" },
          { id: k("civil", "obrig", "geral", "3"), nome: "Obrigações alternativas, divisíveis, solidárias" },
        ],
      },
      {
        id: k("civil", "obrig", "transm"),
        nome: "Transmissão e adimplemento",
        microthemes: [
          { id: k("civil", "obrig", "transm", "1"), nome: "Cessão de crédito e assunção de dívida" },
          { id: k("civil", "obrig", "transm", "2"), nome: "Pagamento — quem, a quem, onde, quando" },
          { id: k("civil", "obrig", "transm", "3"), nome: "Pagamento em consignação, sub-rogação, imputação" },
          { id: k("civil", "obrig", "transm", "4"), nome: "Dação, novação, compensação, confusão, remissão" },
        ],
      },
      {
        id: k("civil", "obrig", "inadim"),
        nome: "Inadimplemento das obrigações",
        microthemes: [
          { id: k("civil", "obrig", "inadim", "1"), nome: "Mora do devedor e do credor" },
          { id: k("civil", "obrig", "inadim", "2"), nome: "Perdas e danos" },
          { id: k("civil", "obrig", "inadim", "3"), nome: "Juros, cláusula penal e arras" },
        ],
      },
    ],
  },
  {
    id: k("civil", "contratos"),
    nome: "Contratos em geral",
    themes: [
      {
        id: k("civil", "contratos", "teoria"),
        nome: "Teoria geral dos contratos",
        microthemes: [
          { id: k("civil", "contratos", "teoria", "1"), nome: "Princípios contratuais" },
          { id: k("civil", "contratos", "teoria", "2"), nome: "Formação dos contratos" },
          { id: k("civil", "contratos", "teoria", "3"), nome: "Classificação dos contratos" },
          { id: k("civil", "contratos", "teoria", "4"), nome: "Vícios redibitórios e evicção" },
          { id: k("civil", "contratos", "teoria", "5"), nome: "Extinção dos contratos" },
        ],
      },
    ],
  },
  {
    id: k("civil", "respcivil"),
    nome: "Responsabilidade Civil",
    themes: [
      {
        id: k("civil", "respcivil", "geral"),
        nome: "Teoria da responsabilidade civil",
        microthemes: [
          { id: k("civil", "respcivil", "geral", "1"), nome: "Pressupostos do dever de indenizar" },
          { id: k("civil", "respcivil", "geral", "2"), nome: "Responsabilidade subjetiva e objetiva" },
          { id: k("civil", "respcivil", "geral", "3"), nome: "Excludentes de responsabilidade" },
          { id: k("civil", "respcivil", "geral", "4"), nome: "Dano moral, material e estético" },
        ],
      },
    ],
  },
];

const civil1: DisciplineCurriculum = { catalogId: "civil-1", modules: civilModulosBase };
const civil2: DisciplineCurriculum = { catalogId: "civil-2", modules: civilModulosBase };

// ============================================================
// PROCESSO CIVIL
// ============================================================
const processoCivil: DisciplineCurriculum = {
  catalogId: "processo-civil",
  modules: [
    {
      id: k("pc", "normas"),
      nome: "Normas Fundamentais e Aplicação do CPC",
      themes: [
        {
          id: k("pc", "normas", "principios"),
          nome: "Normas fundamentais do Processo Civil",
          microthemes: [
            { id: k("pc", "normas", "principios", "1"), nome: "Devido processo legal" },
            { id: k("pc", "normas", "principios", "2"), nome: "Contraditório e ampla defesa" },
            { id: k("pc", "normas", "principios", "3"), nome: "Cooperação e boa-fé processual" },
            { id: k("pc", "normas", "principios", "4"), nome: "Duração razoável do processo" },
            { id: k("pc", "normas", "principios", "5"), nome: "Primazia do julgamento de mérito" },
          ],
        },
        {
          id: k("pc", "normas", "aplicacao"),
          nome: "Aplicação das normas processuais",
          microthemes: [
            { id: k("pc", "normas", "aplicacao", "1"), nome: "Lei processual no tempo e no espaço" },
            { id: k("pc", "normas", "aplicacao", "2"), nome: "Jurisdição e ação" },
          ],
        },
      ],
    },
    {
      id: k("pc", "jurisdicao"),
      nome: "Jurisdição, Ação e Competência",
      themes: [
        {
          id: k("pc", "jurisdicao", "jur"),
          nome: "Jurisdição",
          microthemes: [
            { id: k("pc", "jurisdicao", "jur", "1"), nome: "Conceito, características e espécies" },
            { id: k("pc", "jurisdicao", "jur", "2"), nome: "Limites da jurisdição" },
          ],
        },
        {
          id: k("pc", "jurisdicao", "comp"),
          nome: "Competência",
          microthemes: [
            { id: k("pc", "jurisdicao", "comp", "1"), nome: "Critérios de fixação" },
            { id: k("pc", "jurisdicao", "comp", "2"), nome: "Competência absoluta e relativa" },
            { id: k("pc", "jurisdicao", "comp", "3"), nome: "Modificação e conflito de competência" },
          ],
        },
      ],
    },
    {
      id: k("pc", "sujeitos"),
      nome: "Sujeitos do Processo",
      themes: [
        {
          id: k("pc", "sujeitos", "partes"),
          nome: "Partes e procuradores",
          microthemes: [
            { id: k("pc", "sujeitos", "partes", "1"), nome: "Capacidade processual" },
            { id: k("pc", "sujeitos", "partes", "2"), nome: "Litisconsórcio" },
            { id: k("pc", "sujeitos", "partes", "3"), nome: "Intervenção de terceiros" },
            { id: k("pc", "sujeitos", "partes", "4"), nome: "Assistência, denunciação, chamamento, amicus curiae" },
          ],
        },
        {
          id: k("pc", "sujeitos", "juiz"),
          nome: "Juiz e auxiliares",
          microthemes: [
            { id: k("pc", "sujeitos", "juiz", "1"), nome: "Poderes, deveres e responsabilidades" },
            { id: k("pc", "sujeitos", "juiz", "2"), nome: "Impedimento e suspeição" },
            { id: k("pc", "sujeitos", "juiz", "3"), nome: "MP, Advocacia Pública e Defensoria" },
          ],
        },
      ],
    },
    {
      id: k("pc", "atos"),
      nome: "Atos Processuais",
      themes: [
        {
          id: k("pc", "atos", "geral"),
          nome: "Forma, tempo e lugar dos atos",
          microthemes: [
            { id: k("pc", "atos", "geral", "1"), nome: "Forma dos atos processuais" },
            { id: k("pc", "atos", "geral", "2"), nome: "Prazos processuais" },
            { id: k("pc", "atos", "geral", "3"), nome: "Comunicação dos atos — citação e intimação" },
            { id: k("pc", "atos", "geral", "4"), nome: "Nulidades processuais" },
          ],
        },
      ],
    },
    {
      id: k("pc", "conhecimento"),
      nome: "Processo de Conhecimento",
      themes: [
        {
          id: k("pc", "conhecimento", "petinic"),
          nome: "Petição inicial e resposta",
          microthemes: [
            { id: k("pc", "conhecimento", "petinic", "1"), nome: "Requisitos da petição inicial" },
            { id: k("pc", "conhecimento", "petinic", "2"), nome: "Indeferimento e emenda" },
            { id: k("pc", "conhecimento", "petinic", "3"), nome: "Improcedência liminar" },
            { id: k("pc", "conhecimento", "petinic", "4"), nome: "Contestação, reconvenção e revelia" },
          ],
        },
        {
          id: k("pc", "conhecimento", "provas"),
          nome: "Provas",
          microthemes: [
            { id: k("pc", "conhecimento", "provas", "1"), nome: "Teoria geral da prova" },
            { id: k("pc", "conhecimento", "provas", "2"), nome: "Ônus da prova e distribuição dinâmica" },
            { id: k("pc", "conhecimento", "provas", "3"), nome: "Meios de prova" },
          ],
        },
        {
          id: k("pc", "conhecimento", "sentenca"),
          nome: "Sentença e coisa julgada",
          microthemes: [
            { id: k("pc", "conhecimento", "sentenca", "1"), nome: "Elementos e requisitos" },
            { id: k("pc", "conhecimento", "sentenca", "2"), nome: "Coisa julgada formal e material" },
            { id: k("pc", "conhecimento", "sentenca", "3"), nome: "Limites objetivos e subjetivos" },
          ],
        },
      ],
    },
    {
      id: k("pc", "tutelas"),
      nome: "Tutela Provisória",
      themes: [
        {
          id: k("pc", "tutelas", "geral"),
          nome: "Tutelas de urgência e evidência",
          microthemes: [
            { id: k("pc", "tutelas", "geral", "1"), nome: "Tutela antecipada" },
            { id: k("pc", "tutelas", "geral", "2"), nome: "Tutela cautelar" },
            { id: k("pc", "tutelas", "geral", "3"), nome: "Tutela de evidência" },
            { id: k("pc", "tutelas", "geral", "4"), nome: "Estabilização da tutela antecipada antecedente" },
          ],
        },
      ],
    },
    {
      id: k("pc", "recursos"),
      nome: "Recursos",
      themes: [
        {
          id: k("pc", "recursos", "teoria"),
          nome: "Teoria geral dos recursos",
          microthemes: [
            { id: k("pc", "recursos", "teoria", "1"), nome: "Pressupostos recursais" },
            { id: k("pc", "recursos", "teoria", "2"), nome: "Efeitos dos recursos" },
            { id: k("pc", "recursos", "teoria", "3"), nome: "Apelação" },
            { id: k("pc", "recursos", "teoria", "4"), nome: "Agravo de instrumento e interno" },
            { id: k("pc", "recursos", "teoria", "5"), nome: "Embargos de declaração" },
            { id: k("pc", "recursos", "teoria", "6"), nome: "Recurso especial e extraordinário" },
          ],
        },
      ],
    },
    {
      id: k("pc", "exec"),
      nome: "Cumprimento de Sentença e Execução",
      themes: [
        {
          id: k("pc", "exec", "cumpr"),
          nome: "Cumprimento de sentença",
          microthemes: [
            { id: k("pc", "exec", "cumpr", "1"), nome: "Procedimento geral" },
            { id: k("pc", "exec", "cumpr", "2"), nome: "Impugnação ao cumprimento" },
          ],
        },
        {
          id: k("pc", "exec", "titulo"),
          nome: "Execução de título extrajudicial",
          microthemes: [
            { id: k("pc", "exec", "titulo", "1"), nome: "Títulos executivos extrajudiciais" },
            { id: k("pc", "exec", "titulo", "2"), nome: "Penhora, avaliação e expropriação" },
            { id: k("pc", "exec", "titulo", "3"), nome: "Embargos à execução" },
          ],
        },
      ],
    },
  ],
};

// ============================================================
// DIREITO ADMINISTRATIVO — base completa (módulos reutilizáveis)
// Administrativo I: fundamentos, organização, poderes, atos, bens públicos
// Administrativo II: agentes, licitações, serviços, controle
// ============================================================
const admModulosI: CurriculumModule[] = [
  {
    id: k("adm", "intro"),
    nome: "Administração Pública e Princípios",
    themes: [
      {
        id: k("adm", "intro", "conceito"),
        nome: "Administração Pública e regime jurídico",
        microthemes: [
          { id: k("adm", "intro", "conceito", "1"), nome: "Conceito de Direito Administrativo" },
          { id: k("adm", "intro", "conceito", "2"), nome: "Fontes e sistemas" },
          { id: k("adm", "intro", "conceito", "3"), nome: "Regime jurídico-administrativo" },
          { id: k("adm", "intro", "conceito", "4"), nome: "Administração Pública: sentido formal e material" },
        ],
      },
      {
        id: k("adm", "intro", "principios"),
        nome: "Princípios da Administração Pública",
        microthemes: [
          { id: k("adm", "intro", "principios", "1"), nome: "Legalidade" },
          { id: k("adm", "intro", "principios", "2"), nome: "Impessoalidade" },
          { id: k("adm", "intro", "principios", "3"), nome: "Moralidade" },
          { id: k("adm", "intro", "principios", "4"), nome: "Publicidade" },
          { id: k("adm", "intro", "principios", "5"), nome: "Eficiência" },
          { id: k("adm", "intro", "principios", "6"), nome: "Princípios infraconstitucionais (proporcionalidade, motivação...)" },
        ],
      },
    ],
  },
  {
    id: k("adm", "organizacao"),
    nome: "Organização Administrativa",
    themes: [
      {
        id: k("adm", "organizacao", "centralizada"),
        nome: "Administração direta e indireta",
        microthemes: [
          { id: k("adm", "organizacao", "centralizada", "1"), nome: "Desconcentração e descentralização" },
          { id: k("adm", "organizacao", "centralizada", "2"), nome: "Autarquias" },
          { id: k("adm", "organizacao", "centralizada", "3"), nome: "Fundações públicas" },
          { id: k("adm", "organizacao", "centralizada", "4"), nome: "Empresas públicas e sociedades de economia mista" },
          { id: k("adm", "organizacao", "centralizada", "5"), nome: "Entes de cooperação (S e OS, OSCIP)" },
        ],
      },
    ],
  },
  {
    id: k("adm", "poderes"),
    nome: "Poderes da Administração",
    themes: [
      {
        id: k("adm", "poderes", "tipos"),
        nome: "Espécies de poderes administrativos",
        microthemes: [
          { id: k("adm", "poderes", "tipos", "1"), nome: "Poder vinculado e discricionário" },
          { id: k("adm", "poderes", "tipos", "2"), nome: "Poder hierárquico" },
          { id: k("adm", "poderes", "tipos", "3"), nome: "Poder disciplinar" },
          { id: k("adm", "poderes", "tipos", "4"), nome: "Poder regulamentar" },
          { id: k("adm", "poderes", "tipos", "5"), nome: "Poder de polícia" },
        ],
      },
    ],
  },
  {
    id: k("adm", "atos"),
    nome: "Atos Administrativos",
    themes: [
      {
        id: k("adm", "atos", "teoria"),
        nome: "Teoria dos atos administrativos",
        microthemes: [
          { id: k("adm", "atos", "teoria", "1"), nome: "Conceito, requisitos e atributos" },
          { id: k("adm", "atos", "teoria", "2"), nome: "Classificação dos atos" },
          { id: k("adm", "atos", "teoria", "3"), nome: "Discricionariedade e vinculação" },
          { id: k("adm", "atos", "teoria", "4"), nome: "Extinção, revogação e anulação" },
          { id: k("adm", "atos", "teoria", "5"), nome: "Convalidação" },
        ],
      },
    ],
  },
  {
    id: k("adm", "bens"),
    nome: "Bens Públicos",
    themes: [
      {
        id: k("adm", "bens", "geral"),
        nome: "Regime jurídico dos bens públicos",
        microthemes: [
          { id: k("adm", "bens", "geral", "1"), nome: "Conceito e classificação dos bens públicos" },
          { id: k("adm", "bens", "geral", "2"), nome: "Afetação e desafetação" },
          { id: k("adm", "bens", "geral", "3"), nome: "Regime jurídico (inalienabilidade, impenhorabilidade, imprescritibilidade)" },
          { id: k("adm", "bens", "geral", "4"), nome: "Uso de bem público por particular (autorização, permissão, concessão)" },
          { id: k("adm", "bens", "geral", "5"), nome: "Espécies de bens (terras devolutas, terrenos de marinha, etc.)" },
        ],
      },
    ],
  },
];

const admModulosII: CurriculumModule[] = [
  {
    id: k("adm", "servidores"),
    nome: "Agentes Públicos",
    themes: [
      {
        id: k("adm", "servidores", "regime"),
        nome: "Regime dos servidores",
        microthemes: [
          { id: k("adm", "servidores", "regime", "1"), nome: "Classificação dos agentes públicos" },
          { id: k("adm", "servidores", "regime", "2"), nome: "Cargo, emprego e função" },
          { id: k("adm", "servidores", "regime", "3"), nome: "Provimento, vacância e estabilidade" },
          { id: k("adm", "servidores", "regime", "4"), nome: "Direitos, deveres e responsabilidades (Lei 8.112/90)" },
        ],
      },
    ],
  },
  {
    id: k("adm", "licitacoes"),
    nome: "Licitações e Contratos",
    themes: [
      {
        id: k("adm", "licitacoes", "licit"),
        nome: "Licitação (Lei 14.133/21)",
        microthemes: [
          { id: k("adm", "licitacoes", "licit", "1"), nome: "Princípios e objetivos" },
          { id: k("adm", "licitacoes", "licit", "2"), nome: "Modalidades e critérios de julgamento" },
          { id: k("adm", "licitacoes", "licit", "3"), nome: "Fases do processo licitatório" },
          { id: k("adm", "licitacoes", "licit", "4"), nome: "Dispensa e inexigibilidade" },
        ],
      },
      {
        id: k("adm", "licitacoes", "contratos"),
        nome: "Contratos administrativos",
        microthemes: [
          { id: k("adm", "licitacoes", "contratos", "1"), nome: "Características e cláusulas exorbitantes" },
          { id: k("adm", "licitacoes", "contratos", "2"), nome: "Execução e alteração" },
          { id: k("adm", "licitacoes", "contratos", "3"), nome: "Extinção e sanções" },
        ],
      },
    ],
  },
  {
    id: k("adm", "servicos"),
    nome: "Serviços Públicos",
    themes: [
      {
        id: k("adm", "servicos", "geral"),
        nome: "Teoria dos serviços públicos",
        microthemes: [
          { id: k("adm", "servicos", "geral", "1"), nome: "Conceito, classificação e princípios" },
          { id: k("adm", "servicos", "geral", "2"), nome: "Concessão e permissão" },
          { id: k("adm", "servicos", "geral", "3"), nome: "Parcerias Público-Privadas" },
        ],
      },
    ],
  },
  {
    id: k("adm", "controle"),
    nome: "Controle e Responsabilidade",
    themes: [
      {
        id: k("adm", "controle", "tipos"),
        nome: "Controle da Administração",
        microthemes: [
          { id: k("adm", "controle", "tipos", "1"), nome: "Controle interno e externo" },
          { id: k("adm", "controle", "tipos", "2"), nome: "Controle judicial" },
          { id: k("adm", "controle", "tipos", "3"), nome: "Tribunais de Contas" },
        ],
      },
      {
        id: k("adm", "controle", "resp"),
        nome: "Responsabilidade do Estado e Improbidade",
        microthemes: [
          { id: k("adm", "controle", "resp", "1"), nome: "Responsabilidade civil do Estado (art. 37, §6º)" },
          { id: k("adm", "controle", "resp", "2"), nome: "Excludentes e ação regressiva" },
          { id: k("adm", "controle", "resp", "3"), nome: "Improbidade administrativa (Lei 8.429/92)" },
        ],
      },
    ],
  },
];

const administrativo1: DisciplineCurriculum = { catalogId: "administrativo-1", modules: admModulosI };
const administrativo2: DisciplineCurriculum = { catalogId: "administrativo-2", modules: admModulosII };
// Alias retrocompatível
const administrativo: DisciplineCurriculum = { catalogId: "administrativo", modules: admModulosI };


export const LEGAL_CURRICULUM: DisciplineCurriculum[] = [
  // Semestre 4 vem primeiro: substitui versões legadas com mesmo catalogId
  // (ex.: administrativo-1) pela base curricular oficial completa.
  ...SEMESTRE_4,
  constitucional,
  civil1,
  civil2,
  processoCivil,
  administrativo,
  administrativo1,
  administrativo2,
];

export function getCurriculum(catalogId?: string): DisciplineCurriculum | undefined {
  if (!catalogId) return undefined;
  return LEGAL_CURRICULUM.find((c) => c.catalogId === catalogId);
}

// Retorna os primeiros temas (1 por módulo, max N) — usado para sugestões iniciais
export function getInitialThemes(catalogId: string, max = 3): Theme[] {
  const cur = getCurriculum(catalogId);
  if (!cur) return [];
  const themes: Theme[] = [];
  for (const m of cur.modules) {
    if (m.themes[0]) themes.push(m.themes[0]);
    if (themes.length >= max) break;
  }
  return themes;
}

export function countMicrothemes(catalogId?: string): number {
  const cur = getCurriculum(catalogId);
  if (!cur) return 0;
  let n = 0;
  for (const m of cur.modules) for (const t of m.themes) n += t.microthemes.length;
  return n;
}

export interface FlatMicrotheme {
  microthemeId: string;
  microthemeNome: string;
  themeId: string;
  themeNome: string;
  moduleId: string;
  moduleNome: string;
}

export function getAllMicrothemes(catalogId?: string): FlatMicrotheme[] {
  const cur = getCurriculum(catalogId);
  if (!cur) return [];
  const out: FlatMicrotheme[] = [];
  for (const mod of cur.modules) {
    for (const theme of mod.themes) {
      for (const micro of theme.microthemes) {
        out.push({
          microthemeId: micro.id,
          microthemeNome: micro.nome,
          themeId: theme.id,
          themeNome: theme.nome,
          moduleId: mod.id,
          moduleNome: mod.nome,
        });
      }
    }
  }
  return out;
}

export function findMicrotheme(catalogId: string | undefined, microthemeId: string): FlatMicrotheme | undefined {
  return getAllMicrothemes(catalogId).find((m) => m.microthemeId === microthemeId);
}

