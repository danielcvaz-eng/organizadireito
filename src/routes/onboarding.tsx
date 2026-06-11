import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Sparkles, Check, ArrowRight, ArrowLeft, Plus, X } from "lucide-react";
import { useStore } from "@/lib/store";
import {
  getDisciplinesBySemester,
  suggestColor,
  type SemesterDiscipline,
} from "@/data/semesterCurriculum";

import type { Goal, EstagioHoras } from "@/lib/types";

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

interface ExtraDiscipline {
  tempId: string;
  nome: string;
  cor: string;
}

function OnboardingPage() {
  const navigate = useNavigate();
  const { setUser, addSubject } = useStore();
  const [step, setStep] = useState(0);

  const [semestre, setSemestre] = useState<number>(3);
  const [trabalhaEstagia, setTrabalhaEstagia] = useState<boolean | null>(null);
  const [estagioHoras, setEstagioHoras] = useState<EstagioHoras | null>(null);
  const [horasSemana, setHorasSemana] = useState<number>(10);
  const [selecionadas, setSelecionadas] = useState<string[]>([]);
  const [extras, setExtras] = useState<ExtraDiscipline[]>([]);
  const [extraNome, setExtraNome] = useState("");
  const [objetivo, setObjetivo] = useState<Goal | null>(null);

  const steps = ["Semestre", "Rotina", "Horas", "Disciplinas", "Objetivo"];

  const disciplinasDoSemestre = useMemo<SemesterDiscipline[]>(
    () => getDisciplinesBySemester(semestre),
    [semestre],
  );

  function toggleDisc(id: string) {
    setSelecionadas((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function addExtra() {
    const nome = extraNome.trim();
    if (!nome) return;
    setExtras((e) => [
      ...e,
      { tempId: `extra-${Date.now()}`, nome, cor: suggestColor(nome) },
    ]);
    setExtraNome("");
  }

  function removeExtra(tempId: string) {
    setExtras((e) => e.filter((x) => x.tempId !== tempId));
  }

  function canAdvance() {
    if (step === 0) return semestre > 0;
    if (step === 1) {
      if (trabalhaEstagia === null) return false;
      if (trabalhaEstagia === true && estagioHoras === null) return false;
      return true;
    }
    if (step === 2) return horasSemana > 0;
    if (step === 3) return selecionadas.length + extras.length > 0;
    if (step === 4) return objetivo !== null;
    return false;
  }

  function finish() {
    if (!objetivo) return;
    setUser({
      semestre,
      trabalhaEstagia: trabalhaEstagia ?? false,
      estagioHoras: trabalhaEstagia ? estagioHoras ?? undefined : undefined,
      horasSemana,
      objetivo,
      onboardingCompleto: true,
    });

    const created = [
      ...selecionadas.map((id) => {
        const cur = disciplinasDoSemestre.find((d) => d.id === id)!;
        return addSubject({
          nome: cur.nome,
          cor: cur.cor,
          catalogId: cur.catalogId,
          // Sem currículo de microtemas? Já marca o diagnóstico como concluído.
          subjectOnboardingCompleto: !cur.catalogId,
          dificuldade: "media",
        });
      }),
      ...extras.map((e) =>
        addSubject({
          nome: e.nome,
          cor: e.cor,
          subjectOnboardingCompleto: true,
          dificuldade: "media",
        }),
      ),
    ];

    // Vai para a primeira disciplina que ainda precisa de diagnóstico;
    // se nenhuma precisar, vai para a home.
    const precisaDiagnostico = created.find((s) => !s.subjectOnboardingCompleto);
    if (precisaDiagnostico) {
      navigate({ to: "/disciplinas/$id", params: { id: precisaDiagnostico.id } });
    } else {
      navigate({ to: "/" });
    }
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
                <p className="mt-1 text-sm text-muted-foreground">
                  Vamos mostrar as disciplinas desse semestre como sugestão inicial.
                </p>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => {
                      setSemestre(n);
                      setSelecionadas([]);
                    }}
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
                    type="button"
                    onClick={() => {
                      setTrabalhaEstagia(o.value);
                      if (!o.value) setEstagioHoras(null);
                    }}
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

              {trabalhaEstagia === true && (
                <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
                  <div>
                    <div className="text-sm font-semibold">Quantas horas por dia?</div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Vamos calibrar a carga de estudos para a sua rotina real.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "ate4" as const, label: "Até 4 horas" },
                      { value: "mais4" as const, label: "Mais de 4 horas" },
                    ].map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => setEstagioHoras(o.value)}
                        className={`rounded-lg border p-3 text-left text-sm font-medium transition-colors ${
                          estagioHoras === o.value
                            ? "border-primary bg-primary-soft"
                            : "border-border bg-background hover:bg-muted"
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
                    type="button"
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
                <h2 className="text-2xl font-semibold tracking-tight">
                  Disciplinas do {semestre}º semestre
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Marque apenas as que você está cursando agora. Você pode adicionar outras abaixo.
                </p>
              </div>

              <div className="grid max-h-[40vh] grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
                {disciplinasDoSemestre.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Não há disciplinas cadastradas para este semestre. Adicione manualmente abaixo.
                  </p>
                )}
                {disciplinasDoSemestre.map((s) => {
                  const active = selecionadas.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleDisc(s.id)}
                      className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                        active ? "border-primary bg-primary-soft" : "border-border hover:bg-muted"
                      }`}
                    >
                      <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: s.cor }} />
                      <span className="flex-1 text-sm font-medium leading-snug">{s.nome}</span>
                      {active && <Check className="h-4 w-4 shrink-0 text-primary" />}
                    </button>
                  );
                })}
              </div>

              <div className="rounded-lg border border-dashed border-border p-3">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Adicionar disciplina extra
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex.: Direito Eleitoral"
                    value={extraNome}
                    onChange={(e) => setExtraNome(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addExtra();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addExtra}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {extras.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {extras.map((e) => (
                      <span
                        key={e.tempId}
                        className="flex items-center gap-2 rounded-full border border-border bg-muted px-2.5 py-1 text-xs"
                      >
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: e.cor }} />
                        {e.nome}
                        <button
                          type="button"
                          onClick={() => removeExtra(e.tempId)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-xs text-muted-foreground">
                {selecionadas.length + extras.length} disciplina(s) selecionada(s)
              </div>
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
                      type="button"
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
