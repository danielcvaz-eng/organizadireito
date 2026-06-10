import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/lib/store";
import type { Goal } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/ajustes")({
  head: () => ({
    meta: [
      { title: "Ajustes — Organiza Direito" },
      { name: "description", content: "Configure seu semestre, rotina e objetivo." },
    ],
  }),
  component: AjustesPage,
});

function AjustesPage() {
  const { state, hydrated, setUser, resetAll } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && !state.user?.onboardingCompleto) navigate({ to: "/onboarding" });
  }, [hydrated, state.user, navigate]);

  const [semestre, setSemestre] = useState(state.user?.semestre ?? 1);
  const [horas, setHoras] = useState(state.user?.horasSemana ?? 10);
  const [trabalha, setTrabalha] = useState(state.user?.trabalhaEstagia ?? false);
  const [objetivo, setObjetivo] = useState<Goal>(state.user?.objetivo ?? "faculdade");

  useEffect(() => {
    if (state.user) {
      setSemestre(state.user.semestre);
      setHoras(state.user.horasSemana);
      setTrabalha(state.user.trabalhaEstagia);
      setObjetivo(state.user.objetivo);
    }
  }, [state.user]);

  function salvar() {
    setUser({
      semestre,
      horasSemana: horas,
      trabalhaEstagia: trabalha,
      objetivo,
      onboardingCompleto: true,
    });
    toast.success("Ajustes salvos");
  }

  return (
    <AppShell>
      <SectionHeader title="Ajustes" subtitle="Mantenha seus dados em dia." />
      <Card className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Semestre</Label>
            <Input type="number" min={1} max={12} value={semestre} onChange={(e) => setSemestre(Number(e.target.value))} />
          </div>
          <div className="space-y-1.5">
            <Label>Horas / semana</Label>
            <Input type="number" min={1} max={80} value={horas} onChange={(e) => setHoras(Number(e.target.value))} />
          </div>
          <div className="space-y-1.5">
            <Label>Trabalha ou estagia?</Label>
            <Select value={trabalha ? "sim" : "nao"} onValueChange={(v) => setTrabalha(v === "sim")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Objetivo</Label>
            <Select value={objetivo} onValueChange={(v) => setObjetivo(v as Goal)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="faculdade">Faculdade</SelectItem>
                <SelectItem value="oab">OAB</SelectItem>
                <SelectItem value="faculdade_oab">Faculdade + OAB</SelectItem>
                <SelectItem value="concurso">Concurso</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={salvar}>Salvar</Button>
        </div>
      </Card>

      <Card className="mt-6 border-destructive/30 p-6">
        <div className="text-sm font-semibold text-destructive">Zona de risco</div>
        <p className="mt-1 text-sm text-muted-foreground">
          Apagar todos os dados e refazer o onboarding. Esta ação não pode ser desfeita.
        </p>
        <Button
          variant="outline"
          className="mt-4 border-destructive/40 text-destructive hover:bg-destructive/10"
          onClick={() => {
            if (confirm("Apagar tudo e recomeçar?")) {
              resetAll();
              navigate({ to: "/onboarding" });
            }
          }}
        >
          Apagar tudo
        </Button>
      </Card>
    </AppShell>
  );
}
