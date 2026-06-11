import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type {
  AppState,
  Assessment,
  MicroThemeStatus,
  Subject,
  Task,
  Topic,
  UserProfile,
} from "./types";
import { findMicrotheme } from "@/data/legalCurriculum";
import {
  generateWeeklyCycle,
  generateRevisions,
  advanceStatus,
} from "./planner";
import { uid } from "./store-internal";

export { uid };

const STORAGE_KEY = "organiza-direito:v1";

const EMPTY_STATE: AppState = {
  user: null,
  subjects: [],
  topics: [],
  tasks: [],
  assessments: [],
  completedMicrothemes: [],
  microthemeProgress: [],
};

function loadState(): AppState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...EMPTY_STATE,
      ...parsed,
      microthemeProgress: parsed.microthemeProgress ?? [],
      completedMicrothemes: parsed.completedMicrothemes ?? [],
    };
  } catch {
    return EMPTY_STATE;
  }
}

function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

interface StoreApi {
  state: AppState;
  hydrated: boolean;
  setUser: (user: UserProfile) => void;
  resetAll: () => void;
  // subjects
  addSubject: (s: Omit<Subject, "id">) => Subject;
  removeSubject: (id: string) => void;
  updateSubject: (id: string, patch: Partial<Subject>) => void;
  // topics
  addTopic: (t: Omit<Topic, "id" | "ordem" | "concluido"> & Partial<Pick<Topic, "concluido">>) => void;
  toggleTopic: (id: string) => void;
  removeTopic: (id: string) => void;
  // tasks
  addTask: (t: Omit<Task, "id" | "createdAt" | "status"> & Partial<Pick<Task, "status">>) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  toggleTaskDone: (id: string) => void;
  removeTask: (id: string) => void;
  // assessments
  addAssessment: (a: Omit<Assessment, "id">) => void;
  updateAssessment: (id: string, patch: Partial<Assessment>) => void;
  removeAssessment: (id: string) => void;
  // microtemas / planner
  setMicrothemeStatus: (subjectId: string, microthemeId: string, status: MicroThemeStatus) => void;
  getMicrothemeStatus: (subjectId: string, microthemeId: string) => MicroThemeStatus;
  bulkSetMicrothemeStatuses: (
    subjectId: string,
    entries: { microthemeId: string; status: MicroThemeStatus }[],
  ) => void;
  completeSubjectOnboarding: (subjectId: string) => void;
  regeneratePlan: () => void;
}

const StoreContext = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(EMPTY_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const api = useMemo<StoreApi>(() => {
    const mutate = (fn: (s: AppState) => AppState) => setState((s) => fn(s));

    function regenerate(s: AppState): AppState {
      // Mantém apenas tarefas de ciclo já concluídas (histórico) e
      // tarefas que não pertencem ao ciclo (manuais, revisões espaçadas, avaliações).
      const kept = s.tasks.filter((t) => {
        if (t.origem !== "ciclo") return true;
        return t.status === "feito";
      });
      const next = generateWeeklyCycle(s);
      return { ...s, tasks: [...kept, ...next] };
    }

    function upsertProgress(
      s: AppState,
      subjectId: string,
      microthemeId: string,
      status: MicroThemeStatus,
    ): AppState {
      const subject = s.subjects.find((x) => x.id === subjectId);
      const flat = findMicrotheme(subject?.catalogId, microthemeId);
      if (!flat) return s;
      const existing = s.microthemeProgress.find(
        (p) => p.subjectId === subjectId && p.microthemeId === microthemeId,
      );
      const updated = {
        subjectId,
        microthemeId,
        themeId: flat.themeId,
        moduleId: flat.moduleId,
        status,
        ultimaRevisao: existing?.ultimaRevisao,
      };
      const list = existing
        ? s.microthemeProgress.map((p) =>
            p === existing ? updated : p,
          )
        : [...s.microthemeProgress, updated];
      return { ...s, microthemeProgress: list };
    }

    return {
      state,
      hydrated,
      setUser: (user) => mutate((s) => ({ ...s, user })),
      resetAll: () => {
        if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
        setState(EMPTY_STATE);
      },
      addSubject: (s) => {
        const subject: Subject = {
          ...s,
          id: uid(),
          subjectOnboardingCompleto: s.subjectOnboardingCompleto ?? false,
          dificuldade: s.dificuldade ?? "media",
        };
        mutate((st) => ({ ...st, subjects: [...st.subjects, subject] }));
        return subject;
      },
      removeSubject: (id) =>
        mutate((s) => ({
          ...s,
          subjects: s.subjects.filter((x) => x.id !== id),
          topics: s.topics.filter((x) => x.subjectId !== id),
          tasks: s.tasks.filter((x) => x.subjectId !== id),
          assessments: s.assessments.filter((x) => x.subjectId !== id),
          microthemeProgress: s.microthemeProgress.filter((x) => x.subjectId !== id),
        })),
      updateSubject: (id, patch) =>
        mutate((s) => ({ ...s, subjects: s.subjects.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
      addTopic: (t) =>
        mutate((s) => {
          const ordem = s.topics.filter((x) => x.subjectId === t.subjectId).length;
          return {
            ...s,
            topics: [
              ...s.topics,
              { id: uid(), subjectId: t.subjectId, titulo: t.titulo, ordem, concluido: t.concluido ?? false },
            ],
          };
        }),
      toggleTopic: (id) =>
        mutate((s) => ({ ...s, topics: s.topics.map((x) => (x.id === id ? { ...x, concluido: !x.concluido } : x)) })),
      removeTopic: (id) => mutate((s) => ({ ...s, topics: s.topics.filter((x) => x.id !== id) })),
      addTask: (t) =>
        mutate((s) => ({
          ...s,
          tasks: [
            ...s.tasks,
            {
              ...t,
              id: uid(),
              createdAt: new Date().toISOString(),
              status: t.status ?? "pendente",
              origem: t.origem ?? "manual",
            },
          ],
        })),
      updateTask: (id, patch) =>
        mutate((s) => ({ ...s, tasks: s.tasks.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
      toggleTaskDone: (id) =>
        mutate((s) => {
          const task = s.tasks.find((x) => x.id === id);
          if (!task) return s;
          const novoStatus = task.status === "feito" ? "pendente" : "feito";
          const tasksUpdated = s.tasks.map((x) =>
            x.id === id ? { ...x, status: novoStatus as Task["status"] } : x,
          );
          let next: AppState = { ...s, tasks: tasksUpdated };

          // Gera revisões automáticas ao concluir uma task de ciclo
          if (
            novoStatus === "feito" &&
            task.origem === "ciclo" &&
            task.microthemeRef
          ) {
            const subject = s.subjects.find((sb) => sb.id === task.microthemeRef!.subjectId);
            const flat = findMicrotheme(subject?.catalogId, task.microthemeRef.microthemeId);
            if (subject && flat) {
              // evita duplicar se já houve revisões geradas para este microtema recentemente
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const jaTem = next.tasks.some(
                (t) =>
                  t.origem === "revisao" &&
                  t.microthemeRef?.microthemeId === task.microthemeRef!.microthemeId &&
                  t.microthemeRef?.subjectId === task.microthemeRef!.subjectId &&
                  t.prazo &&
                  new Date(t.prazo) >= today,
              );
              if (!jaTem) {
                const revs = generateRevisions(
                  task.microthemeRef,
                  new Date().toISOString(),
                  subject.nome,
                  flat.microthemeNome,
                );
                next = { ...next, tasks: [...next.tasks, ...revs] };
              }
              // avança status
              const cur =
                next.microthemeProgress.find(
                  (p) =>
                    p.subjectId === subject.id &&
                    p.microthemeId === task.microthemeRef!.microthemeId,
                )?.status ?? "nao_iniciado";
              next = upsertProgress(next, subject.id, task.microthemeRef.microthemeId, advanceStatus(cur));
            }
          }
          return next;
        }),
      removeTask: (id) => mutate((s) => ({ ...s, tasks: s.tasks.filter((x) => x.id !== id) })),
      addAssessment: (a) =>
        mutate((s) => {
          const next = { ...s, assessments: [...s.assessments, { ...a, id: uid() }] };
          return regenerate(next); // avaliação nova → pode mudar prioridades
        }),
      updateAssessment: (id, patch) =>
        mutate((s) => ({ ...s, assessments: s.assessments.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
      removeAssessment: (id) => mutate((s) => ({ ...s, assessments: s.assessments.filter((x) => x.id !== id) })),
      setMicrothemeStatus: (subjectId, microthemeId, status) =>
        mutate((s) => regenerate(upsertProgress(s, subjectId, microthemeId, status))),
      getMicrothemeStatus: (subjectId, microthemeId) => {
        return (
          state.microthemeProgress.find(
            (p) => p.subjectId === subjectId && p.microthemeId === microthemeId,
          )?.status ?? "nao_iniciado"
        );
      },
      bulkSetMicrothemeStatuses: (subjectId, entries) =>
        mutate((s) => {
          let next = s;
          for (const e of entries) {
            next = upsertProgress(next, subjectId, e.microthemeId, e.status);
          }
          return next;
        }),
      completeSubjectOnboarding: (subjectId) =>
        mutate((s) => {
          const subjects = s.subjects.map((x) =>
            x.id === subjectId ? { ...x, subjectOnboardingCompleto: true } : x,
          );
          return regenerate({ ...s, subjects });
        }),
      regeneratePlan: () => mutate((s) => regenerate(s)),
    };
  }, [state, hydrated]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

// ---------- Date helpers ----------

export function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function startOfWeek(d: Date = new Date()): Date {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay(); // 0 = Sun
  const diff = (day + 6) % 7; // make Monday the start
  date.setDate(date.getDate() - diff);
  return date;
}

export function endOfWeek(d: Date = new Date()): Date {
  const s = startOfWeek(d);
  const e = new Date(s);
  e.setDate(e.getDate() + 6);
  e.setHours(23, 59, 59, 999);
  return e;
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function formatDate(iso: string | undefined): string {
  if (!iso) return "Sem prazo";
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export function formatDateLong(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
}

export function daysUntil(iso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(iso);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}
