import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Trash2, BookOpen, FileText, Presentation, Target } from "lucide-react";
import { useStore, formatDate, daysUntil } from "@/lib/store";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { AddAssessmentDialog } from "@/components/AddAssessmentDialog";

export const Route = createFileRoute("/disciplinas/$id")({
  component: DisciplinaDetail,
});

const TYPE_ICON = {
  leitura: BookOpen,
  trabalho: FileText,
  seminario: Presentation,
  estudo: Target,
  outro: Target,
} as const;

function DisciplinaDetail() {
  const { id } = Route.useParams();
  const { state, hydrated, addTopic, toggleTopic, removeTopic, toggleTaskDone, removeTask, removeAssessment, removeSubject } = useStore();
  const navigate = useNavigate();
  const subject = state.subjects.find((s) => s.id === id);
  const [novoTopico, setNovoTopico] = useState("");

  useEffect(() => {
    if (hydrated && !subject) navigate({ to: "/disciplinas" });
  }, [hydrated, subject, navigate]);

  if (!subject) return null;

  const topicos = state.topics.filter((t) => t.subjectId === id).sort((a, b) => a.ordem - b.ordem);
  const tarefas = state.tasks.filter((t) => t.subjectId === id);
  const leituras = tarefas.filter((t) => t.tipo === "leitura");
  const avaliacoes = state.assessments
    .filter((a) => a.subjectId === id)
    .sort((a, b) => a.data.localeCompare(b.data));

  const doneTopics = topicos.filter((t) => t.concluido).length;
  const progressoTopicos = topicos.length === 0 ? 0 : Math.round((doneTopics / topicos.length) * 100);

  return (
    <AppShell>
      <div className="mb-4">
        <Link to="/disciplinas" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Disciplinas
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="h-10 w-2 rounded-full" style={{ backgroundColor: subject.cor }} />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{subject.nome}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {tarefas.length} tarefa(s) · {topicos.length} tópico(s) · {avaliacoes.length} avaliação(ões)
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <AddTaskDialog defaultSubjectId={id} />
          <AddAssessmentDialog defaultSubjectId={id} />
        </div>
      </div>

      <Card className="mb-6 p-5">
        <div className="flex items-baseline justify-between">
          <div className="text-sm text-muted-foreground">Progresso dos tópicos</div>
          <div className="text-sm font-medium">{progressoTopicos}%</div>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full" style={{ width: `${progressoTopicos}%`, backgroundColor: subject.cor }} />
        </div>
      </Card>

      <Tabs defaultValue="tarefas" className="w-full">
        <TabsList>
          <TabsTrigger value="tarefas">Tarefas</TabsTrigger>
          <TabsTrigger value="topicos">Tópicos</TabsTrigger>
          <TabsTrigger value="leituras">Leituras</TabsTrigger>
          <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
        </TabsList>

        <TabsContent value="tarefas" className="mt-4">
          {tarefas.length === 0 ? (
            <EmptyState text="Nenhuma tarefa por aqui ainda." />
          ) : (
            <Card className="divide-y divide-border p-0">
              {tarefas.map((t) => {
                const Icon = TYPE_ICON[t.tipo];
                const done = t.status === "feito";
                return (
                  <div key={t.id} className="flex items-center gap-3 px-4 py-3">
                    <Checkbox checked={done} onCheckedChange={() => toggleTaskDone(t.id)} />
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className={`truncate text-sm font-medium ${done ? "line-through text-muted-foreground" : ""}`}>
                        {t.titulo}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t.tipo} · {formatDate(t.prazo)}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeTask(t.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </Card>
          )}
        </TabsContent>

        <TabsContent value="topicos" className="mt-4">
          <Card className="p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!novoTopico.trim()) return;
                addTopic({ subjectId: id, titulo: novoTopico.trim() });
                setNovoTopico("");
              }}
              className="flex gap-2"
            >
              <Input
                value={novoTopico}
                onChange={(e) => setNovoTopico(e.target.value)}
                placeholder="Novo tópico (ex: Controle de constitucionalidade)"
              />
              <Button type="submit">
                <Plus className="h-4 w-4" />
              </Button>
            </form>
          </Card>
          {topicos.length === 0 ? (
            <div className="mt-4"><EmptyState text="Liste aqui o que precisa ser estudado nesta disciplina." /></div>
          ) : (
            <Card className="mt-4 divide-y divide-border p-0">
              {topicos.map((t) => (
                <div key={t.id} className="flex items-center gap-3 px-4 py-3">
                  <Checkbox checked={t.concluido} onCheckedChange={() => toggleTopic(t.id)} />
                  <span className={`flex-1 text-sm ${t.concluido ? "text-muted-foreground line-through" : ""}`}>
                    {t.titulo}
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => removeTopic(t.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </Card>
          )}
        </TabsContent>

        <TabsContent value="leituras" className="mt-4">
          {leituras.length === 0 ? (
            <EmptyState text="Adicione uma tarefa do tipo Leitura para vê-la aqui." />
          ) : (
            <Card className="divide-y divide-border p-0">
              {leituras.map((t) => (
                <div key={t.id} className="flex items-center gap-3 px-4 py-3">
                  <Checkbox checked={t.status === "feito"} onCheckedChange={() => toggleTaskDone(t.id)} />
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{t.titulo}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(t.prazo)}</div>
                  </div>
                </div>
              ))}
            </Card>
          )}
        </TabsContent>

        <TabsContent value="avaliacoes" className="mt-4">
          {avaliacoes.length === 0 ? (
            <EmptyState text="Cadastre provas, trabalhos e seminários para acompanhá-los." />
          ) : (
            <Card className="divide-y divide-border p-0">
              {avaliacoes.map((a) => {
                const dias = daysUntil(a.data);
                return (
                  <div key={a.id} className="flex items-center gap-3 px-4 py-3">
                    <span className="rounded-md bg-primary-soft px-2 py-0.5 text-xs font-medium capitalize text-accent-foreground">
                      {a.tipo}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{a.titulo}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(a.data).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "long" })}
                        {a.peso ? ` · peso ${a.peso}` : ""}
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        dias < 0
                          ? "bg-muted text-muted-foreground"
                          : dias <= 3
                            ? "bg-destructive/10 text-destructive"
                            : dias <= 7
                              ? "bg-warning/15 text-warning-foreground"
                              : "bg-muted text-muted-foreground"
                      }
                    >
                      {dias < 0 ? "passou" : dias === 0 ? "hoje" : `${dias}d`}
                    </Badge>
                    <Button variant="ghost" size="icon" onClick={() => removeAssessment(a.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-10 border-t border-border pt-6">
        <Button
          variant="ghost"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => {
            if (confirm(`Remover ${subject.nome}? Todas as tarefas, tópicos e avaliações dessa disciplina serão apagados.`)) {
              removeSubject(subject.id);
              navigate({ to: "/disciplinas" });
            }
          }}
        >
          <Trash2 className="mr-1 h-4 w-4" /> Remover disciplina
        </Button>
      </div>
    </AppShell>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <Card className="p-8 text-center">
      <p className="text-sm text-muted-foreground">{text}</p>
    </Card>
  );
}
