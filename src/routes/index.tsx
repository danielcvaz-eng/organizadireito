import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  useStore,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  daysUntil,
  formatDate,
} from "@/lib/store";
import type { Task, BlocoTipo } from "@/lib/types";
import { Sparkles, Clock, RefreshCcw, Repeat, BookOpenCheck, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Minha Semana — Organiza Direito" },
      {
        name: "description",
        content: "Seu ciclo de estudos jurídicos da semana, montado automaticamente.",
      },
    ],
  }),
  component: HomePage,
});

const BLOCO_META: Record<
  BlocoTipo,
  { label: string; icon: typeof Layers; dot: string; chip: string; ring: string }
> = {
  novo: {
    label: "Tema novo",
    icon: Layers,
    dot: "bg-violet-500",
    chip: "bg-violet-100 text-violet-700",
    ring: "border-l-violet-500",
  },
  revisao_ativa: {
    label: "Revisão ativa",
    icon: BookOpenCheck,
    dot: "bg-emerald-500",
    chip: "bg-emerald-100 text-emerald-700",
    ring: "border-l-emerald-500",
  },
  revisao_espacada: {
    label: "Revisão espaçada",
    icon: Repeat,
    dot: "bg-blue-500",
    chip: "bg-blue-100 text-blue-700",
    ring: "border-l-blue-500",
  },
};

function HomePage() {
  const { state, hydrated, toggleTaskDone, regeneratePlan } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && !state.user?.onboardingCompleto) {
      navigate({ to: "/onboarding" });
    }
  }, [hydrated, state.user, navigate]);

  const weekStart = startOfWeek();
  const weekEnd = endOfWeek();
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const weekTasks = useMemo(
    () =>
      state.tasks.filter((t) => {
        if (!t.prazo) return false;
        const d = new Date(t.prazo);
        return d >= weekStart && d <= weekEnd;
      }),
    [state.tasks, weekStart, weekEnd],
  );

  const upcomingAssessments = state.assessments
    .filter((a) => {
      const d = new Date(a.data);
      return d >= today && d <= addDays(today, 21);
    })
    .sort((a, b) => a.data.localeCompare(b.data));

  const doneWeek = weekTasks.filter((t) => t.status === "feito").length;
  const progress = weekTasks.length === 0 ? 0 : Math.round((doneWeek / weekTasks.length) * 100);

  const byDay = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = addDays(weekStart, i);
        const tasks = weekTasks
          .filter((t) => t.prazo && isSameDay(new Date(t.prazo), d))
          .sort((a, b) => (a.ordemNoDia ?? 99) - (b.ordemNoDia ?? 99));
        return { date: d, tasks };
      }),
    [weekStart, weekTasks],
  );

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  })();

  if (!hydrated) return null;

  const semDisciplinas = state.subjects.length === 0;
  const semPlano =
    !semDisciplinas && state.subjects.every((s) => !s.subjectOnboardingCompleto);

  return (
    <AppShell>
      <SectionHeader
        title={`${greeting}!`}
        subtitle="O ciclo da sua semana — já organizado para você."
        action={
          <Button variant="outline" onClick={regeneratePlan} title="Recriar ciclo da semana">
            <RefreshCcw className="mr-1 h-4 w-4" />
            Regerar ciclo
          </Button>
        }
      />

      {semPlano && (
        <Card className="mb-6 border-primary/30 bg-primary-soft p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
            <div className="flex-1">
              <div className="text-sm font-semibold">Falta o diagnóstico das suas disciplinas</div>
              <p className="mt-1 text-sm text-muted-foreground">
                O ciclo de estudos será gerado automaticamente depois do diagnóstico (menos de 2 min por disciplina).
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {state.subjects.map((s) => (
                  <Link
                    key={s.id}
                    to="/disciplinas/$id"
                    params={{ id: s.id }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-xs font-medium hover:bg-muted"
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.cor }} />
                    {s.nome}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="mb-6 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Progresso do ciclo desta semana</div>
            <div className="mt-1 text-2xl font-semibold">
              {doneWeek} de {weekTasks.length} blocos concluídos
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{progress}%</div>
          </div>
        </div>
        <Progress value={progress} className="mt-4 h-2" />
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          {(Object.keys(BLOCO_META) as BlocoTipo[]).map((b) => (
            <span key={b} className="inline-flex items-center gap-1.5">
              <span className={cn("h-2 w-2 rounded-full", BLOCO_META[b].dot)} />
              {BLOCO_META[b].label}
            </span>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {byDay.map(({ date, tasks }) => (
            <DayCard
              key={date.toISOString()}
              date={date}
              tasks={tasks}
              isToday={isSameDay(date, today)}
              subjects={state.subjects}
              onToggle={toggleTaskDone}
            />
          ))}

          {weekTasks.length === 0 && !semDisciplinas && !semPlano && (
            <Card className="p-6 text-center text-sm text-muted-foreground">
              Nenhum bloco programado. Clique em "Regerar ciclo".
            </Card>
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
                  {!s.subjectOnboardingCompleto && (
                    <span className="ml-1 rounded-full bg-amber-100 px-1.5 text-[10px] font-medium text-amber-700">
                      diag
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}

function DayCard({
  date,
  tasks,
  isToday,
  subjects,
  onToggle,
}: {
  date: Date;
  tasks: Task[];
  isToday: boolean;
  subjects: { id: string; nome: string; cor: string }[];
  onToggle: (id: string) => void;
}) {
  const weekday = date.toLocaleDateString("pt-BR", { weekday: "long" });
  const dayLabel = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  return (
    <Card className={cn("overflow-hidden p-0", isToday && "ring-2 ring-primary/40")}>
      <div className="flex items-baseline justify-between border-b border-border bg-muted/30 px-5 py-3">
        <div className="flex items-baseline gap-2">
          <h3 className="text-sm font-semibold capitalize">{weekday}</h3>
          <span className="text-xs text-muted-foreground">{dayLabel}</span>
          {isToday && (
            <Badge className="ml-1 bg-primary/15 text-primary hover:bg-primary/15">hoje</Badge>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {tasks.length === 0 ? "Descanso" : `${tasks.length} bloco${tasks.length > 1 ? "s" : ""}`}
        </span>
      </div>
      {tasks.length === 0 ? (
        <div className="px-5 py-6 text-center text-xs text-muted-foreground">
          Dia livre — bom para recarregar.
        </div>
      ) : (
        <div className="divide-y divide-border">
          {tasks.map((t, i) => (
            <BlocoRow
              key={t.id}
              task={t}
              index={i + 1}
              subjects={subjects}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

function BlocoRow({
  task,
  index,
  subjects,
  onToggle,
}: {
  task: Task;
  index: number;
  subjects: { id: string; nome: string; cor: string }[];
  onToggle: (id: string) => void;
}) {
  const subj = subjects.find((s) => s.id === task.subjectId);
  const meta = task.bloco ? BLOCO_META[task.bloco] : null;
  const Icon = meta?.icon ?? Layers;
  const done = task.status === "feito";

  return (
    <div
      className={cn(
        "flex items-start gap-3 border-l-4 px-4 py-3",
        meta?.ring ?? "border-l-transparent",
      )}
    >
      <Checkbox className="mt-0.5" checked={done} onCheckedChange={() => onToggle(task.id)} />
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="h-3.5 w-3.5 text-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Bloco {index}
          </span>
          {meta && (
            <Badge variant="secondary" className={cn("text-[10px]", meta.chip)}>
              {meta.label}
            </Badge>
          )}
          {task.duracaoMinutos && (
            <span className="text-[10px] text-muted-foreground">{task.duracaoMinutos} min</span>
          )}
        </div>
        <div
          className={cn(
            "mt-0.5 text-sm font-medium",
            done && "text-muted-foreground line-through",
          )}
        >
          {task.titulo}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          {subj && (
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: subj.cor }} />
              {subj.nome}
            </span>
          )}
          {task.moduloNome && <span>· {task.moduloNome}</span>}
          {task.temaNome && <span className="truncate">→ {task.temaNome}</span>}
        </div>
      </div>
    </div>
  );
}
