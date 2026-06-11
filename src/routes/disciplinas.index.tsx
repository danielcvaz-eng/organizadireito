import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, ArrowRight, BookOpen } from "lucide-react";
import { useStore } from "@/lib/store";
import { SUBJECT_CATALOG } from "@/data/subjectCatalog";
import { countMicrothemes } from "@/data/legalCurriculum";

export const Route = createFileRoute("/disciplinas/")({
  head: () => ({
    meta: [
      { title: "Disciplinas — Organiza Direito" },
      { name: "description", content: "Acompanhe progresso, tarefas e avaliações por disciplina." },
    ],
  }),
  component: DisciplinasPage,
});

function DisciplinasPage() {
  const { state, hydrated, addSubject } = useStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [cor, setCor] = useState("#2563eb");

  useEffect(() => {
    if (hydrated && !state.user?.onboardingCompleto) navigate({ to: "/onboarding" });
  }, [hydrated, state.user, navigate]);

  function add(catalogId?: string) {
    if (catalogId) {
      const cat = SUBJECT_CATALOG.find((c) => c.id === catalogId)!;
      addSubject({ nome: cat.nome, cor: cat.cor, catalogId: cat.id });
    } else {
      if (!nome.trim()) return;
      addSubject({ nome: nome.trim(), cor });
      setNome("");
    }
    setOpen(false);
  }

  const availableCatalog = SUBJECT_CATALOG.filter(
    (c) => !state.subjects.some((s) => s.catalogId === c.id),
  );

  return (
    <AppShell>
      <SectionHeader
        title="Disciplinas"
        subtitle="Tudo o que está rolando no seu semestre."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-1 h-4 w-4" />
                Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar disciplina</DialogTitle>
              </DialogHeader>
              {availableCatalog.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Do catálogo
                  </div>
                  <div className="grid max-h-56 grid-cols-1 gap-1.5 overflow-y-auto sm:grid-cols-2">
                    {availableCatalog.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => add(c.id)}
                        className="flex items-center gap-2 rounded-md border border-border p-2 text-left text-sm hover:bg-muted"
                      >
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.cor }} />
                        {c.nome}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-3 border-t border-border pt-4">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Personalizada
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <div className="space-y-1.5">
                    <Label>Nome</Label>
                    <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Hermenêutica" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Cor</Label>
                    <Input type="color" value={cor} onChange={(e) => setCor(e.target.value)} className="h-10 w-14 p-1" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button onClick={() => add()}>Adicionar personalizada</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {state.subjects.length === 0 ? (
        <Card className="p-10 text-center">
          <BookOpen className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Você ainda não tem disciplinas.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {state.subjects.map((s) => {
            const tasks = state.tasks.filter((t) => t.subjectId === s.id);
            const totalMicro = countMicrothemes(s.catalogId);
            const dominados = state.microthemeProgress.filter(
              (p) => p.subjectId === s.id && p.status === "dominado",
            ).length;
            const progresso =
              totalMicro > 0
                ? Math.round((dominados / totalMicro) * 100)
                : tasks.length === 0
                  ? 0
                  : Math.round((tasks.filter((t) => t.status === "feito").length / tasks.length) * 100);
            const próximas = state.assessments
              .filter((a) => a.subjectId === s.id && new Date(a.data) >= new Date(new Date().setHours(0, 0, 0, 0)))
              .sort((a, b) => a.data.localeCompare(b.data));
            return (
              <Link key={s.id} to="/disciplinas/$id" params={{ id: s.id }}>
                <Card className="group h-full p-5 transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: s.cor }} />
                      <span className="text-base font-semibold">{s.nome}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between text-xs text-muted-foreground">
                    <span>Progresso</span>
                    <span className="font-medium text-foreground">{progresso}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${progresso}%`, backgroundColor: s.cor }}
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {totalMicro > 0
                        ? `${dominados}/${totalMicro} microtemas`
                        : `${tasks.length} tarefa${tasks.length === 1 ? "" : "s"}`}
                    </span>
                    {próximas[0] ? (
                      <span className="text-muted-foreground">
                        Próx.: {new Date(próximas[0].data).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Sem avaliações</span>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
