import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useStore, startOfWeek, endOfWeek, addDays, isSameDay, daysUntil, formatDate } from "@/lib/store";
import type { Task } from "@/lib/types";
import { BookOpen, FileText, Presentation, Sparkles, Target, Clock, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Minha Semana — Organiza Direito" },
      {
        name: "description",
        content: "Veja o que você precisa fazer esta semana para não se enrolar.",
      },
    ],
  }),
  component: HomePage,
});

const TYPE_ICON = {
  leitura: BookOpen,
  trabalho: FileText,
  seminario: Presentation,
  estudo: Target,
  outro: Sparkles,
} as const;

function HomePage() {
  const { state, hydrated, toggleTaskDone } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && !state.user?.onboardingCompleto) {
      navigate({ to: "/onboarding" });
    }
  }, [hydrated, state.user, navigate]);

  const weekStart = startOfWeek();
  const weekEnd = endOfWeek();

  const weekTasks = useMemo(
    () =>
      state.tasks.filter((t) => {
        if (!t.prazo) return false;
        const d = new Date(t.prazo);
        return d >= weekStart && d <= weekEnd;
      }),
    [state.tasks, weekStart, weekEnd],
  );

  const overdue = state.tasks.filter(
    (t) => t.prazo && new Date(t.prazo) < weekStart && t.status !== "feito",
  );
  const noPrazo = state.tasks.filter((t) => !t.prazo && t.status !== "feito");
  const upcomingAssessments = state.assessments
    .filter((a) => {
      const d = new Date(a.data);
      return d >= new Date(new Date().setHours(0, 0, 0, 0)) && d <= addDays(new Date(), 21);
    })
    .sort((a, b) => a.data.localeCompare(b.data));

  const doneWeek = weekTasks.filter((t) => t.status === "feito").length;
  const progress = weekTasks.length === 0 ? 0 : Math.round((doneWeek / weekTasks.length) * 100);

  const byDay: { date: Date; tasks: Task[] }[] = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(weekStart, i);
    return { date: d, tasks: weekTasks.filter((t) => t.prazo && isSameDay(new Date(t.prazo), d)) };
  });

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  })();

  if (!hydrated) return null;

  return (
    <AppShell>
      <SectionHeader
        title={`${greeting}!`}
        subtitle="O que você precisa fazer esta semana para não se enrolar."
        action={<AddTaskDialog />}
      />

      {/* Progress card */}
      <Card className="mb-6 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Progresso da semana</div>
            <div className="mt-1 text-2xl font-semibold">
              {doneWeek} de {weekTasks.length} tarefas
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{progress}%</div>
          </div>
        </div>
        <Progress value={progress} className="mt-4 h-2" />
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {overdue.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-destructive">
                <AlertCircle className="h-4 w-4" />
                Atrasadas ({overdue.length})
              </h2>
              <Card className="divide-y divide-border p-0">
                {overdue.map((t) => (
                  <TaskRow key={t.id} task={t} subjects={state.subjects} onToggle={toggleTaskDone} highlight />
                ))}
              </Card>
            </section>
          )}

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Esta semana
            </h2>
            {weekTasks.length === 0 ? (
              <Card className="p-8 text-center">
                <Sparkles className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Nada agendado para esta semana ainda. Adicione uma tarefa para começar.
                </p>
                <div className="mt-4 flex justify-center">
                  <AddTaskDialog />
                </div>
              </Card>
            ) : (
              <div className="space-y-3">
                {byDay.map(({ date, tasks }) =>
                  tasks.length === 0 ? null : (
                    <div key={date.toISOString()}>
                      <div className="mb-1.5 flex items-baseline gap-2 px-1">
                        <span className="text-sm font-medium capitalize">
                          {date.toLocaleDateString("pt-BR", { weekday: "long" })}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                        </span>
                        {isSameDay(date, new Date()) && (
                          <Badge variant="secondary" className="bg-primary-soft text-accent-foreground">
                            hoje
                          </Badge>
                        )}
                      </div>
                      <Card className="divide-y divide-border p-0">
                        {tasks.map((t) => (
                          <TaskRow key={t.id} task={t} subjects={state.subjects} onToggle={toggleTaskDone} />
                        ))}
                      </Card>
                    </div>
                  ),
                )}
              </div>
            )}
          </section>

          {noPrazo.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Sem prazo
              </h2>
              <Card className="divide-y divide-border p-0">
                {noPrazo.map((t) => (
                  <TaskRow key={t.id} task={t} subjects={state.subjects} onToggle={toggleTaskDone} />
                ))}
              </Card>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Clock className="h-4 w-4 text-primary" />
              Próximas avaliações
            </div>
            {upcomingAssessments.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">Nenhuma avaliação nas próximas 3 semanas.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {upcomingAssessments.slice(0, 5).map((a) => {
                  const subj = state.subjects.find((s) => s.id === a.subjectId);
                  const dias = daysUntil(a.data);
                  return (
                    <li key={a.id} className="flex items-start gap-3">
                      <span
                        className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: subj?.cor ?? "var(--primary)" }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{a.titulo}</div>
                        <div className="text-xs text-muted-foreground">
                          {subj?.nome ?? "—"} · {formatDate(a.data)}
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          dias <= 3
                            ? "bg-destructive/10 text-destructive"
                            : dias <= 7
                              ? "bg-warning/15 text-warning-foreground"
                              : "bg-muted text-muted-foreground"
                        }
                      >
                        {dias === 0 ? "hoje" : dias === 1 ? "amanhã" : `${dias}d`}
                      </Badge>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <Card className="p-5">
            <div className="text-sm font-semibold">Suas disciplinas</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {state.subjects.map((s) => (
                <Link
                  key={s.id}
                  to="/disciplinas/$id"
                  params={{ id: s.id }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs hover:bg-muted"
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.cor }} />
                  {s.nome}
                </Link>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}

function TaskRow({
  task,
  subjects,
  onToggle,
  highlight,
}: {
  task: Task;
  subjects: { id: string; nome: string; cor: string }[];
  onToggle: (id: string) => void;
  highlight?: boolean;
}) {
  const subj = subjects.find((s) => s.id === task.subjectId);
  const Icon = TYPE_ICON[task.tipo];
  const done = task.status === "feito";
  return (
    <div className={`flex items-center gap-3 px-4 py-3 ${highlight ? "bg-destructive/5" : ""}`}>
      <Checkbox checked={done} onCheckedChange={() => onToggle(task.id)} />
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md" style={{
        backgroundColor: (subj?.cor ?? "#2563eb") + "1a",
        color: subj?.cor ?? "#2563eb",
      }}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className={`truncate text-sm font-medium ${done ? "text-muted-foreground line-through" : ""}`}>
          {task.titulo}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
          {subj && <span className="truncate">{subj.nome}</span>}
          {task.prazo && <span>· {formatDate(task.prazo)}</span>}
        </div>
      </div>
      {task.prioridade === "alta" && !done && (
        <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/15">alta</Badge>
      )}
    </div>
  );
}
