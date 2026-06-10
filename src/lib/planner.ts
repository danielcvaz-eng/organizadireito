import type { AppState, Task, MicroThemeStatus, MicroThemeRef, BlocoTipo } from "./types";
import { getAllMicrothemes } from "@/data/legalCurriculum";
import { uid } from "./store-internal";

// Blocos (minutos)
const DUR_NOVO = 60;
const DUR_REVISAO_ATIVA = 50;
const DUR_REVISAO_ESPACADA = 25;
const HORAS_POR_DIA = (DUR_NOVO + DUR_REVISAO_ATIVA + DUR_REVISAO_ESPACADA) / 60; // ~2.25h

const PESO_STATUS: Record<MicroThemeStatus, number> = {
  nao_iniciado: 4,
  superficial: 2,
  revisar: 1,
  dominado: 0,
};

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

interface Candidate {
  subjectId: string;
  subjectNome: string;
  microthemeId: string;
  microthemeNome: string;
  themeNome: string;
  moduleNome: string;
  status: MicroThemeStatus;
  peso: number;
}

function buildCandidates(state: AppState): Candidate[] {
  const today = startOfToday();
  const horizonteAvaliacao = addDays(today, 14);
  const out: Candidate[] = [];
  for (const subject of state.subjects) {
    if (!subject.subjectOnboardingCompleto) continue;
    const micros = getAllMicrothemes(subject.catalogId);
    if (micros.length === 0) continue;
    const temAvaliacaoProxima = state.assessments.some(
      (a) =>
        a.subjectId === subject.id &&
        new Date(a.data) >= today &&
        new Date(a.data) <= horizonteAvaliacao,
    );
    const bonusAvaliacao = temAvaliacaoProxima ? 2 : 0;
    const bonusDificuldade = subject.dificuldade === "dificil" ? 1 : 0;
    for (const m of micros) {
      const prog = state.microthemeProgress.find(
        (p) => p.subjectId === subject.id && p.microthemeId === m.microthemeId,
      );
      const status = prog?.status ?? "nao_iniciado";
      out.push({
        subjectId: subject.id,
        subjectNome: subject.nome,
        microthemeId: m.microthemeId,
        microthemeNome: m.microthemeNome,
        themeNome: m.themeNome,
        moduleNome: m.moduleNome,
        status,
        peso: PESO_STATUS[status] + bonusAvaliacao + bonusDificuldade,
      });
    }
  }
  return out;
}

/** Pega o próximo candidato evitando repetir a mesma disciplina (se possível). */
function takeNext(pool: Candidate[], avoidSubjectId?: string): Candidate | undefined {
  if (pool.length === 0) return undefined;
  const idx = avoidSubjectId
    ? pool.findIndex((c) => c.subjectId !== avoidSubjectId)
    : 0;
  const pickIdx = idx === -1 ? 0 : idx;
  return pool.splice(pickIdx, 1)[0];
}

function makeTask(
  c: Candidate,
  dayDate: Date,
  bloco: BlocoTipo,
  duracao: number,
  ordemNoDia: number,
): Task {
  const data = new Date(dayDate);
  data.setHours(9, 0, 0, 0);
  const titulo =
    bloco === "novo"
      ? c.microthemeNome
      : bloco === "revisao_ativa"
        ? `Revisão ativa: ${c.microthemeNome}`
        : `Revisão espaçada: ${c.microthemeNome}`;
  return {
    id: uid(),
    subjectId: c.subjectId,
    tipo: "estudo",
    titulo,
    descricao: `${c.subjectNome} · ${c.moduleNome} → ${c.themeNome}`,
    prazo: data.toISOString(),
    prioridade: c.peso >= 5 ? "alta" : c.peso >= 3 ? "media" : "baixa",
    status: "pendente",
    estimativaHoras: duracao / 60,
    createdAt: new Date().toISOString(),
    origem: "ciclo",
    microthemeRef: { subjectId: c.subjectId, microthemeId: c.microthemeId },
    bloco,
    duracaoMinutos: duracao,
    ordemNoDia,
    moduloNome: c.moduleNome,
    temaNome: c.themeNome,
  };
}

export function generateWeeklyCycle(state: AppState): Task[] {
  const user = state.user;
  if (!user) return [];

  const candidatos = buildCandidates(state);
  if (candidatos.length === 0) return [];

  // Pools por bloco
  const novos = candidatos
    .filter((c) => c.status === "nao_iniciado")
    .sort((a, b) => b.peso - a.peso);
  const ativos = candidatos
    .filter((c) => c.status === "superficial" || c.status === "revisar")
    .sort((a, b) => b.peso - a.peso);
  const espacadas = candidatos
    .filter((c) => c.status !== "nao_iniciado") // tudo que já foi visto pode ter revisão espaçada
    .sort((a, b) => b.peso - a.peso);

  // Fallback: se faltarem em uma categoria, completa com qualquer candidato.
  const fallback = () => candidatos.slice().sort((a, b) => b.peso - a.peso);

  // Número de dias de estudo na semana
  const dias = Math.max(1, Math.min(7, Math.round(user.horasSemana / HORAS_POR_DIA)));

  const tasks: Task[] = [];
  const today = startOfToday();

  // Pools de trabalho (cópias mutáveis)
  const pNovos = [...novos];
  const pAtivos = [...ativos];
  const pEspacadas = [...espacadas];

  let lastSubject: string | undefined;

  for (let i = 0; i < dias; i++) {
    const dayDate = addDays(today, i);
    let ordem = 1;

    const b1 = takeNext(pNovos, lastSubject) ?? takeNext(pAtivos, lastSubject) ?? takeNext(fallback());
    if (b1) {
      tasks.push(makeTask(b1, dayDate, "novo", DUR_NOVO, ordem++));
      lastSubject = b1.subjectId;
    }

    const b2 = takeNext(pAtivos, lastSubject) ?? takeNext(pNovos, lastSubject) ?? takeNext(fallback());
    if (b2) {
      tasks.push(makeTask(b2, dayDate, "revisao_ativa", DUR_REVISAO_ATIVA, ordem++));
      lastSubject = b2.subjectId;
    }

    const b3 = takeNext(pEspacadas, lastSubject) ?? takeNext(pAtivos, lastSubject) ?? takeNext(fallback());
    if (b3) {
      tasks.push(makeTask(b3, dayDate, "revisao_espacada", DUR_REVISAO_ESPACADA, ordem++));
      lastSubject = b3.subjectId;
    }
  }

  return tasks;
}

export function generateRevisions(
  ref: MicroThemeRef,
  baseDateISO: string,
  subjectNome: string,
  microthemeNome: string,
): Task[] {
  const base = new Date(baseDateISO);
  const make = (offset: 1 | 7 | 30): Task => {
    const d = addDays(base, offset);
    d.setHours(9, 0, 0, 0);
    return {
      id: uid(),
      subjectId: ref.subjectId,
      tipo: "estudo",
      titulo: `Revisão D+${offset}: ${microthemeNome}`,
      descricao: `${subjectNome} · Revisão espaçada`,
      prazo: d.toISOString(),
      prioridade: offset === 1 ? "alta" : "media",
      status: "pendente",
      estimativaHoras: 0.5,
      createdAt: new Date().toISOString(),
      origem: "revisao",
      microthemeRef: ref,
      intervaloRevisao: offset,
      bloco: "revisao_espacada",
      duracaoMinutos: DUR_REVISAO_ESPACADA,
    };
  };
  return [make(1), make(7), make(30)];
}

export function advanceStatus(current: MicroThemeStatus): MicroThemeStatus {
  if (current === "nao_iniciado") return "superficial";
  if (current === "superficial") return "revisar";
  if (current === "revisar") return "dominado";
  return "dominado";
}

// silence unused
void findMicrotheme;
