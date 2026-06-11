import type { AppState, Task, MicroThemeStatus, MicroThemeRef, BlocoTipo } from "./types";
import { getCurriculum, type FlatMicrotheme } from "@/data/legalCurriculum";
import { uid } from "./store-internal";

// ============================================================
// MOTOR DE PLANEJAMENTO
// Princípios:
//  1. Respeita a CRONOLOGIA da disciplina: nunca pula tema do meio
//     do módulo. Pega o próximo microtema não dominado em ordem.
//  2. Distribuição proporcional: 40% novos, 33% revisão ativa,
//     17% revisão espaçada, 10% reservado para transições/flex.
//  3. Sem dias fixos: blocos pertencem à semana, não a um dia
//     específico. O usuário cumpre na ordem em que conseguir.
// ============================================================

const PCT = { novo: 0.40, ativa: 0.33, espacada: 0.17 } as const;

// Duração-alvo (minutos) de cada bloco — usada para estimar quantos
// blocos cabem no orçamento semanal por categoria.
const ALVO_MIN = { novo: 45, ativa: 30, espacada: 15 } as const;

const PESO_STATUS: Record<MicroThemeStatus, number> = {
  nao_iniciado: 4,
  superficial: 2,
  revisar: 1,
  dominado: 0,
};

function startOfWeekMonday(d: Date = new Date()): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const day = x.getDay();
  const diff = (day + 6) % 7;
  x.setDate(x.getDate() - diff);
  return x;
}
function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

interface Candidate {
  subjectId: string;
  subjectNome: string;
  subjectCor: string;
  microthemeId: string;
  microthemeNome: string;
  themeNome: string;
  moduleNome: string;
  status: MicroThemeStatus;
  /** índice cronológico dentro do currículo (0 = início) */
  ordem: number;
}

interface SubjectInfo {
  id: string;
  nome: string;
  cor: string;
  /** ordenados cronologicamente (módulos → temas → microtemas) */
  micros: FlatMicrotheme[];
  prioridade: number;
}

function getSubjectStatus(
  state: AppState,
  subjectId: string,
  microthemeId: string,
): MicroThemeStatus {
  return (
    state.microthemeProgress.find(
      (p) => p.subjectId === subjectId && p.microthemeId === microthemeId,
    )?.status ?? "nao_iniciado"
  );
}

function buildSubjectInfos(state: AppState): SubjectInfo[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const horizonte = addDays(today, 14);

  const infos: SubjectInfo[] = [];
  for (const subject of state.subjects) {
    if (!subject.subjectOnboardingCompleto) continue;
    const cur = getCurriculum(subject.catalogId);
    if (!cur) continue;

    const micros: FlatMicrotheme[] = [];
    for (const mod of cur.modules) {
      for (const theme of mod.themes) {
        for (const m of theme.microthemes) {
          micros.push({
            microthemeId: m.id,
            microthemeNome: m.nome,
            themeId: theme.id,
            themeNome: theme.nome,
            moduleId: mod.id,
            moduleNome: mod.nome,
          });
        }
      }
    }
    if (micros.length === 0) continue;

    // Prioridade da disciplina:
    //  + avaliação próxima (≤14d): +5
    //  + dificuldade alta: +2
    //  + soma do peso dos microtemas não dominados (capada): +0..3
    const temAvaliacao = state.assessments.some(
      (a) =>
        a.subjectId === subject.id &&
        new Date(a.data) >= today &&
        new Date(a.data) <= horizonte,
    );
    const somaPesos = micros.reduce((acc, m) => {
      const st = getSubjectStatus(state, subject.id, m.microthemeId);
      return acc + PESO_STATUS[st];
    }, 0);
    const prioridade =
      (temAvaliacao ? 5 : 0) +
      (subject.dificuldade === "dificil" ? 2 : 0) +
      Math.min(3, somaPesos / Math.max(1, micros.length));

    infos.push({
      id: subject.id,
      nome: subject.nome,
      cor: subject.cor,
      micros,
      prioridade,
    });
  }

  // Ordena disciplinas por prioridade (desc). Empate → ordem original.
  return infos.sort((a, b) => b.prioridade - a.prioridade);
}

/**
 * Para cada disciplina, mantém um cursor que aponta para o próximo
 * microtema cronológico que ainda se encaixa na categoria desejada.
 * Isso garante que `nunca pulamos` temas anteriores.
 */
function buildSubjectCursors(
  state: AppState,
  infos: SubjectInfo[],
  predicate: (s: MicroThemeStatus) => boolean,
) {
  // Map subjectId -> Candidate[] (cronologicamente ordenados)
  const map = new Map<string, Candidate[]>();
  for (const info of infos) {
    const list: Candidate[] = [];
    info.micros.forEach((m, idx) => {
      const status = getSubjectStatus(state, info.id, m.microthemeId);
      if (predicate(status)) {
        list.push({
          subjectId: info.id,
          subjectNome: info.nome,
          subjectCor: info.cor,
          microthemeId: m.microthemeId,
          microthemeNome: m.microthemeNome,
          themeNome: m.themeNome,
          moduleNome: m.moduleNome,
          status,
          ordem: idx,
        });
      }
    });
    if (list.length) map.set(info.id, list);
  }
  return map;
}

function pickRoundRobin(
  cursors: Map<string, Candidate[]>,
  subjectOrder: string[],
  lastSubjectId: string | undefined,
): Candidate | undefined {
  if (cursors.size === 0) return undefined;
  // Preferir disciplina diferente da última (variedade), mantendo prioridade.
  const ordered = lastSubjectId
    ? [
        ...subjectOrder.filter((s) => s !== lastSubjectId && cursors.has(s)),
        ...(cursors.has(lastSubjectId) ? [lastSubjectId] : []),
      ]
    : subjectOrder.filter((s) => cursors.has(s));

  for (const sid of ordered) {
    const q = cursors.get(sid);
    if (q && q.length) {
      const next = q.shift()!;
      if (q.length === 0) cursors.delete(sid);
      return next;
    }
  }
  return undefined;
}

function makeTask(
  c: Candidate,
  bloco: BlocoTipo,
  duracao: number,
  weekStartISO: string,
  ordemGlobal: number,
): Task {
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
    prazo: weekStartISO,
    prioridade: "media",
    status: "pendente",
    estimativaHoras: duracao / 60,
    createdAt: new Date().toISOString(),
    origem: "ciclo",
    microthemeRef: { subjectId: c.subjectId, microthemeId: c.microthemeId },
    bloco,
    duracaoMinutos: duracao,
    ordemNoDia: ordemGlobal,
    moduloNome: c.moduleNome,
    temaNome: c.themeNome,
  };
}

export function generateWeeklyCycle(state: AppState): Task[] {
  const user = state.user;
  if (!user || user.horasSemana <= 0) return [];

  const infos = buildSubjectInfos(state);
  if (infos.length === 0) return [];

  // Orçamentos em minutos
  const totalMin = Math.round(user.horasSemana * 60);
  const orcamento = {
    novo: Math.round(totalMin * PCT.novo),
    ativa: Math.round(totalMin * PCT.ativa),
    espacada: Math.round(totalMin * PCT.espacada),
  };

  // Número de blocos por categoria a partir do orçamento
  const counts = {
    novo: Math.max(0, Math.round(orcamento.novo / ALVO_MIN.novo)),
    ativa: Math.max(0, Math.round(orcamento.ativa / ALVO_MIN.ativa)),
    espacada: Math.max(0, Math.round(orcamento.espacada / ALVO_MIN.espacada)),
  };

  // Duração efetiva de cada bloco (preenche o orçamento da categoria)
  const dur = {
    novo: counts.novo > 0 ? Math.max(20, Math.round(orcamento.novo / counts.novo)) : ALVO_MIN.novo,
    ativa: counts.ativa > 0 ? Math.max(15, Math.round(orcamento.ativa / counts.ativa)) : ALVO_MIN.ativa,
    espacada: counts.espacada > 0 ? Math.max(10, Math.round(orcamento.espacada / counts.espacada)) : ALVO_MIN.espacada,
  };

  // Cursores cronológicos por categoria
  // - novo: primeiro não-dominado que ainda nunca foi tocado (nao_iniciado)
  //   fallback: superficial
  // - ativa: superficial ou revisar (em ordem)
  // - espacada: revisar ou dominado (recall)
  const novoCursors = buildSubjectCursors(state, infos, (s) => s === "nao_iniciado");
  const novoFallback = buildSubjectCursors(state, infos, (s) => s === "superficial");
  const ativaCursors = buildSubjectCursors(
    state,
    infos,
    (s) => s === "superficial" || s === "revisar",
  );
  const espacadaCursors = buildSubjectCursors(
    state,
    infos,
    (s) => s === "revisar" || s === "dominado",
  );

  const subjectOrder = infos.map((i) => i.id);

  const weekStart = startOfWeekMonday();
  weekStart.setHours(9, 0, 0, 0);
  const weekStartISO = weekStart.toISOString();

  const tasks: Task[] = [];
  let last: string | undefined;
  let globalOrder = 1;

  // Helper para evitar duplicar microtemas dentro da mesma semana
  const usados = new Set<string>();
  const pickNovo = () => {
    let c = pickRoundRobin(novoCursors, subjectOrder, last);
    if (!c) c = pickRoundRobin(novoFallback, subjectOrder, last);
    while (c && usados.has(c.microthemeId)) {
      c = pickRoundRobin(novoCursors, subjectOrder, last) ?? pickRoundRobin(novoFallback, subjectOrder, last);
    }
    return c;
  };
  const pickAtiva = () => {
    let c = pickRoundRobin(ativaCursors, subjectOrder, last);
    while (c && usados.has(c.microthemeId)) {
      c = pickRoundRobin(ativaCursors, subjectOrder, last);
    }
    return c;
  };
  const pickEspacada = () => {
    let c = pickRoundRobin(espacadaCursors, subjectOrder, last);
    while (c && usados.has(c.microthemeId)) {
      c = pickRoundRobin(espacadaCursors, subjectOrder, last);
    }
    return c;
  };

  // Intercalar categorias para gerar variedade na fila
  const slots: BlocoTipo[] = [];
  const max = Math.max(counts.novo, counts.ativa, counts.espacada);
  for (let i = 0; i < max; i++) {
    if (i < counts.novo) slots.push("novo");
    if (i < counts.ativa) slots.push("revisao_ativa");
    if (i < counts.espacada) slots.push("revisao_espacada");
  }

  for (const bloco of slots) {
    let cand: Candidate | undefined;
    if (bloco === "novo") cand = pickNovo();
    else if (bloco === "revisao_ativa") cand = pickAtiva();
    else cand = pickEspacada();

    if (!cand) continue;
    usados.add(cand.microthemeId);

    const d = bloco === "novo" ? dur.novo : bloco === "revisao_ativa" ? dur.ativa : dur.espacada;
    tasks.push(makeTask(cand, bloco, d, weekStartISO, globalOrder++));
    last = cand.subjectId;
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
      duracaoMinutos: ALVO_MIN.espacada,
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
