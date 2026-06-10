import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import type { MicroThemeStatus } from "@/lib/types";
import { getCurriculum } from "@/data/legalCurriculum";
import { Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTIONS: { value: MicroThemeStatus; label: string; short: string; color: string }[] = [
  { value: "nao_iniciado", label: "Nunca estudei", short: "Nunca", color: "bg-red-100 text-red-700 border-red-200" },
  { value: "superficial", label: "Vi superficialmente", short: "Vi", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { value: "revisar", label: "Já estudei, preciso revisar", short: "Revisar", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "dominado", label: "Estou seguro", short: "Seguro", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
];

export function SubjectMicrothemeOnboarding({
  open,
  onOpenChange,
  subjectId,
  onDone,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  subjectId: string;
  onDone?: () => void;
}) {
  const { state, bulkSetMicrothemeStatuses, completeSubjectOnboarding } = useStore();
  const subject = state.subjects.find((s) => s.id === subjectId);
  const curriculum = subject ? getCurriculum(subject.catalogId) : undefined;

  const initial = useMemo(() => {
    const map: Record<string, MicroThemeStatus> = {};
    if (!curriculum) return map;
    for (const mod of curriculum.modules) {
      for (const theme of mod.themes) {
        for (const m of theme.microthemes) {
          const existing = state.microthemeProgress.find(
            (p) => p.subjectId === subjectId && p.microthemeId === m.id,
          );
          map[m.id] = existing?.status ?? "nao_iniciado";
        }
      }
    }
    return map;
  }, [curriculum, state.microthemeProgress, subjectId]);

  const [statuses, setStatuses] = useState<Record<string, MicroThemeStatus>>(initial);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  if (!subject || !curriculum) return null;

  function setAll(value: MicroThemeStatus) {
    const next: Record<string, MicroThemeStatus> = {};
    for (const id of Object.keys(initial)) next[id] = value;
    setStatuses(next);
  }

  function setMicro(id: string, v: MicroThemeStatus) {
    setStatuses((s) => ({ ...s, [id]: v }));
  }

  function save() {
    const entries = Object.entries(statuses).map(([microthemeId, status]) => ({
      microthemeId,
      status,
    }));
    bulkSetMicrothemeStatuses(subjectId, entries);
    completeSubjectOnboarding(subjectId);
    onOpenChange(false);
    onDone?.();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: subject.cor }} />
            Diagnóstico de {subject.nome}
          </DialogTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Marque rapidamente seu nível em cada microtema. Vamos usar isso para gerar o seu plano de estudos.
          </p>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/30 px-6 py-3 text-xs">
          <span className="font-medium text-muted-foreground">Marcar tudo como:</span>
          {OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => setAll(o.value)}
              className={cn("rounded-full border px-2.5 py-1 transition-colors hover:opacity-80", o.color)}
            >
              {o.short}
            </button>
          ))}
        </div>

        <div className="max-h-[55vh] space-y-3 overflow-y-auto px-6 py-4">
          {curriculum.modules.map((mod) => {
            const isCollapsed = collapsed[mod.id];
            return (
              <Card key={mod.id} className="overflow-hidden p-0">
                <button
                  type="button"
                  onClick={() => setCollapsed((c) => ({ ...c, [mod.id]: !c[mod.id] }))}
                  className="flex w-full items-center gap-2 border-b border-border bg-muted/40 px-4 py-2.5 text-left hover:bg-muted/60"
                >
                  <ChevronRight
                    className={cn("h-4 w-4 text-muted-foreground transition-transform", !isCollapsed && "rotate-90")}
                  />
                  <span className="text-sm font-semibold">{mod.nome}</span>
                </button>
                {!isCollapsed && (
                  <div className="divide-y divide-border">
                    {mod.themes.map((theme) => (
                      <div key={theme.id} className="px-4 py-3">
                        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {theme.nome}
                        </div>
                        <ul className="space-y-2">
                          {theme.microthemes.map((m) => (
                            <li
                              key={m.id}
                              className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                            >
                              <span className="text-sm">{m.nome}</span>
                              <div className="flex flex-wrap gap-1">
                                {OPTIONS.map((o) => {
                                  const active = statuses[m.id] === o.value;
                                  return (
                                    <button
                                      key={o.value}
                                      onClick={() => setMicro(m.id, o.value)}
                                      className={cn(
                                        "rounded-md border px-2 py-1 text-[11px] font-medium transition-all",
                                        active ? o.color + " ring-2 ring-offset-1 ring-current/40" : "border-border bg-background text-muted-foreground hover:bg-muted",
                                      )}
                                    >
                                      {o.short}
                                    </button>
                                  );
                                })}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <DialogFooter className="gap-2 border-t border-border px-6 py-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Depois
          </Button>
          <Button onClick={save}>
            <Sparkles className="mr-1 h-4 w-4" />
            Gerar meu plano
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
