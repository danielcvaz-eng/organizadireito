// ============================================================
// BASE CURRICULAR OFICIAL — Organiza Direito
// Hierarquia: Semestre → Disciplina → (Módulo → Tema → Microtema)
// Neste momento, apenas Semestre → Disciplina está cadastrado.
// A estrutura está pronta para receber módulos/temas/microtemas
// no futuro, sem necessidade de refatoração.
// ============================================================

export interface SemesterMicrotheme {
  id: string;
  nome: string;
}
export interface SemesterTheme {
  id: string;
  nome: string;
  microthemes?: SemesterMicrotheme[];
}
export interface SemesterModule {
  id: string;
  nome: string;
  themes?: SemesterTheme[];
}

export interface SemesterDiscipline {
  /** id estável composto: "{semestre}.{slug}" */
  id: string;
  nome: string;
  /** cor sugerida para a disciplina */
  cor: string;
  /** Link opcional para currículo de microtemas legado (legalCurriculum). */
  catalogId?: string;
  /** Futuro: módulos/temas/microtemas. Vazio por enquanto. */
  modules?: SemesterModule[];
}

export interface SemesterEntry {
  semestre: number;
  disciplines: SemesterDiscipline[];
}

// Paleta diversa — tons bem distintos (matiz/saturação variadas)
// para evitar disciplinas com cores parecidas.
const PALETTE = [
  "#2563eb", "#dc2626", "#16a34a", "#f59e0b", "#7c3aed",
  "#0891b2", "#db2777", "#65a30d", "#ea580c", "#0d9488",
  "#9333ea", "#ca8a04", "#0369a1", "#be123c", "#15803d",
  "#a16207", "#7e22ce", "#0e7490",
];

function slug(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function hashIdx(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % PALETTE.length;
}

function d(semestre: number, nome: string, catalogId?: string): SemesterDiscipline {
  const sl = slug(nome);
  return {
    id: `${semestre}.${sl}`,
    nome,
    cor: PALETTE[hashIdx(sl)],
    catalogId,
  };
}

export const SEMESTER_CURRICULUM: SemesterEntry[] = [
  {
    semestre: 1,
    disciplines: [
      d(1, "Ciência Política / Filosofia Política"),
      d(1, "Formação Social do Brasil"),
      d(1, "Metodologia de Pesquisa"),
      d(1, "Linguagem do Direito"),
      d(1, "Teoria do Estado e da Constituição"),
      d(1, "Introdução ao Estudo do Direito"),
    ],
  },
  {
    semestre: 2,
    disciplines: [
      d(2, "Análise Econômica do Direito"),
      d(2, "Direitos Humanos"),
      d(2, "História do Direito"),
      d(2, "Organização do Estado (Constitucional I)", "constitucional"),
      d(2, "Sociologia Jurídica"),
      d(2, "Teoria do Direito Privado (Direito Civil I)", "civil-1"),
      d(2, "Teoria Geral do Processo (Processo Civil I)", "processo-civil"),
    ],
  },
  {
    semestre: 3,
    disciplines: [
      d(3, "Processo de Conhecimento (Processo Civil II)", "processo-civil"),
      d(3, "Direito das Obrigações (Direito Civil II)", "civil-2"),
      d(3, "Direitos e Garantias Fundamentais (Constitucional II)", "constitucional"),
      d(3, "Seminário Interdisciplinar I (Hermenêutica Jurídica)"),
      d(3, "Teoria da Norma e do Crime (Direito Penal I)", "penal-1"),
    ],
  },
  {
    semestre: 4,
    disciplines: [
      d(4, "Direito Administrativo I", "administrativo"),
      d(4, "Direito Internacional Público", "internacional"),
      d(4, "Jurisdição Constitucional (Constitucional III)", "constitucional"),
      d(4, "Direito dos Contratos (Direito Civil III)"),
      d(4, "Métodos de Solução de Conflitos"),
      d(4, "Sistema Recursal do Processo Civil (Processo Civil III)"),
      d(4, "Teoria da Pena (Direito Penal II)", "penal-2"),
    ],
  },
  {
    semestre: 5,
    disciplines: [
      d(5, "Crimes em Espécie (Direito Penal III)"),
      d(5, "Direito Administrativo II", "administrativo"),
      d(5, "Direito do Trabalho I", "trabalho"),
      d(5, "Direito Internacional Privado"),
      d(5, "Execução e Cumprimento de Sentença (Processo Civil IV)"),
      d(5, "Posse e Propriedade (Direito Civil IV)"),
    ],
  },
  {
    semestre: 6,
    disciplines: [
      d(6, "Direito de Família (Direito Civil V)"),
      d(6, "Direito Econômico"),
      d(6, "Direito Processual Penal (Processo Penal I)", "processo-penal"),
      d(6, "Processo Constitucional"),
      d(6, "Prática Jurídica I (Processo Civil)"),
    ],
  },
  {
    semestre: 7,
    disciplines: [
      d(7, "Direito Ambiental"),
      d(7, "Direito do Trabalho II", "trabalho"),
      d(7, "Direito Empresarial I", "empresarial"),
      d(7, "Direito Financeiro"),
      d(7, "Prática Jurídica II (Constitucional ou Penal)"),
    ],
  },
  {
    semestre: 8,
    disciplines: [
      d(8, "Direito do Consumidor"),
      d(8, "Direito Tributário", "tributario"),
      d(8, "Tópicos Especiais I"),
      d(8, "Seminário Interdisciplinar II"),
    ],
  },
  {
    semestre: 9,
    disciplines: [
      d(9, "Direito Empresarial II", "empresarial"),
      d(9, "Direito Tributário II", "tributario"),
      d(9, "Tópicos Especiais II"),
      d(9, "TCC I"),
    ],
  },
  {
    semestre: 10,
    disciplines: [
      d(10, "Direito, Tecnologia e Inovação"),
      d(10, "Seminário Interdisciplinar III"),
      d(10, "TCC II"),
    ],
  },
];

export function getDisciplinesBySemester(semestre: number): SemesterDiscipline[] {
  const list = SEMESTER_CURRICULUM.find((e) => e.semestre === semestre)?.disciplines ?? [];
  // Cores distintas entre as disciplinas do mesmo semestre (por posição).
  return list.map((disc, i) => ({ ...disc, cor: PALETTE[i % PALETTE.length] }));
}

export function findDiscipline(id: string): SemesterDiscipline | undefined {
  for (const e of SEMESTER_CURRICULUM) {
    const f = e.disciplines.find((d) => d.id === id);
    if (f) return f;
  }
  return undefined;
}

/** Cor sugerida para uma disciplina criada manualmente. */
export function suggestColor(nome: string): string {
  return PALETTE[hashIdx(slug(nome))];
}
