import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/lib/store";
import type { Priority, TaskType } from "@/lib/types";
import { Plus } from "lucide-react";

const TYPES: { value: TaskType; label: string }[] = [
  { value: "leitura", label: "Leitura" },
  { value: "trabalho", label: "Trabalho" },
  { value: "seminario", label: "Seminário" },
  { value: "estudo", label: "Estudo" },
  { value: "outro", label: "Outro" },
];

export function AddTaskDialog({
  defaultSubjectId,
  trigger,
}: {
  defaultSubjectId?: string;
  trigger?: React.ReactNode;
}) {
  const { state, addTask } = useStore();
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState<TaskType>("estudo");
  const [subjectId, setSubjectId] = useState<string>(defaultSubjectId ?? "none");
  const [prazo, setPrazo] = useState<string>("");
  const [prioridade, setPrioridade] = useState<Priority>("media");

  function submit() {
    if (!titulo.trim()) return;
    addTask({
      titulo: titulo.trim(),
      descricao: descricao.trim() || undefined,
      tipo,
      subjectId: subjectId === "none" ? undefined : subjectId,
      prazo: prazo || undefined,
      prioridade,
    });
    setTitulo("");
    setDescricao("");
    setPrazo("");
    setPrioridade("media");
    setTipo("estudo");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="mr-1 h-4 w-4" />
            Nova tarefa
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova tarefa</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="titulo">O que precisa ser feito?</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Ler capítulo 3 — Princípios constitucionais"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <Select value={tipo} onValueChange={(v) => setTipo(v as TaskType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Disciplina</Label>
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem disciplina</SelectItem>
                  {state.subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prazo">Prazo</Label>
              <Input id="prazo" type="date" value={prazo} onChange={(e) => setPrazo(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Prioridade</Label>
              <Select value={prioridade} onValueChange={(v) => setPrioridade(v as Priority)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="descricao">Notas (opcional)</Label>
            <Textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={submit}>Adicionar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
