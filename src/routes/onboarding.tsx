import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Sparkles, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { useStore } from "@/lib/store";
import { SUBJECT_CATALOG } from "@/data/subjectCatalog";
import { getInitialThemes } from "@/data/legalCurriculum";
import type { Goal } from "@/lib/types";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Boas-vindas — Organiza Direito" },
      { name: "description", content: "Configure o Organiza Direito em menos de 1 minuto." },
    ],
  }),
  component: OnboardingPage,
});

const GOALS: { value: Goal; label: string; desc: string }[] = [
  { value: "faculdade", label: "Faculdade", desc: "Foco total na graduação" },
  { value: "oab", label: "OAB", desc: "Preparação para o exame" },
  { value: "faculdade_oab", label: "Faculdade + OAB", desc: "Equilibrar os dois" },
  { value: "concurso", label: "Concurso", desc: "Carreira pública" },
];

function OnboardingPage() {
  const navigate = useNavigate();
  const { setUser, addSubject, addTask } = useStore();
  const [step, setStep] = useState(0);

  const [semestre, setSemestre] = useState<number>(3);
  const [trabalhaEstagia, setTrabalhaEstagia] = useState<boolean | null>(null);
  const [horasSemana, setHorasSemana] = useState<number>(10);
  const [selecionadas, setSelecionadas] = useState<string[]>([]);
  const [objetivo, setObjetivo] = useState<Goal | null>(null);

  const steps = ["Semestre", "Rotina", "Horas", "Disciplinas", "Objetivo"];

  function toggleDisc(id: string) {
    setSelecionadas((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function canAdvance() {
    if (step === 0) return semestre > 0;
    if (step === 1) return trabalhaEstagia !== null;
    if (step === 2) return horasSemana > 0;
    if (step === 3) return selecionadas.length > 0;
    if (step === 4) return objetivo !== null;
    return false;
  }

  function finish() {
    if (!objetivo) return;
    setUser({
      semestre,
      trabalhaEstagia: trabalhaEstagia ?? false,
      horasSemana,
      objetivo,
      onboardingCompleto: true,
    });
    // Cria disciplinas
    const created = selecionadas.map((catId) => {
      const cat = SUBJECT_CATALOG.find((c) => c.id === catId)!;
      return addSubject({ nome: cat.nome, cor: cat.cor, catalogId: cat.id });
    });

    // Auto-popula a semana com sugestões dos primeiros temas do currículo
    const today = new Date();
    today.setHours(9, 0, 0, 0);
    let dayOffset = 1; // começa amanhã

    created.forEach((s) => {
      const cat = SUBJECT_CATALOG.find((c) => c.id === s.catalogId);
      const themes = getInitialThemes(cat?.id ?? "", 2);
      if (themes.length === 0) {
        addTask({
          titulo: `Definir prioridades de ${s.nome}`,
          tipo: "estudo",
          subjectId: s.id,
          prioridade: "media",
        });
        return;
      }
      themes.forEach((theme, idx) => {
        const prazo = new Date(today);
        prazo.setDate(prazo.getDate() + dayOffset);
        dayOffset = (dayOffset % 6) + 1; // distribui ao longo da semana
        addTask({
          titulo: `Estudar: ${theme.nome}`,
          descricao: `Microtemas: ${theme.microthemes.slice(0, 3).map((m) => m.nome).join(" · ")}`,
          tipo: idx === 0 ? "estudo" : "leitura",
          subjectId: s.id,
          prazo: prazo.toISOString(),
          prioridade: idx === 0 ? "alta" : "media",
          estimativaHoras: 2,
        });
      });
    });
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-8 md:py-16">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-base font-semibold">Organiza Direito</div>
            <div className="text-xs text-muted-foreground">Vamos preparar o seu ambiente em 1 minuto.</div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8 flex items-center gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <Card className="flex-1 p-6 md:p-8">
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Em qual semestre você está?</h2>
                <p className="mt-1 text-sm text-muted-foreground">Isso ajuda a sugerir disciplinas comuns.</p>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setSemestre(n)}
                    className={`rounded-lg border py-3 text-sm font-medium transition-colors ${
                      semestre === n
                        ? "border-primary bg-primary-soft text-accent-foreground"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {n}º
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Você trabalha ou faz estágio?</h2>
                <p className="mt-1 text-sm text-muted-foreground">Usamos para calibrar a carga de estudos.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: true, label: "Sim" },
                  { value: false, label: "Não" },
                ].map((o) => (
                  <button
                    key={String(o.value)}
                    onClick={() => setTrabalhaEstagia(o.value)}
                    className={`rounded-xl border p-6 text-left transition-colors ${
                      trabalhaEstagia === o.value
                        ? "border-primary bg-primary-soft"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <div className="text-lg font-semibold">{o.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Quantas horas por semana?</h2>
                <p className="mt-1 text-sm text-muted-foreground">Seja realista. Você pode ajustar depois.</p>
              </div>
              <div className="flex items-end gap-3">
                <Input
                  type="number"
                  min={1}
                  max={80}
                  value={horasSemana}
                  onChange={(e) => setHorasSemana(Number(e.target.value))}
                  className="h-14 max-w-32 text-2xl font-semibold"
                />
                <Label className="pb-3 text-sm text-muted-foreground">horas / semana</Label>
              </div>
              <div className="flex flex-wrap gap-2">
                {[5, 10, 15, 20, 30].map((h) => (
                  <button
                    key={h}
                    onClick={() => setHorasSemana(h)}
                    className="rounded-full border border-border px-3 py-1 text-xs hover:bg-muted"
                  >
                    {h}h
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Quais disciplinas você cursa?</h2>
                <p className="mt-1 text-sm text-muted-foreground">Marque as que estão no seu semestre atual.</p>
              </div>
              <div className="grid max-h-[50vh] grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
                {SUBJECT_CATALOG.map((s) => {
                  const active = selecionadas.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleDisc(s.id)}
                      className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                        active ? "border-primary bg-primary-soft" : "border-border hover:bg-muted"
                      }`}
                    >
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: s.cor }} />
                      <span className="flex-1 text-sm font-medium">{s.nome}</span>
                      {active && <Check className="h-4 w-4 text-primary" />}
                    </button>
                  );
                })}
              </div>
              <div className="text-xs text-muted-foreground">{selecionadas.length} selecionada(s)</div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Qual seu objetivo agora?</h2>
                <p className="mt-1 text-sm text-muted-foreground">Você pode mudar mais tarde nos Ajustes.</p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {GOALS.map((g) => {
                  const active = objetivo === g.value;
                  return (
                    <button
                      key={g.value}
                      onClick={() => setObjetivo(g.value)}
                      className={`rounded-xl border p-4 text-left transition-colors ${
                        active ? "border-primary bg-primary-soft" : "border-border hover:bg-muted"
                      }`}
                    >
                      <div className="text-base font-semibold">{g.label}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{g.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </Card>

        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Voltar
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canAdvance()}>
              Continuar
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={finish} disabled={!canAdvance()}>
              Começar
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
