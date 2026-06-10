import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AppState, Assessment, Subject, Task, Topic, UserProfile } from "./types";

const STORAGE_KEY = "organiza-direito:v1";

const EMPTY_STATE: AppState = {
  user: null,
  subjects: [],
  topics: [],
  tasks: [],
  assessments: [],
  completedMicrothemes: [],
};

function loadState(): AppState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    return { ...EMPTY_STATE, ...JSON.parse(raw) };
  } catch {
    return EMPTY_STATE;
  }
}

function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
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
  // microthemes (currículo jurídico)
  toggleMicrotheme: (subjectId: string, microthemeId: string) => void;
  isMicrothemeDone: (subjectId: string, microthemeId: string) => boolean;
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
    return {
      state,
      hydrated,
      setUser: (user) => mutate((s) => ({ ...s, user })),
      resetAll: () => {
        if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
        setState(EMPTY_STATE);
      },
      addSubject: (s) => {
        const subject: Subject = { ...s, id: uid() };
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
            { ...t, id: uid(), createdAt: new Date().toISOString(), status: t.status ?? "pendente" },
          ],
        })),
      updateTask: (id, patch) =>
        mutate((s) => ({ ...s, tasks: s.tasks.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
      toggleTaskDone: (id) =>
        mutate((s) => ({
          ...s,
          tasks: s.tasks.map((x) =>
            x.id === id ? { ...x, status: x.status === "feito" ? "pendente" : "feito" } : x,
          ),
        })),
      removeTask: (id) => mutate((s) => ({ ...s, tasks: s.tasks.filter((x) => x.id !== id) })),
      addAssessment: (a) => mutate((s) => ({ ...s, assessments: [...s.assessments, { ...a, id: uid() }] })),
      updateAssessment: (id, patch) =>
        mutate((s) => ({ ...s, assessments: s.assessments.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
      removeAssessment: (id) => mutate((s) => ({ ...s, assessments: s.assessments.filter((x) => x.id !== id) })),
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
