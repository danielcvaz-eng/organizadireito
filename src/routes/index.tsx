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
  { label: string; icon: typeof Layers; dot: string; chip: string; ring: string; descricao: string }
> = {
  novo: {
    label: "Tema novo",
    icon: Layers,
    dot: "bg-violet-500",
    chip: "bg-violet-100 text-violet-700",
    ring: "border-l-violet-500",
    descricao: "Conteúdo inédito para destravar a próxima etapa do currículo.",
  },
  revisao_ativa: {
    label: "Revisão ativa",
    icon: BookOpenCheck,
    dot: "bg-emerald-500",
    chip: "bg-emerald-100 text-emerald-700",
    ring: "border-l-emerald-500",
    descricao: "Recapitular com lápis e papel o que você já viu.",
  },
  revisao_espacada: {
    label: "Revisão espaçada",
    icon: Repeat,
    dot: "bg-blue-500",
    chip: "bg-blue-100 text-blue-700",
    ring: "border-l-blue-500",
    descricao: "Toques rápidos no que já está dominado — para não esquecer.",
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

  const weekCycleTasks = useMemo(
    () =>
      state.tasks
        .filter((t) => t.origem === "ciclo")
        .filter((t) => {
          if (!t.prazo) return true;
          const d = new Date(t.prazo);
          return d >= weekStart && d <= weekEnd;
        })
        .sort((a, b) => (a.ordemNoDia ?? 99) - (b.ordemNoDia ?? 99)),
    [state.tasks, weekStart, weekEnd],
  );

  const pendingRevisions = useMemo(
    () =>
      state.tasks
        .filter((t) => t.origem === "revisao" && t.status !== "feito")
        .sort((a, b) => (a.prazo ?? "").localeCompare(b.prazo ?? "")),
    [state.tasks],
  );

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const upcomingAssessments = state.assessments
    .filter((a) => {
      const d = new Date(a.data);
      return d >= today && d <= addDays(today, 21);
    })
    .sort((a, b) => a.data.localeCompare(b.data));

  const doneWeek = weekCycleTasks.filter((t) => t.status === "feito").length;
  const progress =
    weekCycleTasks.length === 0 ? 0 : Math.round((doneWeek / weekCycleTasks.length) * 100);

  const grupos: { tipo: BlocoTipo; tasks: Task[] }[] = useMemo(() => {
    const types: BlocoTipo[] = ["novo", "revisao_ativa", "revisao_espacada"];
    return types.map((tipo) => ({
      tipo,
      tasks: weekCycleTasks.filter((t) => t.bloco === tipo),
    }));
  }, [weekCycleTasks]);

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

  // Mensagem adaptativa (sem cobrar)
  const pendentes = weekCycleTasks.length - doneWeek;
  const dayOfWeek = (new Date().getDay() + 6) % 7; // 0=seg
  const muitoPendente = pendentes > 0 && dayOfWeek >= 4 && progress < 50;

  return (
    <AppShell>
      <SectionHeader
        title={`${greeting}!`}
        subtitle="Seu ciclo da semana — sem dias fixos. Cumpra na ordem que conseguir."
        action={
          <Button variant="outline" onClick={regeneratePlan} title="Redistribuir blocos da semana">
            <RefreshCcw className="mr-1 h-4 w-4" />
            Redistribuir
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
                O ciclo é montado automaticamente depois do diagnóstico (menos de 2 min por disciplina).
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

      {muitoPendente && (
        <Card className="mb-6 border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <RefreshCcw className="mt-0.5 h-4 w-4 text-amber-700" />
            <div className="flex-1 text-sm text-amber-900">
              <span className="font-semibold">Vamos redistribuir sua carga.</span>{" "}
              A semana não acabou — clique em <em>Redistribuir</em> para reorganizar os blocos
              restantes de forma realista. Sem cobrança, só consistência.
            </div>
          </div>
        </Card>
      )}

      <Card className="mb-6 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Progresso do ciclo desta semana</div>
            <div className="mt-1 text-2xl font-semibold">
              {doneWeek} de {weekCycleTasks.length} blocos concluídos
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
        <div className="space-y-4 lg:col-span-2">
          {weekCycleTasks.length === 0 && !semDisciplinas && !semPlano && (
            <Card className="p-6 text-center text-sm text-muted-foreground">
              Nenhum bloco programado. Clique em "Redistribuir".
            </Card>
          )}

          {grupos.map(({ tipo, tasks }) =>
            tasks.length === 0 ? null : (
              <BlockGroup
                key={tipo}
                tipo={tipo}
                tasks={tasks}
                subjects={state.subjects}
                onToggle={toggleTaskDone}
              />
            ),
          )}
        </div>

        <aside className="space-y-6">
          {pendingRevisions.length > 0 && (
            <Card className="p-5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Repeat className="h-4 w-4 text-blue-500" />
                Revisões em aberto
              </div>
              <ul className="mt-3 space-y-2">
                {pendingRevisions.slice(0, 5).map((r) => {
                  const subj = state.subjects.find((s) => s.id === r.subjectId);
                  return (
                    <li key={r.id} className="flex items-start gap-2 text-sm">
                      <Checkbox
                        className="mt-0.5"
                        checked={false}
                        onCheckedChange={() => toggleTaskDone(r.id)}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="truncate">{r.titulo}</div>
                        <div className="text-xs text-muted-foreground">
                          {subj?.nome ?? "—"} · {formatDate(r.prazo)}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>
          )}

          <Card className="p-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Clock className="h-4 w-4 text-primary" />
              Próximas avaliações
            </div>
            {upcomingAssessments.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Nenhuma avaliação nas próximas 3 semanas.
              </p>
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

function BlockGroup({
  tipo,
  tasks,
  subjects,
  onToggle,
}: {
  tipo: BlocoTipo;
  tasks: Task[];
  subjects: { id: string; nome: string; cor: string }[];
  onToggle: (id: string) => void;
}) {
  const meta = BLOCO_META[tipo];
  const Icon = meta.icon;
  const done = tasks.filter((t) => t.status === "feito").length;
  const totalMin = tasks.reduce((acc, t) => acc + (t.duracaoMinutos ?? 0), 0);

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/30 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className={cn("flex h-7 w-7 items-center justify-center rounded-md", meta.chip)}>
            <Icon className="h-3.5 w-3.5" />
          </span>
          <div>
            <h3 className="text-sm font-semibold">{meta.label}</h3>
            <p className="text-[11px] text-muted-foreground">{meta.descricao}</p>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {done}/{tasks.length} · {totalMin} min
        </div>
      </div>
      <div className="divide-y divide-border">
        {tasks.map((t, i) => (
          <BlocoRow key={t.id} task={t} index={i + 1} subjects={subjects} onToggle={onToggle} />
        ))}
      </div>
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
  const done = task.status === "feito";

  return (
    <div
      className={cn(
        "flex items-start gap-3 border-l-4 px-4 py-3",
        meta?.ring ?? "border-l-transparent",
      )}
    >
      <Checkbox className="mt-0.5" checked={done} onCheckedChange={() => onToggle(task.id)} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Bloco {index}
          </span>
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
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
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
