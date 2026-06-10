import type { AppState, Task, MicroThemeStatus, MicroThemeRef } from "./types";
import { getAllMicrothemes } from "@/data/legalCurriculum";
import { uid } from "./store-internal";

const SLOT_HORAS = 1;
const MAX_SLOTS_DIA = 3;

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
  microthemeId: string;
  themeNome: string;
  microthemeNome: string;
  peso: number;
}

export function generateWeeklyCycle(state: AppState): Task[] {
  const user = state.user;
  if (!user) return [];

  const today = startOfToday();
  const horizonteAvaliacao = addDays(today, 14);

  // 1) Coletar candidatos com peso
  const candidatos: Candidate[] = [];
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
      const base = PESO_STATUS[status];
      if (base === 0) continue; // dominado entra só em revisão espaçada
      candidatos.push({
        subjectId: subject.id,
        microthemeId: m.microthemeId,
        themeNome: m.themeNome,
        microthemeNome: m.microthemeNome,
        peso: base + bonusAvaliacao + bonusDificuldade,
      });
    }
  }

  if (candidatos.length === 0) return [];

  // 2) Ordenar por peso desc
  candidatos.sort((a, b) => b.peso - a.peso);

  // 3) Distribuir em slots (horasSemana // SLOT_HORAS), max 3/dia, evitando 2 seguidos da mesma disciplina
  const totalSlots = Math.max(1, Math.min(21, Math.floor(user.horasSemana / SLOT_HORAS)));
  const slotsPorDia: Record<number, Candidate[]> = {};
  for (let i = 0; i < 7; i++) slotsPorDia[i] = [];

  let placed = 0;
  let idx = 0;
  const pool = [...candidatos];

  while (placed < totalSlots && pool.length > 0) {
    let bestDay = -1;
    for (let d = 0; d < 7; d++) {
      const dayIdx = (idx + d) % 7;
      if (slotsPorDia[dayIdx].length >= MAX_SLOTS_DIA) continue;
      const last = slotsPorDia[dayIdx].at(-1);
      // tenta evitar repetir a disciplina seguido
      if (last && pool[0] && last.subjectId === pool[0].subjectId) continue;
      bestDay = dayIdx;
      break;
    }
    if (bestDay === -1) {
      // fallback: aceita o primeiro slot livre
      for (let d = 0; d < 7; d++) {
        if (slotsPorDia[d].length < MAX_SLOTS_DIA) {
          bestDay = d;
          break;
        }
      }
    }
    if (bestDay === -1) break;
    const cand = pool.shift()!;
    slotsPorDia[bestDay].push(cand);
    placed++;
    idx = (bestDay + 1) % 7;
  }

  // 4) Converter em tarefas
  const tasks: Task[] = [];
  for (let d = 0; d < 7; d++) {
    const data = addDays(today, d);
    data.setHours(9, 0, 0, 0);
    for (const c of slotsPorDia[d]) {
      tasks.push({
        id: uid(),
        subjectId: c.subjectId,
        tipo: "estudo",
        titulo: `Estudar: ${c.microthemeNome}`,
        descricao: c.themeNome,
        prazo: data.toISOString(),
        prioridade: c.peso >= 5 ? "alta" : c.peso >= 3 ? "media" : "baixa",
        status: "pendente",
        estimativaHoras: SLOT_HORAS,
        createdAt: new Date().toISOString(),
        origem: "ciclo",
        microthemeRef: { subjectId: c.subjectId, microthemeId: c.microthemeId },
      });
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
    };
  };
  return [make(1), make(7), make(30)];
}

/** Retorna o próximo status na "escada" de domínio. */
export function advanceStatus(current: MicroThemeStatus): MicroThemeStatus {
  if (current === "nao_iniciado") return "superficial";
  if (current === "superficial") return "revisar";
  if (current === "revisar") return "dominado";
  return "dominado";
}
