// ============================================================
// 4º SEMESTRE — Base Curricular Oficial Organiza Direito
// Hierarquia: Disciplina → Módulo → Tema → Microtema
// Importação integral. Não resumir, não fundir.
// ============================================================
import { buildDiscipline } from "./builder";
import type { DisciplineCurriculum } from "../legalCurriculum";
import type { ModuleData } from "./builder";

// ─────────────────────────────────────────────────────────────
// Direito Administrativo I
// ─────────────────────────────────────────────────────────────
const adm1: ModuleData[] = [
  ["Direito Administrativo e Administração Pública", [
    ["Introdução ao Direito Administrativo", [
      "Conceito de Direito Administrativo",
      "Objeto do Direito Administrativo",
      "Autonomia do Direito Administrativo",
      "Fontes do Direito Administrativo",
      "Regime jurídico-administrativo",
      "Interesse público",
      "Supremacia do interesse público",
      "Indisponibilidade do interesse público",
    ]],
    ["Estado, Poderes e Funções", [
      "Conceito de Estado",
      "Elementos do Estado",
      "Soberania",
      "Poder político",
      "Separação dos poderes",
      "Função legislativa",
      "Função jurisdicional",
      "Função administrativa",
      "Funções típicas",
      "Funções atípicas",
    ]],
    ["Administração Pública", [
      "Conceito de Administração Pública",
      "Administração Pública em sentido subjetivo",
      "Administração Pública em sentido objetivo",
      "Administração Pública formal",
      "Administração Pública material",
    ]],
  ]],
  ["Princípios da Administração Pública", [
    ["Princípios Expressos do Art. 37 da Constituição", [
      "Legalidade administrativa",
      "Impessoalidade",
      "Moralidade administrativa",
      "Publicidade",
      "Eficiência",
    ]],
    ["Princípios Implícitos", [
      "Contraditório",
      "Ampla defesa",
      "Continuidade do serviço público",
      "Autotutela",
      "Razoabilidade",
      "Proporcionalidade",
      "Finalidade",
      "Motivação",
      "Isonomia",
      "Segurança jurídica",
    ]],
    ["Aplicação dos Princípios", [
      "Conflito entre princípios administrativos",
      "Controle da legalidade",
      "Controle da legitimidade",
      "Controle da discricionariedade",
      "Jurisprudência dos tribunais superiores",
    ]],
  ]],
  ["Organização Administrativa", [
    ["Estrutura Administrativa do Estado", [
      "Centralização administrativa",
      "Descentralização administrativa",
      "Desconcentração administrativa",
      "Delegação",
      "Avocação",
    ]],
    ["Administração Direta", [
      "Conceito",
      "União",
      "Estados",
      "Distrito Federal",
      "Municípios",
      "Órgãos integrantes",
    ]],
    ["Administração Indireta", [
      "Conceito",
      "Personalidade jurídica própria",
      "Criação por lei",
      "Controle finalístico",
    ]],
  ]],
  ["Entidades da Administração Indireta", [
    ["Autarquias", [
      "Conceito",
      "Características",
      "Regime jurídico",
      "Autarquias especiais",
      "Agências reguladoras",
      "Agências executivas",
    ]],
    ["Fundações Públicas", [
      "Conceito",
      "Fundação pública de direito público",
      "Fundação pública de direito privado",
      "Regime jurídico",
    ]],
    ["Empresas Públicas", [
      "Conceito",
      "Capital público",
      "Personalidade jurídica",
      "Regime jurídico híbrido",
    ]],
    ["Sociedades de Economia Mista", [
      "Conceito",
      "Capital misto",
      "Controle estatal",
      "Regime jurídico",
    ]],
    ["Terceiro Setor", [
      "Organizações Sociais",
      "OSCIPs",
      "Entidades paraestatais",
      "Colaboração com o Estado",
    ]],
  ]],
  ["Órgãos Públicos", [
    ["Teoria do Órgão", [
      "Conceito de órgão público",
      "Teoria da imputação volitiva",
      "Agente e órgão",
      "Competência administrativa",
    ]],
    ["Classificação dos Órgãos", [
      "Órgãos independentes",
      "Órgãos autônomos",
      "Órgãos superiores",
      "Órgãos subalternos",
    ]],
    ["Capacidade Processual", [
      "Personalidade jurídica",
      "Personalidade judiciária",
      "Capacidade processual dos órgãos",
    ]],
  ]],
  ["Poderes Administrativos I", [
    ["Poder Vinculado", [
      "Conceito",
      "Atuação vinculada",
      "Limites legais",
    ]],
    ["Poder Discricionário", [
      "Conceito",
      "Mérito administrativo",
      "Conveniência",
      "Oportunidade",
      "Limites da discricionariedade",
    ]],
    ["Poder Hierárquico", [
      "Hierarquia administrativa",
      "Delegação",
      "Avocação",
      "Fiscalização interna",
    ]],
    ["Poder Disciplinar", [
      "Conceito",
      "Infração funcional",
      "Sanção administrativa",
      "Processo administrativo disciplinar",
    ]],
  ]],
  ["Poderes Administrativos II", [
    ["Poder Regulamentar", [
      "Regulamentos administrativos",
      "Decreto regulamentar",
      "Decreto autônomo",
      "Limites do poder regulamentar",
    ]],
    ["Poder de Polícia", [
      "Conceito",
      "Fundamentos",
      "Atributos",
      "Ciclo de polícia",
      "Polícia administrativa",
      "Polícia judiciária",
    ]],
    ["Limitações ao Poder de Polícia", [
      "Legalidade",
      "Proporcionalidade",
      "Controle jurisdicional",
      "Abuso de poder",
    ]],
  ]],
  ["Agentes Públicos I", [
    ["Teoria Geral dos Agentes Públicos", [
      "Conceito",
      "Espécies de agentes públicos",
      "Agentes políticos",
      "Servidores públicos",
      "Empregados públicos",
      "Particulares em colaboração",
    ]],
    ["Cargos, Empregos e Funções", [
      "Cargo público",
      "Emprego público",
      "Função pública",
      "Cargo efetivo",
      "Cargo em comissão",
      "Função de confiança",
    ]],
  ]],
  ["Agentes Públicos II", [
    ["Direitos dos Agentes Públicos", [
      "Remuneração",
      "Subsídio",
      "Férias",
      "Licenças",
      "Aposentadoria",
    ]],
    ["Deveres dos Agentes Públicos", [
      "Dever de legalidade",
      "Dever de lealdade",
      "Dever de eficiência",
      "Dever de probidade",
    ]],
    ["Responsabilidade dos Agentes Públicos", [
      "Responsabilidade civil",
      "Responsabilidade penal",
      "Responsabilidade administrativa",
      "Independência das instâncias",
      "Cumulação de sanções",
    ]],
  ]],
  ["Atos Administrativos I", [
    ["Conceito e Estrutura dos Atos Administrativos", [
      "Conceito de ato administrativo",
      "Fato administrativo",
      "Ato da administração",
      "Ato administrativo em sentido estrito",
    ]],
    ["Requisitos dos Atos Administrativos", [
      "Competência",
      "Finalidade",
      "Forma",
      "Motivo",
      "Objeto",
    ]],
    ["Atributos dos Atos Administrativos", [
      "Presunção de legitimidade",
      "Presunção de veracidade",
      "Imperatividade",
      "Autoexecutoriedade",
      "Tipicidade",
    ]],
  ]],
  ["Atos Administrativos II", [
    ["Classificação dos Atos Administrativos", [
      "Atos gerais",
      "Atos individuais",
      "Atos simples",
      "Atos complexos",
      "Atos compostos",
    ]],
    ["Espécies de Atos Administrativos", [
      "Atos normativos",
      "Atos ordinatórios",
      "Atos negociais",
      "Atos enunciativos",
      "Atos punitivos",
    ]],
    ["Extinção dos Atos Administrativos", [
      "Anulação",
      "Revogação",
      "Cassação",
      "Caducidade",
      "Contraposição",
    ]],
    ["Convalidação", [
      "Conceito",
      "Requisitos",
      "Limites da convalidação",
    ]],
  ]],
  ["Bens Públicos I", [
    ["Teoria Geral dos Bens Públicos", [
      "Conceito",
      "Titularidade",
      "Regime jurídico dos bens públicos",
    ]],
    ["Classificação dos Bens Públicos", [
      "Bens de uso comum do povo",
      "Bens de uso especial",
      "Bens dominicais",
    ]],
    ["Características dos Bens Públicos", [
      "Imprescritibilidade",
      "Impenhorabilidade",
      "Inalienabilidade relativa",
      "Não onerabilidade",
    ]],
  ]],
  ["Bens Públicos II", [
    ["Aquisição de Bens Públicos", [
      "Compra",
      "Doação",
      "Desapropriação",
      "Usucapião inversa administrativa",
      "Arrecadação",
    ]],
    ["Alienação de Bens Públicos", [
      "Requisitos legais",
      "Interesse público",
      "Avaliação prévia",
      "Licitação",
    ]],
    ["Uso Privativo de Bem Público", [
      "Autorização de uso",
      "Permissão de uso",
      "Concessão de uso",
      "Concessão de direito real de uso",
    ]],
  ]],
  ["Intervenção do Estado na Propriedade I", [
    ["Restrições Administrativas", [
      "Limitações administrativas",
      "Características",
      "Fundamentos constitucionais",
    ]],
    ["Requisição Administrativa", [
      "Conceito",
      "Requisitos",
      "Indenização",
    ]],
    ["Ocupação Temporária", [
      "Conceito",
      "Hipóteses",
      "Consequências jurídicas",
    ]],
    ["Servidão Administrativa", [
      "Conceito",
      "Constituição",
      "Indenização",
    ]],
  ]],
  ["Intervenção do Estado na Propriedade II", [
    ["Tombamento", [
      "Conceito",
      "Natureza jurídica",
      "Competência",
      "Procedimento",
      "Efeitos",
      "Cancelamento",
    ]],
  ]],
  ["Intervenção do Estado na Propriedade III", [
    ["Desapropriação", [
      "Conceito",
      "Fundamento constitucional",
      "Utilidade pública",
      "Necessidade pública",
      "Interesse social",
    ]],
    ["Procedimento Expropriatório", [
      "Fase declaratória",
      "Fase executória",
      "Imissão provisória na posse",
      "Indenização prévia",
    ]],
    ["Modalidades de Desapropriação", [
      "Desapropriação ordinária",
      "Desapropriação por interesse social",
      "Desapropriação-sanção urbana",
      "Desapropriação-sanção rural",
      "Desapropriação confiscatória",
    ]],
  ]],
];

// ─────────────────────────────────────────────────────────────
// Direito Internacional Público
// ─────────────────────────────────────────────────────────────
const dip: ModuleData[] = [
  ["Introdução ao Direito Internacional Público", [
    ["Conceito, Objeto e Características", [
      "Conceito de Direito Internacional Público",
      "Objeto do Direito Internacional Público",
      "Características do DIP",
      "Sociedade internacional",
      "Comunidade internacional",
      "Ordem jurídica internacional",
      "Descentralização do sistema internacional",
    ]],
    ["Evolução Histórica do Direito Internacional", [
      "Direito internacional na Antiguidade",
      "Paz de Vestfália",
      "Formação do Estado moderno",
      "Consolidação do sistema internacional",
      "Sociedade das Nações",
      "Organização das Nações Unidas",
      "Evolução contemporânea do DIP",
    ]],
    ["Eurocentrismo e Formação Clássica do DIP", [
      "Origem europeia do DIP",
      "Colonialismo",
      "Expansão imperial",
      "Exclusão de povos não europeus",
      "Universalização do Direito Internacional",
    ]],
    ["Percepções Regionais do Direito Internacional", [
      "Perspectiva latino-americana",
      "Perspectiva africana",
      "Perspectiva asiática",
      "Sul Global",
      "Críticas ao universalismo europeu",
    ]],
    ["Reações às Teorias Hegemônicas", [
      "Abordagens críticas do DIP",
      "TWAIL (Third World Approaches to International Law)",
      "Descolonização jurídica",
      "Pluralismo jurídico internacional",
    ]],
  ]],
  ["Teoria Geral do Direito Internacional", [
    ["Fundamentos do Direito Internacional", [
      "Fundamento de validade do DIP",
      "Obrigatoriedade das normas internacionais",
      "Consentimento estatal",
      "Cooperação internacional",
    ]],
    ["Voluntarismo e Objetivismo", [
      "Teoria voluntarista",
      "Teoria objetivista",
      "Consentimento dos Estados",
      "Normas imperativas internacionais",
    ]],
    ["Monismo e Dualismo", [
      "Teoria monista",
      "Teoria dualista",
      "Relação entre direito interno e internacional",
      "Incorporação normativa",
    ]],
    ["Soberania no Mundo Contemporâneo", [
      "Conceito clássico de soberania",
      "Limitações à soberania",
      "Interdependência global",
      "Globalização",
      "Cooperação internacional",
      "Organizações internacionais",
    ]],
  ]],
  ["Sujeitos de Direito Internacional", [
    ["Estado", [
      "Conceito de Estado",
      "Elementos constitutivos",
      "Território",
      "Povo",
      "Governo",
      "Soberania",
    ]],
    ["Reconhecimento de Estados e Governos", [
      "Reconhecimento de Estado",
      "Reconhecimento de governo",
      "Teoria declaratória",
      "Teoria constitutiva",
    ]],
    ["Personalidade Jurídica Internacional", [
      "Conceito",
      "Capacidade internacional",
      "Direitos internacionais",
      "Deveres internacionais",
    ]],
    ["Indivíduo como Sujeito Internacional", [
      "Evolução histórica",
      "Direitos humanos",
      "Responsabilidade penal internacional",
      "Capacidade processual internacional",
    ]],
    ["Organizações Internacionais", [
      "Conceito",
      "Personalidade jurídica",
      "Competências",
      "Estrutura institucional",
      "Responsabilidade internacional",
    ]],
  ]],
  ["Responsabilidade Internacional", [
    ["Ilícito Internacional", [
      "Conceito",
      "Violação de obrigação internacional",
      "Ato ilícito internacional",
      "Elementos do ilícito",
    ]],
    ["Elementos da Responsabilidade Internacional", [
      "Conduta",
      "Imputação",
      "Violação jurídica",
      "Dano internacional",
    ]],
    ["Formas de Reparação", [
      "Restituição",
      "Indenização",
      "Satisfação",
      "Garantias de não repetição",
    ]],
    ["Responsabilidade por Omissão", [
      "Dever de agir",
      "Falha estatal",
      "Omissão internacionalmente relevante",
    ]],
  ]],
  ["Fontes do Direito Internacional", [
    ["Tratados Internacionais", [
      "Conceito",
      "Natureza jurídica",
      "Classificação",
      "Negociação",
      "Assinatura",
      "Ratificação",
      "Promulgação",
      "Denúncia",
    ]],
    ["Convenção de Viena sobre Direito dos Tratados", [
      "Aplicação",
      "Interpretação",
      "Reservas",
      "Nulidades",
      "Extinção dos tratados",
    ]],
    ["Costume Internacional", [
      "Prática reiterada",
      "Opinio juris",
      "Formação do costume",
      "Costume regional",
    ]],
    ["Princípios Gerais do Direito", [
      "Conceito",
      "Aplicação subsidiária",
      "Reconhecimento internacional",
    ]],
    ["Soft Law", [
      "Conceito",
      "Recomendações",
      "Declarações internacionais",
      "Efeitos jurídicos indiretos",
    ]],
    ["Incorporação dos Tratados no Brasil", [
      "Assinatura",
      "Aprovação pelo Congresso",
      "Ratificação",
      "Decreto presidencial",
      "Hierarquia normativa",
      "Tratados de direitos humanos",
    ]],
  ]],
  ["Domínio Público Internacional", [
    ["Espaços Internacionais", [
      "Conceito",
      "Espaços sem soberania estatal",
      "Utilização comum",
    ]],
    ["Regimes Jurídicos Internacionais", [
      "Alto-mar",
      "Espaço exterior",
      "Antártica",
      "Fundos marinhos internacionais",
    ]],
  ]],
  ["Direito Diplomático e Consular", [
    ["Relações Diplomáticas", [
      "Diplomacia",
      "Missões diplomáticas",
      "Embaixadas",
      "Funções diplomáticas",
    ]],
    ["Imunidades Diplomáticas", [
      "Imunidade de jurisdição",
      "Inviolabilidade",
      "Privilégios diplomáticos",
      "Convenção de Viena de 1961",
    ]],
    ["Relações Consulares", [
      "Funções consulares",
      "Assistência consular",
      "Proteção de nacionais",
      "Convenção de Viena de 1963",
    ]],
    ["Imunidades Consulares", [
      "Alcance das imunidades",
      "Diferenças em relação aos diplomatas",
    ]],
  ]],
  ["Conflitos Internacionais e Direito Internacional Humanitário", [
    ["Uso da Força no Direito Internacional", [
      "Proibição do uso da força",
      "Carta da ONU",
      "Segurança coletiva",
      "Agressão internacional",
    ]],
    ["Exceções ao Uso da Força", [
      "Legítima defesa",
      "Autodefesa coletiva",
      "Autorização do Conselho de Segurança",
    ]],
    ["Conflitos Armados", [
      "Conflitos armados internacionais",
      "Conflitos armados não internacionais",
      "Guerra civil",
      "Conflitos híbridos",
    ]],
    ["Princípios do Direito Internacional Humanitário", [
      "Humanidade",
      "Distinção",
      "Necessidade militar",
      "Proporcionalidade",
    ]],
    ["Proteção das Vítimas de Guerra", [
      "Convenções de Genebra",
      "Civis",
      "Feridos",
      "Náufragos",
      "Prisioneiros de guerra",
    ]],
  ]],
  ["Direitos Humanos e Direito Internacional Penal", [
    ["Sistema Global de Direitos Humanos", [
      "Carta da ONU",
      "Declaração Universal dos Direitos Humanos",
      "Pactos Internacionais",
      "Órgãos de monitoramento",
    ]],
    ["Sistema Interamericano", [
      "OEA",
      "Comissão Interamericana",
      "Corte Interamericana",
      "Petições individuais",
    ]],
    ["Tribunal Penal Internacional", [
      "Estatuto de Roma",
      "Competência",
      "Crimes internacionais",
      "Jurisdição complementar",
    ]],
    ["Responsabilidade Penal Individual", [
      "Crimes contra a humanidade",
      "Genocídio",
      "Crimes de guerra",
      "Crime de agressão",
    ]],
  ]],
  ["Direito do Mar", [
    ["Formação Histórica", [
      "Liberdade dos mares",
      "Evolução histórica",
      "Convenção das Nações Unidas sobre o Direito do Mar",
    ]],
    ["Espaços Marítimos", [
      "Águas interiores",
      "Mar territorial",
      "Zona contígua",
      "Zona econômica exclusiva",
      "Plataforma continental",
      "Alto-mar",
    ]],
    ["Direitos e Deveres dos Estados", [
      "Navegação",
      "Exploração econômica",
      "Fiscalização",
      "Jurisdição marítima",
    ]],
    ["Proteção do Meio Ambiente Marinho", [
      "Poluição marinha",
      "Preservação ambiental",
      "Responsabilidade internacional",
    ]],
  ]],
  ["Proteção Internacional do Meio Ambiente", [
    ["Direito Ambiental Internacional", [
      "Conceito",
      "Evolução histórica",
      "Desenvolvimento sustentável",
    ]],
    ["Acordos Ambientais Internacionais", [
      "Declaração de Estocolmo",
      "Rio-92",
      "Acordo de Paris",
      "Convenção sobre Biodiversidade",
    ]],
    ["Governança Climática", [
      "Mudanças climáticas",
      "COPs",
      "Redução de emissões",
      "Responsabilidades comuns porém diferenciadas",
    ]],
  ]],
  ["Integração Regional e Comércio Internacional", [
    ["Integração Regional", [
      "Conceito",
      "Etapas da integração econômica",
      "Zona de livre comércio",
      "União aduaneira",
      "Mercado comum",
    ]],
    ["Mercosul", [
      "Tratado de Assunção",
      "Estrutura institucional",
      "Solução de controvérsias",
      "Livre circulação",
    ]],
    ["Organização Mundial do Comércio", [
      "Histórico",
      "Estrutura",
      "Princípios comerciais",
      "Solução de controvérsias",
    ]],
    ["Organização Internacional do Trabalho", [
      "Estrutura",
      "Convenções internacionais",
      "Normas trabalhistas internacionais",
    ]],
  ]],
  ["Sistema Financeiro Internacional e Tribunais Internacionais", [
    ["Sistema Financeiro Internacional", [
      "Cooperação econômica internacional",
      "Governança financeira global",
      "Crises financeiras internacionais",
    ]],
    ["Fundo Monetário Internacional (FMI)", [
      "Estrutura",
      "Competências",
      "Assistência financeira",
      "Estabilidade monetária",
    ]],
    ["Banco Mundial", [
      "Estrutura",
      "Financiamento do desenvolvimento",
      "Projetos internacionais",
    ]],
    ["Corte Internacional de Justiça (CIJ)", [
      "Competência",
      "Jurisdição contenciosa",
      "Pareceres consultivos",
    ]],
    ["Tribunais Internacionais", [
      "Tribunal Penal Internacional",
      "Corte Interamericana de Direitos Humanos",
      "Tribunais regionais",
      "Solução jurisdicional de controvérsias",
    ]],
  ]],
];

// ─────────────────────────────────────────────────────────────
// Jurisdição Constitucional (Constitucional III)
// ─────────────────────────────────────────────────────────────
const jurisdConst: ModuleData[] = [
  ["Teoria Geral do Controle de Constitucionalidade", [
    ["Constituição e Supremacia Constitucional", [
      "Conceito de Constituição",
      "Supremacia constitucional",
      "Rigidez constitucional",
      "Compatibilidade vertical das normas",
      "Constitucionalidade",
      "Inconstitucionalidade",
    ]],
    ["Constituição e Inconstitucionalidades", [
      "Plano da existência",
      "Plano da validade",
      "Plano da eficácia",
      "Invalidade constitucional",
      "Nulidade",
      "Anulabilidade",
      "Inconstitucionalidade material",
      "Inconstitucionalidade formal",
    ]],
  ]],
  ["Classificação das Inconstitucionalidades", [
    ["Inconstitucionalidade Formal", [
      "Conceito",
      "Vício de competência",
      "Vício de iniciativa",
      "Vício procedimental",
    ]],
    ["Inconstitucionalidade Material", [
      "Conceito",
      "Violação ao conteúdo constitucional",
      "Controle de compatibilidade material",
    ]],
    ["Inconstitucionalidade por Ação e por Omissão", [
      "Omissão total",
      "Omissão parcial",
      "Mora legislativa",
      "Inércia administrativa",
    ]],
    ["Inconstitucionalidade Originária e Superveniente", [
      "Conceito",
      "Recepção constitucional",
      "Não recepção",
    ]],
  ]],
  ["Classificações do Controle de Constitucionalidade", [
    ["Classificação Quanto ao Órgão", [
      "Controle político",
      "Controle judicial",
      "Controle misto",
    ]],
    ["Controle Político", [
      "Poder Legislativo",
      "Poder Executivo",
      "Comissões legislativas",
      "Veto jurídico",
    ]],
    ["Controle Judicial", [
      "Controle pelo Poder Judiciário",
      "Competência dos tribunais",
      "Jurisdição constitucional",
    ]],
    ["Classificação Quanto ao Modo", [
      "Controle difuso",
      "Controle concentrado",
      "Controle concreto",
      "Controle abstrato",
    ]],
    ["Controle Difuso", [
      "Origem histórica",
      "Caso Marbury v. Madison",
      "Questão incidental",
      "Caso concreto",
    ]],
    ["Controle Concentrado", [
      "Controle abstrato",
      "Processo objetivo",
      "Competência do STF",
    ]],
    ["Classificação Quanto ao Momento", [
      "Controle preventivo",
      "Controle repressivo",
      "Controle legislativo preventivo",
      "Controle executivo preventivo",
      "Controle jurisdicional repressivo",
    ]],
  ]],
  ["Jurisdição Constitucional Comparada", [
    ["Cortes Constitucionais no Direito Comparado", [
      "Modelo americano",
      "Modelo austríaco",
      "Sistema francês",
      "Tribunal Constitucional Alemão",
      "Corte Constitucional Italiana",
      "Controle constitucional em Portugal",
    ]],
    ["Hans Kelsen e o Modelo Austríaco", [
      "Jurisdição constitucional",
      "Tribunal Constitucional",
      "Controle concentrado",
      "Teoria kelseniana",
    ]],
  ]],
  ["Evolução do Controle de Constitucionalidade no Brasil", [
    ["Histórico do Controle de Constitucionalidade", [
      "Constituição de 1824",
      "Constituição de 1891",
      "Constituição de 1934",
      "Constituição de 1937",
      "Constituição de 1946",
      "Constituição de 1967",
      "Constituição de 1988",
    ]],
    ["Evolução dos Instrumentos de Controle", [
      "Representação interventiva",
      "Representação de inconstitucionalidade",
      "ADI",
      "ADC",
      "ADO",
      "ADPF",
    ]],
  ]],
  ["Controle Difuso de Constitucionalidade", [
    ["Aspectos Gerais", [
      "Conceito",
      "Finalidade",
      "Controle incidental",
      "Controle concreto",
    ]],
    ["Competência", [
      "Juiz de primeiro grau",
      "Tribunais",
      "STF",
      "STJ",
    ]],
    ["Legitimidade", [
      "Partes do processo",
      "Ministério Público",
      "Terceiros interessados",
    ]],
    ["Instrumentos do Controle Difuso", [
      "Ação ordinária",
      "Mandado de segurança",
      "Habeas corpus",
      "Habeas data",
      "Ação civil pública",
      "Recursos",
    ]],
  ]],
  ["Procedimento do Controle Difuso", [
    ["Cláusula de Reserva de Plenário", [
      "Art. 97 da Constituição",
      "Órgão especial",
      "Maioria absoluta",
      "Súmula Vinculante nº 10",
    ]],
    ["Incidente de Inconstitucionalidade", [
      "Arguição incidental",
      "Procedimento",
      "Julgamento",
    ]],
    ["Participação do Ministério Público", [
      "Intervenção obrigatória",
      "Fiscal da ordem jurídica",
    ]],
  ]],
  ["Efeitos da Declaração de Inconstitucionalidade — Controle Difuso", [
    ["Efeitos da Decisão no Controle Difuso", [
      "Efeito inter partes",
      "Efeito ex tunc",
      "Retroatividade",
      "Coisa julgada",
    ]],
    ["Ampliação dos Efeitos", [
      "Art. 52, X da Constituição",
      "Suspensão da execução da lei pelo Senado",
      "Objetivação do controle difuso",
    ]],
    ["Repercussão Geral", [
      "Conceito",
      "Requisitos",
      "Admissibilidade do RE",
      "Julgamento pelo STF",
    ]],
    ["Súmula Vinculante", [
      "Conceito",
      "Requisitos",
      "Aprovação",
      "Revisão",
      "Cancelamento",
    ]],
  ]],
  ["Teorias e Modulação dos Efeitos da Inconstitucionalidade", [
    ["Teoria da Nulidade", [
      "Nulidade da norma inconstitucional",
      "Efeito retroativo",
      "Origem da teoria",
    ]],
    ["Teoria da Anulabilidade", [
      "Influência austríaca",
      "Efeitos prospectivos",
      "Limitação dos efeitos",
    ]],
    ["Modulação dos Efeitos", [
      "Segurança jurídica",
      "Excepcional interesse social",
      "Art. 27 da Lei 9.868/99",
      "Efeito ex nunc",
      "Efeito pro futuro",
    ]],
    ["Eficácia das Decisões", [
      "Efeito vinculante",
      "Efeito erga omnes",
      "Efeito repristinatório",
      "Efeito transcendente",
    ]],
  ]],
  ["Introdução ao Controle Concentrado", [
    ["Processo Objetivo", [
      "Processo constitucional objetivo",
      "Ausência de partes",
      "Defesa da Constituição",
      "Interesse público constitucional",
    ]],
    ["Legitimados do Art. 103 da Constituição", [
      "Presidente da República",
      "Mesa do Senado",
      "Mesa da Câmara",
      "Mesa de Assembleia Legislativa",
      "Governador",
      "Procurador-Geral da República",
      "Conselho Federal da OAB",
      "Partido político com representação no Congresso",
      "Confederação sindical",
      "Entidade de classe de âmbito nacional",
    ]],
  ]],
];

// ─────────────────────────────────────────────────────────────
// Direito dos Contratos (Direito Civil III)
// ─────────────────────────────────────────────────────────────
const contratos: ModuleData[] = [
  ["Introdução ao Direito Contratual", [
    ["Conceito de Contrato", [
      "Conceito de contrato",
      "Negócio jurídico bilateral",
      "Acordo de vontades",
      "Natureza jurídica dos contratos",
      "Função econômica do contrato",
      "Função social do contrato",
    ]],
    ["Evolução Histórica do Direito Contratual", [
      "Contrato no Estado Liberal",
      "Autonomia da vontade",
      "Pacta sunt servanda",
      "Estado Social",
      "Dirigismo contratual",
      "Constitucionalização do Direito Civil",
      "Contratos contemporâneos",
    ]],
    ["Fontes do Direito Contratual", [
      "Constituição Federal",
      "Código Civil",
      "Legislação especial",
      "Costumes",
      "Jurisprudência",
      "Boa-fé objetiva",
    ]],
  ]],
  ["Princípios Contratuais", [
    ["Princípios Clássicos", [
      "Autonomia da vontade",
      "Liberdade contratual",
      "Força obrigatória dos contratos",
      "Relatividade dos efeitos contratuais",
    ]],
    ["Princípios Modernos", [
      "Boa-fé objetiva",
      "Função social do contrato",
      "Equilíbrio contratual",
      "Cooperação contratual",
      "Conservação dos contratos",
    ]],
    ["Boa-fé Objetiva", [
      "Conceito",
      "Deveres anexos",
      "Dever de lealdade",
      "Dever de informação",
      "Dever de cooperação",
      "Venire contra factum proprium",
      "Supressio",
      "Surrectio",
      "Tu quoque",
    ]],
    ["Função Social do Contrato", [
      "Interesse social",
      "Limites da autonomia privada",
      "Eficácia perante terceiros",
      "Controle judicial dos contratos",
    ]],
  ]],
  ["Requisitos de Validade dos Contratos", [
    ["Requisitos Subjetivos", [
      "Capacidade das partes",
      "Legitimação",
      "Representação",
    ]],
    ["Requisitos Objetivos", [
      "Objeto lícito",
      "Objeto possível",
      "Objeto determinado",
      "Objeto determinável",
    ]],
    ["Requisitos Formais", [
      "Forma livre",
      "Forma especial",
      "Instrumento público",
      "Instrumento particular",
    ]],
    ["Vícios Contratuais", [
      "Erro",
      "Dolo",
      "Coação",
      "Estado de perigo",
      "Lesão",
      "Fraude contra credores",
    ]],
  ]],
  ["Formação dos Contratos", [
    ["Negociações Preliminares", [
      "Tratativas preliminares",
      "Responsabilidade pré-contratual",
      "Ruptura abusiva das negociações",
    ]],
    ["Proposta", [
      "Conceito",
      "Oferta ao público",
      "Obrigatoriedade da proposta",
      "Revogação da proposta",
    ]],
    ["Aceitação", [
      "Conceito",
      "Aceitação expressa",
      "Aceitação tácita",
      "Aceitação fora do prazo",
    ]],
    ["Momento da Formação Contratual", [
      "Contratos entre presentes",
      "Contratos entre ausentes",
      "Teoria da expedição",
      "Teoria da recepção",
    ]],
  ]],
  ["Interpretação dos Contratos", [
    ["Regras de Interpretação", [
      "Intenção das partes",
      "Interpretação objetiva",
      "Boa-fé objetiva",
      "Conservação do negócio jurídico",
    ]],
    ["Contratos de Adesão", [
      "Conceito",
      "Cláusulas ambíguas",
      "Interpretação favorável ao aderente",
    ]],
  ]],
  ["Efeitos dos Contratos", [
    ["Efeitos entre as Partes", [
      "Vinculação contratual",
      "Direitos subjetivos",
      "Obrigações contratuais",
    ]],
    ["Relatividade dos Contratos", [
      "Regra geral",
      "Limites da relatividade",
      "Efeitos perante terceiros",
    ]],
    ["Estipulação em Favor de Terceiro", [
      "Conceito",
      "Direitos do terceiro beneficiário",
      "Revogação",
    ]],
    ["Promessa de Fato de Terceiro", [
      "Conceito",
      "Responsabilidade do promitente",
    ]],
  ]],
  ["Garantias Contratuais", [
    ["Evicção", [
      "Conceito",
      "Requisitos",
      "Evicção total",
      "Evicção parcial",
      "Direitos do adquirente",
      "Exclusão da garantia",
    ]],
    ["Vícios Redibitórios", [
      "Conceito",
      "Defeito oculto",
      "Requisitos",
      "Ação redibitória",
      "Ação estimatória (quanti minoris)",
      "Prazos decadenciais",
    ]],
    ["Distinção entre Evicção e Vício Redibitório", [
      "Defeito jurídico",
      "Defeito material",
      "Consequências jurídicas",
    ]],
  ]],
  ["Extinção dos Contratos", [
    ["Extinção Normal", [
      "Cumprimento da obrigação",
      "Pagamento",
      "Adimplemento",
    ]],
    ["Extinção Anormal", [
      "Resolução",
      "Resilição",
      "Rescisão",
    ]],
    ["Resolução Contratual", [
      "Inadimplemento absoluto",
      "Inadimplemento relativo",
      "Cláusula resolutiva",
    ]],
    ["Resilição", [
      "Resilição unilateral",
      "Resilição bilateral",
      "Distrato",
    ]],
    ["Exceção do Contrato Não Cumprido", [
      "Conceito",
      "Requisitos",
      "Aplicação prática",
    ]],
  ]],
  ["Contrato de Compra e Venda", [
    ["Aspectos Gerais", [
      "Conceito",
      "Natureza jurídica",
      "Elementos essenciais",
    ]],
    ["Obrigações das Partes", [
      "Entrega da coisa",
      "Pagamento do preço",
      "Transferência da propriedade",
    ]],
    ["Cláusulas Especiais", [
      "Retrovenda",
      "Venda a contento",
      "Venda sujeita a prova",
      "Preempção",
      "Reserva de domínio",
    ]],
    ["Riscos da Coisa", [
      "Perecimento da coisa",
      "Tradição",
      "Transferência dos riscos",
    ]],
  ]],
  ["Contrato de Doação", [
    ["Teoria Geral da Doação", [
      "Conceito",
      "Natureza jurídica",
      "Aceitação",
    ]],
    ["Espécies de Doação", [
      "Doação pura",
      "Doação modal",
      "Doação remuneratória",
      "Doação com encargo",
    ]],
    ["Revogação da Doação", [
      "Ingratidão",
      "Inexecução do encargo",
      "Hipóteses legais",
    ]],
  ]],
  ["Contrato de Empréstimo", [
    ["Comodato", [
      "Conceito",
      "Gratuidade",
      "Obrigações do comodatário",
      "Extinção",
    ]],
    ["Mútuo", [
      "Conceito",
      "Transferência da propriedade",
      "Juros",
      "Restituição",
    ]],
    ["Diferenças entre Comodato e Mútuo", [
      "Bem infungível",
      "Bem fungível",
      "Gratuidade",
      "Onerosidade",
    ]],
  ]],
  ["Contrato de Locação", [
    ["Teoria Geral da Locação", [
      "Conceito",
      "Natureza jurídica",
      "Partes do contrato",
    ]],
    ["Direitos e Deveres do Locador", [
      "Entrega do imóvel",
      "Garantia do uso pacífico",
      "Conservação do bem",
    ]],
    ["Direitos e Deveres do Locatário", [
      "Pagamento do aluguel",
      "Conservação do imóvel",
      "Restituição do imóvel",
    ]],
    ["Garantias Locatícias", [
      "Caução",
      "Fiança",
      "Seguro-fiança",
      "Cessão fiduciária de quotas de fundo de investimento",
    ]],
  ]],
  ["Locações Urbanas (Lei nº 8.245/1991)", [
    ["Regime Especial das Locações", [
      "Lei do Inquilinato",
      "Locação residencial",
      "Locação não residencial",
      "Locação por temporada",
    ]],
    ["Direito de Preferência", [
      "Conceito",
      "Exercício da preferência",
      "Consequências da violação",
    ]],
    ["Ações Locatícias", [
      "Ação de despejo",
      "Ação renovatória",
      "Ação revisional de aluguel",
    ]],
  ]],
];

// ─────────────────────────────────────────────────────────────
// Sistema Recursal do Processo Civil (Processo Civil III)
// ─────────────────────────────────────────────────────────────
const recursos: ModuleData[] = [
  ["Teoria Geral dos Recursos", [
    ["Conceito de Recurso", [
      "Conceito de recurso",
      "Natureza jurídica dos recursos",
      "Finalidade dos recursos",
      "Reexame das decisões judiciais",
      "Reforma da decisão",
      "Invalidação da decisão",
      "Integração da decisão",
      "Esclarecimento da decisão",
    ]],
    ["Fundamentos dos Recursos", [
      "Inconformismo da parte",
      "Controle das decisões judiciais",
      "Segurança jurídica",
      "Justiça da decisão",
      "Duplo grau de jurisdição",
    ]],
  ]],
  ["Princípios Recursais", [
    ["Princípio do Duplo Grau de Jurisdição", [
      "Conceito",
      "Fundamento constitucional",
      "Limitações",
      "Exceções",
    ]],
    ["Princípio da Taxatividade", [
      "Conceito",
      "Recursos previstos em lei",
      "Vedação à criação de recursos pelas partes",
    ]],
    ["Princípio da Singularidade", [
      "Unirrecorribilidade",
      "Recurso adequado",
      "Fungibilidade recursal",
    ]],
    ["Princípio da Fungibilidade", [
      "Conceito",
      "Requisitos",
      "Erro escusável",
      "Ausência de má-fé",
    ]],
    ["Princípio da Dialeticidade", [
      "Fundamentação recursal",
      "Impugnação específica",
      "Razões recursais",
    ]],
    ["Princípio da Proibição da Reformatio in Pejus", [
      "Conceito",
      "Limites",
      "Aplicação prática",
    ]],
  ]],
  ["Pressupostos e Requisitos Recursais", [
    ["Requisitos Intrínsecos", [
      "Cabimento",
      "Legitimidade recursal",
      "Interesse recursal",
      "Inexistência de fato impeditivo",
    ]],
    ["Cabimento", [
      "Adequação do recurso",
      "Correspondência entre decisão e recurso",
    ]],
    ["Legitimidade", [
      "Parte vencida",
      "Terceiro prejudicado",
      "Ministério Público",
    ]],
    ["Interesse Recursal", [
      "Necessidade",
      "Utilidade",
      "Sucumbência",
    ]],
    ["Requisitos Extrínsecos", [
      "Tempestividade",
      "Regularidade formal",
      "Preparo",
      "Representação processual",
    ]],
    ["Tempestividade", [
      "Prazo recursal",
      "Contagem dos prazos",
      "Prazo em dobro",
      "Interrupção do prazo",
    ]],
    ["Preparo", [
      "Custas recursais",
      "Porte de remessa",
      "Deserção",
      "Complementação do preparo",
    ]],
  ]],
  ["Juízo de Admissibilidade e Juízo de Mérito", [
    ["Juízo de Admissibilidade", [
      "Conceito",
      "Órgão competente",
      "Análise dos pressupostos",
      "Não conhecimento",
    ]],
    ["Juízo de Mérito", [
      "Conhecimento do recurso",
      "Reforma",
      "Anulação",
      "Integração da decisão",
    ]],
  ]],
  ["Efeitos dos Recursos", [
    ["Efeito Devolutivo", [
      "Conceito",
      "Extensão da devolução",
      "Profundidade da devolução",
      "Efeito translativo",
    ]],
    ["Efeito Suspensivo", [
      "Conceito",
      "Regra geral",
      "Hipóteses legais",
      "Concessão judicial",
    ]],
    ["Outros Efeitos Recursais", [
      "Efeito substitutivo",
      "Efeito expansivo",
      "Efeito regressivo",
      "Efeito obstativo",
    ]],
  ]],
  ["Recurso Principal e Recurso Adesivo", [
    ["Recurso Principal", [
      "Conceito",
      "Requisitos",
      "Independência",
    ]],
    ["Recurso Adesivo", [
      "Conceito",
      "Cabimento",
      "Dependência do recurso principal",
      "Desistência do recurso principal",
    ]],
  ]],
  ["Apelação", [
    ["Aspectos Gerais", [
      "Conceito",
      "Cabimento",
      "Prazo",
      "Procedimento",
    ]],
    ["Efeitos da Apelação", [
      "Efeito devolutivo",
      "Efeito suspensivo",
      "Hipóteses de execução imediata",
    ]],
    ["Julgamento da Apelação", [
      "Teoria da causa madura",
      "Ampliação do julgamento",
      "Produção de efeitos",
    ]],
  ]],
  ["Agravos", [
    ["Agravo de Instrumento", [
      "Conceito",
      "Hipóteses de cabimento",
      "Taxatividade mitigada",
      "Formação do instrumento",
      "Prazo",
      "Efeitos",
    ]],
    ["Taxatividade Mitigada", [
      "Tema 988 do STJ",
      "Urgência",
      "Inutilidade do julgamento futuro",
    ]],
    ["Agravo Interno", [
      "Conceito",
      "Cabimento",
      "Decisão monocrática",
      "Julgamento colegiado",
    ]],
  ]],
  ["Embargos", [
    ["Embargos de Declaração", [
      "Conceito",
      "Omissão",
      "Contradição",
      "Obscuridade",
      "Erro material",
    ]],
    ["Efeitos dos Embargos", [
      "Interrupção do prazo recursal",
      "Efeitos infringentes",
      "Prequestionamento",
    ]],
  ]],
  ["Recursos nos Juizados Especiais", [
    ["Sistema Recursal dos Juizados", [
      "Recurso inominado",
      "Embargos de declaração",
      "Pedido de uniformização",
      "Turma recursal",
    ]],
    ["Particularidades dos Juizados", [
      "Simplicidade",
      "Oralidade",
      "Celeridade",
      "Informalidade",
    ]],
  ]],
  ["Remessa Necessária", [
    ["Reexame Necessário", [
      "Conceito",
      "Natureza jurídica",
      "Hipóteses de cabimento",
      "Dispensa legal",
    ]],
    ["Fazenda Pública", [
      "Sentença contra a Fazenda",
      "Limites de valor",
      "Jurisprudência aplicável",
    ]],
  ]],
  ["Tutela Recursal", [
    ["Antecipação de Tutela Recursal", [
      "Conceito",
      "Requisitos",
      "Probabilidade do direito",
      "Perigo de dano",
    ]],
    ["Tutela Provisória nos Tribunais", [
      "Competência",
      "Efeito suspensivo ativo",
      "Tutela de urgência recursal",
    ]],
  ]],
  ["Processo nos Tribunais", [
    ["Julgamento Colegiado", [
      "Colegialidade",
      "Relator",
      "Revisor",
      "Sustentação oral",
    ]],
    ["Incidentes nos Tribunais", [
      "Incidente de assunção de competência",
      "Incidente de resolução de demandas repetitivas",
      "Uniformização da jurisprudência",
    ]],
  ]],
  ["Recurso Ordinário Constitucional", [
    ["Recurso Ordinário", [
      "Conceito",
      "Hipóteses constitucionais",
      "Competência do STF",
      "Competência do STJ",
    ]],
    ["Cabimento", [
      "Habeas corpus",
      "Mandado de segurança",
      "Habeas data",
      "Mandado de injunção",
    ]],
  ]],
  ["Recurso Especial", [
    ["Aspectos Gerais", [
      "Conceito",
      "Finalidade",
      "Competência do STJ",
    ]],
    ["Hipóteses de Cabimento", [
      "Violação de lei federal",
      "Divergência jurisprudencial",
      "Interpretação da legislação federal",
    ]],
    ["Requisitos Específicos", [
      "Prequestionamento",
      "Esgotamento das instâncias",
      "Súmulas impeditivas",
    ]],
    ["Recursos Repetitivos", [
      "Conceito",
      "Procedimento",
      "Efeitos vinculantes",
    ]],
  ]],
  ["Recurso Extraordinário", [
    ["Aspectos Gerais", [
      "Conceito",
      "Finalidade",
      "Competência do STF",
    ]],
    ["Hipóteses de Cabimento", [
      "Violação da Constituição",
      "Controle difuso",
      "Questão constitucional",
    ]],
    ["Repercussão Geral", [
      "Conceito",
      "Requisitos",
      "Reconhecimento",
      "Efeitos",
    ]],
    ["Julgamento dos Recursos Repetitivos Constitucionais", [
      "Temas de repercussão geral",
      "Vinculação",
      "Aplicação pelos tribunais",
    ]],
  ]],
  ["Uniformização da Jurisprudência", [
    ["Precedentes Judiciais", [
      "Sistema de precedentes",
      "Ratio decidendi",
      "Obiter dictum",
      "Vinculação",
    ]],
    ["Incidente de Assunção de Competência (IAC)", [
      "Conceito",
      "Cabimento",
      "Procedimento",
    ]],
    ["Incidente de Resolução de Demandas Repetitivas (IRDR)", [
      "Conceito",
      "Requisitos",
      "Procedimento",
      "Efeitos",
    ]],
  ]],
  ["Incidente de Inconstitucionalidade", [
    ["Controle Difuso nos Tribunais", [
      "Reserva de plenário",
      "Art. 97 da Constituição",
      "Arguição incidental",
      "Procedimento",
    ]],
    ["Súmula Vinculante nº 10", [
      "Conceito",
      "Aplicação",
      "Consequências",
    ]],
  ]],
  ["Ação Rescisória", [
    ["Aspectos Gerais", [
      "Conceito",
      "Natureza jurídica",
      "Prazo decadencial",
    ]],
    ["Hipóteses de Cabimento", [
      "Violação manifesta de norma jurídica",
      "Prova falsa",
      "Corrupção do julgador",
      "Documento novo",
      "Erro de fato",
    ]],
    ["Procedimento", [
      "Petição inicial",
      "Juízo rescindente",
      "Juízo rescisório",
    ]],
  ]],
  ["Ação Anulatória", [
    ["Invalidade dos Atos Processuais", [
      "Conceito",
      "Cabimento",
      "Diferenças para a ação rescisória",
    ]],
    ["Sentença Homologatória", [
      "Anulação de acordo",
      "Anulação de negócio jurídico processual",
    ]],
  ]],
  ["Querela Nullitatis", [
    ["Nulidade Absoluta da Sentença", [
      "Conceito",
      "Origem histórica",
      "Cabimento excepcional",
    ]],
    ["Hipóteses Clássicas", [
      "Ausência de citação",
      "Inexistência jurídica da sentença",
      "Nulidade insanável",
    ]],
  ]],
];

// ─────────────────────────────────────────────────────────────
// Teoria da Pena (Direito Penal II)
// ─────────────────────────────────────────────────────────────
const penal2: ModuleData[] = [
  ["Introdução à Teoria da Pena", [
    ["Evolução Histórica da Pena", [
      "Vingança privada",
      "Vingança divina",
      "Vingança pública",
      "Direito Penal liberal",
      "Humanização das penas",
      "Escola Clássica",
      "Escola Positiva",
      "Evolução do sistema punitivo",
    ]],
    ["Finalidades da Pena", [
      "Retribuição",
      "Prevenção geral",
      "Prevenção especial",
      "Prevenção positiva",
      "Prevenção negativa",
      "Ressocialização",
      "Defesa social",
    ]],
    ["Teorias da Pena", [
      "Teoria absoluta",
      "Teoria retributiva",
      "Teoria relativa",
      "Teoria preventiva",
      "Teoria mista",
      "Teoria unificadora",
    ]],
  ]],
  ["Princípios Constitucionais da Pena", [
    ["Legalidade e Anterioridade", [
      "Princípio da legalidade",
      "Reserva legal",
      "Anterioridade penal",
      "Irretroatividade da lei penal",
      "Retroatividade benéfica",
    ]],
    ["Individualização da Pena", [
      "Individualização legislativa",
      "Individualização judicial",
      "Individualização executória",
      "Art. 5º, XLVI da Constituição",
    ]],
    ["Humanidade das Penas", [
      "Dignidade da pessoa humana",
      "Vedação à tortura",
      "Vedação a penas degradantes",
      "Direitos do preso",
    ]],
    ["Proporcionalidade da Pena", [
      "Adequação",
      "Necessidade",
      "Proporcionalidade em sentido estrito",
      "Limites ao poder punitivo",
    ]],
    ["Vedação às Penas Cruéis", [
      "Pena de morte",
      "Pena de caráter perpétuo",
      "Trabalhos forçados",
      "Banimento",
      "Penas cruéis",
    ]],
    ["Penas Admitidas pela Constituição", [
      "Pena privativa de liberdade",
      "Pena restritiva de direitos",
      "Pena de multa",
    ]],
  ]],
  ["Pena e Política Criminal", [
    ["Política Criminal", [
      "Conceito",
      "Finalidades",
      "Controle social",
      "Poder punitivo estatal",
    ]],
    ["Seletividade Penal", [
      "Criminalização primária",
      "Criminalização secundária",
      "Seletividade do sistema penal",
      "Etiquetamento social",
    ]],
    ["Criminologia Crítica", [
      "Controle social",
      "Labeling approach",
      "Direito Penal simbólico",
      "Críticas ao encarceramento",
    ]],
    ["Função Simbólica da Pena", [
      "Direito Penal simbólico",
      "Expansão do Direito Penal",
      "Populismo penal",
    ]],
  ]],
  ["Justiça Restaurativa e Novas Tendências", [
    ["Justiça Restaurativa", [
      "Conceito",
      "Finalidades",
      "Reparação do dano",
      "Participação da vítima",
      "Mediação penal",
    ]],
    ["Práticas Restaurativas", [
      "Círculos restaurativos",
      "Conferências restaurativas",
      "Acordos restaurativos",
    ]],
    ["Tendências Contemporâneas", [
      "Abolicionismo penal",
      "Minimalismo penal",
      "Garantismo penal",
      "Direito Penal mínimo",
    ]],
  ]],
  ["Espécies de Pena", [
    ["Pena Privativa de Liberdade", [
      "Conceito",
      "Reclusão",
      "Detenção",
      "Prisão simples",
    ]],
    ["Regimes de Cumprimento", [
      "Regime fechado",
      "Regime semiaberto",
      "Regime aberto",
      "Progressão de regime",
      "Regressão de regime",
    ]],
    ["Fixação do Regime Inicial", [
      "Quantidade da pena",
      "Reincidência",
      "Circunstâncias judiciais",
    ]],
  ]],
  ["Dosimetria da Pena", [
    ["Sistema Trifásico", [
      "Art. 68 do Código Penal",
      "Primeira fase",
      "Segunda fase",
      "Terceira fase",
    ]],
    ["Critério Trifásico de Nelson Hungria", [
      "Conceito",
      "Aplicação prática",
      "Estrutura do cálculo",
    ]],
  ]],
  ["Primeira Fase da Dosimetria", [
    ["Pena-Base", [
      "Conceito",
      "Limites abstratos da pena",
      "Fundamentação judicial",
    ]],
    ["Circunstâncias Judiciais (Art. 59 do CP)", [
      "Culpabilidade",
      "Antecedentes",
      "Conduta social",
      "Personalidade do agente",
      "Motivos do crime",
      "Circunstâncias do crime",
      "Consequências do crime",
      "Comportamento da vítima",
    ]],
    ["Fixação da Pena-Base", [
      "Critérios de valoração",
      "Fundamentação idônea",
      "Súmulas aplicáveis",
      "Jurisprudência do STF e STJ",
    ]],
  ]],
  ["Segunda Fase da Dosimetria", [
    ["Circunstâncias Agravantes", [
      "Reincidência",
      "Motivo fútil",
      "Motivo torpe",
      "Abuso de autoridade",
      "Violência contra vulnerável",
    ]],
    ["Circunstâncias Atenuantes", [
      "Menoridade relativa",
      "Confissão espontânea",
      "Reparação do dano",
      "Influência de multidão",
    ]],
    ["Concurso de Agravantes e Atenuantes", [
      "Compensação",
      "Preponderância",
      "Reincidência",
      "Confissão espontânea",
    ]],
  ]],
  ["Terceira Fase da Dosimetria", [
    ["Causas de Aumento de Pena", [
      "Majorantes",
      "Frações de aumento",
      "Critérios de aplicação",
    ]],
    ["Causas de Diminuição de Pena", [
      "Minorantes",
      "Frações de redução",
      "Aplicação concreta",
    ]],
    ["Pena Definitiva", [
      "Resultado final",
      "Individualização judicial",
    ]],
  ]],
  ["Concurso de Crimes", [
    ["Concurso Material", [
      "Conceito",
      "Sistema do cúmulo material",
      "Somatório das penas",
    ]],
    ["Concurso Formal", [
      "Conceito",
      "Concurso formal próprio",
      "Concurso formal impróprio",
      "Sistema da exasperação",
    ]],
    ["Crime Continuado", [
      "Conceito",
      "Requisitos",
      "Ficção jurídica",
      "Aumento de pena",
    ]],
    ["Diferenças entre os Concursos", [
      "Unidade de conduta",
      "Pluralidade de resultados",
      "Continuidade delitiva",
    ]],
  ]],
  ["Penas Restritivas de Direitos", [
    ["Conceito e Finalidade", [
      "Natureza jurídica",
      "Alternativas ao cárcere",
      "Política de desencarceramento",
    ]],
    ["Espécies", [
      "Prestação pecuniária",
      "Perda de bens e valores",
      "Prestação de serviços à comunidade",
      "Interdição temporária de direitos",
      "Limitação de fim de semana",
    ]],
    ["Substituição da Pena", [
      "Requisitos objetivos",
      "Requisitos subjetivos",
      "Limites legais",
    ]],
  ]],
  ["Suspensão Condicional da Pena", [
    ["Sursis", [
      "Conceito",
      "Natureza jurídica",
      "Finalidade",
    ]],
    ["Requisitos", [
      "Pena aplicada",
      "Ausência de reincidência",
      "Circunstâncias judiciais favoráveis",
    ]],
    ["Espécies de Sursis", [
      "Sursis simples",
      "Sursis especial",
      "Sursis etário",
      "Sursis humanitário",
    ]],
  ]],
  ["Medidas de Segurança", [
    ["Conceito", [
      "Natureza jurídica",
      "Finalidade preventiva",
      "Inimputabilidade",
    ]],
    ["Espécies", [
      "Internação",
      "Tratamento ambulatorial",
    ]],
    ["Aplicação", [
      "Periculosidade",
      "Exame pericial",
      "Prazo mínimo",
    ]],
  ]],
  ["Efeitos da Condenação", [
    ["Efeitos Penais", [
      "Reincidência",
      "Maus antecedentes",
      "Interrupção da prescrição",
    ]],
    ["Efeitos Extrapenais", [
      "Perda de cargo público",
      "Incapacidade para o poder familiar",
      "Indenização mínima à vítima",
    ]],
  ]],
  ["Reabilitação", [
    ["Reabilitação Criminal", [
      "Conceito",
      "Requisitos",
      "Prazo",
      "Efeitos",
    ]],
  ]],
  ["Execução Penal", [
    ["Fundamentos da Execução Penal", [
      "Conceito",
      "Finalidade",
      "Lei de Execução Penal",
      "Jurisdição da execução",
    ]],
    ["Princípios da Execução Penal", [
      "Legalidade",
      "Humanidade",
      "Individualização",
      "Ressocialização",
    ]],
    ["Sistemas Penitenciários", [
      "Sistema pensilvânico",
      "Sistema auburniano",
      "Sistema progressivo",
    ]],
  ]],
  ["Ação Penal", [
    ["Conceito e Características", [
      "Conceito",
      "Direito de ação",
      "Pretensão punitiva",
    ]],
    ["Princípios da Ação Penal Pública", [
      "Obrigatoriedade",
      "Indisponibilidade",
      "Oficialidade",
      "Intranscendência",
    ]],
    ["Espécies de Ação Penal", [
      "Ação penal pública incondicionada",
      "Ação penal pública condicionada",
      "Ação penal privada",
      "Ação penal privada subsidiária da pública",
    ]],
  ]],
  ["Punibilidade", [
    ["Conceito de Punibilidade", [
      "Jus puniendi",
      "Pretensão punitiva",
      "Pretensão executória",
    ]],
    ["Causas Extintivas da Punibilidade", [
      "Morte do agente",
      "Anistia",
      "Graça",
      "Indulto",
      "Abolitio criminis",
      "Prescrição",
      "Decadência",
      "Perempção",
      "Renúncia",
      "Perdão aceito",
    ]],
  ]],
  ["Prescrição", [
    ["Teoria Geral da Prescrição", [
      "Conceito",
      "Fundamentos",
      "Natureza jurídica",
    ]],
    ["Prescrição da Pretensão Punitiva", [
      "Em abstrato",
      "Retroativa",
      "Intercorrente",
      "Superveniente",
    ]],
    ["Prescrição da Pretensão Executória", [
      "Conceito",
      "Termo inicial",
      "Prazo prescricional",
    ]],
    ["Interrupção da Prescrição", [
      "Recebimento da denúncia",
      "Pronúncia",
      "Sentença condenatória",
      "Início do cumprimento da pena",
    ]],
    ["Suspensão da Prescrição", [
      "Hipóteses legais",
      "Consequências jurídicas",
    ]],
  ]],
];

export const SEMESTRE_4: DisciplineCurriculum[] = [
  buildDiscipline("administrativo-1", adm1),
  buildDiscipline("internacional", dip),
  buildDiscipline("constitucional-3", jurisdConst),
  buildDiscipline("civil-3", contratos),
  buildDiscipline("processo-civil-3", recursos),
  buildDiscipline("penal-2", penal2),
];
