import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useStore, addDays, isSameDay } from "@/lib/store";
import { AddTaskDialog } from "@/components/AddTaskDialog";

export const Route = createFileRoute("/calendario")({
  head: () => ({
    meta: [
      { title: "Calendário Acadêmico — Organiza Direito" },
      { name: "description", content: "Veja provas, trabalhos, seminários e leituras em uma só visão." },
    ],
  }),
  component: CalendarPage,
});

interface DayEvent {
  id: string;
  titulo: string;
  cor: string;
  tipo: "prova" | "trabalho" | "seminario" | "leitura" | "estudo" | "outro";
  origem: "task" | "assessment";
}

function CalendarPage() {
  const { state, hydrated } = useStore();
  const navigate = useNavigate();
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  useEffect(() => {
    if (hydrated && !state.user?.onboardingCompleto) navigate({ to: "/onboarding" });
  }, [hydrated, state.user, navigate]);

  const events = useMemo<Record<string, DayEvent[]>>(() => {
    const map: Record<string, DayEvent[]> = {};
    const subj = (id?: string) => state.subjects.find((s) => s.id === id);
    state.tasks.forEach((t) => {
      if (!t.prazo) return;
      const key = t.prazo.slice(0, 10);
      (map[key] ||= []).push({
        id: t.id,
        titulo: t.titulo,
        cor: subj(t.subjectId)?.cor ?? "#2563eb",
        tipo: t.tipo,
        origem: "task",
      });
    });
    state.assessments.forEach((a) => {
      const key = a.data.slice(0, 10);
      (map[key] ||= []).push({
        id: a.id,
        titulo: a.titulo,
        cor: subj(a.subjectId)?.cor ?? "#2563eb",
        tipo: a.tipo,
        origem: "assessment",
      });
    });
    return map;
  }, [state.tasks, state.assessments, state.subjects]);

  // Build calendar grid (weeks starting Monday)
  const firstWeekday = (cursor.getDay() + 6) % 7;
  const gridStart = addDays(cursor, -firstWeekday);
  const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));

  const monthLabel = cursor.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <AppShell>
      <SectionHeader
        title="Calendário"
        subtitle="Tudo o que tem prazo aparece aqui."
        action={<AddTaskDialog />}
      />

      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="text-base font-semibold capitalize">{monthLabel}</div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const d = new Date();
                d.setDate(1);
                d.setHours(0, 0, 0, 0);
                setCursor(d);
              }}
            >
              Hoje
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-border bg-muted/40 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d) => (
            <div key={d} className="px-2 py-2 text-center">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {cells.map((d, i) => {
            const key = d.toISOString().slice(0, 10);
            const inMonth = d.getMonth() === cursor.getMonth();
            const today = isSameDay(d, new Date());
            const evs = events[key] ?? [];
            return (
              <div
                key={i}
                className={`min-h-24 border-b border-r border-border p-1.5 last:border-r-0 ${
                  inMonth ? "bg-card" : "bg-muted/30 text-muted-foreground"
                }`}
              >
                <div
                  className={`mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                    today ? "bg-primary text-primary-foreground font-semibold" : ""
                  }`}
                >
                  {d.getDate()}
                </div>
                <div className="space-y-1">
                  {evs.slice(0, 3).map((e) => (
                    <div
                      key={e.id}
                      className="truncate rounded px-1.5 py-0.5 text-[11px] font-medium"
                      style={{ backgroundColor: e.cor + "22", color: e.cor }}
                      title={e.titulo}
                    >
                      {e.origem === "assessment" ? "● " : ""}{e.titulo}
                    </div>
                  ))}
                  {evs.length > 3 && (
                    <div className="px-1.5 text-[11px] text-muted-foreground">+{evs.length - 3}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="font-medium">Legenda:</span>
        <span className="inline-flex items-center gap-1">● Avaliação</span>
        {state.subjects.map((s) => (
          <span key={s.id} className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.cor }} />
            {s.nome}
          </span>
        ))}
      </div>
    </AppShell>
  );
}
