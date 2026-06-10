import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStore, daysUntil, formatDate } from "@/lib/store";

export const Route = createFileRoute("/semestre")({
  head: () => ({
    meta: [
      { title: "Semestre — Organiza Direito" },
      { name: "description", content: "Visão geral do seu semestre: disciplinas, progresso e próximos prazos." },
    ],
  }),
  component: SemestrePage,
});

function SemestrePage() {
  const { state, hydrated } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && !state.user?.onboardingCompleto) navigate({ to: "/onboarding" });
  }, [hydrated, state.user, navigate]);

  const totalTasks = state.tasks.length;
  const doneTasks = state.tasks.filter((t) => t.status === "feito").length;
  const overallProgress = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  const upcoming = state.assessments
    .filter((a) => new Date(a.data) >= new Date(new Date().setHours(0, 0, 0, 0)))
    .sort((a, b) => a.data.localeCompare(b.data));

  const provas = upcoming.filter((a) => a.tipo === "prova");
  const trabalhos = upcoming.filter((a) => a.tipo !== "prova");

  return (
    <AppShell>
      <SectionHeader
        title={state.user ? `Seu ${state.user.semestre}º semestre` : "Seu semestre"}
        subtitle="A vista panorâmica das suas matérias e prazos."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-5">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Disciplinas</div>
          <div className="mt-2 text-3xl font-semibold">{state.subjects.length}</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Avaliações futuras</div>
          <div className="mt-2 text-3xl font-semibold">{upcoming.length}</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Progresso geral</div>
          <div className="mt-2 text-3xl font-semibold text-primary">{overallProgress}%</div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${overallProgress}%` }} />
          </div>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Disciplinas</h2>
          {state.subjects.length === 0 ? (
            <Card className="p-6 text-center text-sm text-muted-foreground">Sem disciplinas ainda.</Card>
          ) : (
            <div className="space-y-2">
              {state.subjects.map((s) => {
                const tasks = state.tasks.filter((t) => t.subjectId === s.id);
                const done = tasks.filter((t) => t.status === "feito").length;
                const prog = tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100);
                return (
                  <Link key={s.id} to="/disciplinas/$id" params={{ id: s.id }}>
                    <Card className="p-4 transition-shadow hover:shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="h-8 w-1.5 rounded-full" style={{ backgroundColor: s.cor }} />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">{s.nome}</div>
                          <div className="text-xs text-muted-foreground">
                            {done}/{tasks.length} concluídas
                          </div>
                        </div>
                        <div className="text-sm font-medium" style={{ color: s.cor }}>{prog}%</div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Próximas provas</h2>
            {provas.length === 0 ? (
              <Card className="p-6 text-center text-sm text-muted-foreground">Sem provas marcadas.</Card>
            ) : (
              <Card className="divide-y divide-border p-0">
                {provas.slice(0, 5).map((a) => {
                  const s = state.subjects.find((x) => x.id === a.subjectId);
                  const d = daysUntil(a.data);
                  return (
                    <div key={a.id} className="flex items-center gap-3 px-4 py-3">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s?.cor }} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{a.titulo}</div>
                        <div className="text-xs text-muted-foreground">{s?.nome} · {formatDate(a.data)}</div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={d <= 3 ? "bg-destructive/10 text-destructive" : d <= 7 ? "bg-warning/15 text-warning-foreground" : "bg-muted text-muted-foreground"}
                      >
                        {d === 0 ? "hoje" : `${d}d`}
                      </Badge>
                    </div>
                  );
                })}
              </Card>
            )}
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Próximos trabalhos e seminários</h2>
            {trabalhos.length === 0 ? (
              <Card className="p-6 text-center text-sm text-muted-foreground">Nada por aqui.</Card>
            ) : (
              <Card className="divide-y divide-border p-0">
                {trabalhos.slice(0, 5).map((a) => {
                  const s = state.subjects.find((x) => x.id === a.subjectId);
                  const d = daysUntil(a.data);
                  return (
                    <div key={a.id} className="flex items-center gap-3 px-4 py-3">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s?.cor }} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{a.titulo}</div>
                        <div className="text-xs text-muted-foreground">
                          {s?.nome} · {a.tipo} · {formatDate(a.data)}
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-muted text-muted-foreground">{d}d</Badge>
                    </div>
                  );
                })}
              </Card>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
