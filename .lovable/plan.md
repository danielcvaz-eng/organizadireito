# Organiza Direito → Planejador Automático

Objetivo: deixar de ser agenda manual. O aluno recebe um plano pronto baseado em microtemas, prioridades e revisões espaçadas.

---

## 1. Novo modelo de dados (src/lib/types.ts)

Adicionar:

- `MicroThemeStatus`: `"nao_iniciado" | "superficial" | "revisar" | "dominado"`
- `MicroThemeProgress`: `{ subjectId, microthemeId, themeId, moduleId, status, peso, ultimaRevisao?, proximaRevisao? }`
- `Task.origem`: `"ciclo" | "revisao" | "manual" | "avaliacao"`
- `Task.microthemeRef?: { subjectId, microthemeId }`
- `Task.intervaloRevisao?: 1 | 7 | 30` (quando origem = revisao)
- `Subject.subjectOnboardingCompleto: boolean`
- `Subject.dificuldade: "facil" | "media" | "dificil"` (default "media")
- `AppState.microthemeProgress: MicroThemeProgress[]`

Store ganha: `setMicrothemeStatus`, `getProgress`, `generateWeeklyCycle`, `generateRevisions(microthemeRef, completedAt)`.

---

## 2. Algoritmo do Ciclo de Estudos (src/lib/planner.ts — novo)

Função `generateWeeklyCycle(state) → Task[]`:

1. Calcular peso de cada microtema:
   - status `nao_iniciado` → 4
   - `superficial` → 2
   - `revisar` → 1
   - `dominado` → 0 (só entra em revisão espaçada)
   - +2 se a disciplina tem avaliação nos próximos 14 dias
   - +1 se disciplina marcada como "dificil"
2. Ordenar microtemas por peso desc.
3. Distribuir nos `horasSemana` (slot = 1h) entre os 7 dias, intercalando disciplinas (round-robin pesado) para evitar repetir a mesma disciplina dois slots seguidos.
4. Gerar `Task` com `origem: "ciclo"`, `prazo` no dia do slot, `estimativaHoras: 1`, `microthemeRef`.

Função `generateRevisions(ref, completedAtISO) → Task[]`:
- Cria três tasks `origem: "revisao"` com prazos D+1, D+7, D+30 e `intervaloRevisao` respectivo.

Função `regenerateUpcomingCycle(state)`:
- Remove tasks futuras com `origem: "ciclo"` ainda `pendente` e regenera com base no estado atual (chamada após mudanças de status, conclusão, nova avaliação).

---

## 3. Revisões automáticas (store)

- `toggleTaskDone` em task de ciclo com `microthemeRef`: ao marcar feito, chamar `generateRevisions(ref, hoje)` e mudar status do microtema para `superficial`→`revisar`/`revisar`→`dominado` (uma etapa adiante).
- `toggleMicrotheme` é substituído por `setMicrothemeStatus(subjectId, microthemeId, status)`.

---

## 4. Onboarding global atualizado (src/routes/onboarding.tsx)

- Remover o seed manual de duas tasks por disciplina.
- Ao final: para cada disciplina criada marcar `subjectOnboardingCompleto: false`. Não pré-popular tarefas.
- Após `finish()`, navegar para `/disciplinas/$id` da primeira disciplina sem onboarding completo (continuar fluxo).

---

## 5. Novo onboarding por disciplina (src/components/SubjectMicrothemeOnboarding.tsx)

Disparado quando o usuário entra na disciplina e `subjectOnboardingCompleto === false`.

- Tela cheia (Dialog grande) com **checklist tabular**: linhas = microtemas (agrupados por módulo/tema, colapsáveis), 4 botões por linha (Nunca / Superficial / Revisar / Seguro), com cores e ícones.
- Default: "Nunca estudei".
- Botão "Salvar e gerar meu plano" → grava todos, marca `subjectOnboardingCompleto = true`, chama `regenerateUpcomingCycle`, fecha e navega para `/`.
- Botão secundário "Marcar tudo como nunca estudei" para acelerar.

---

## 6. Minha Semana (src/routes/index.tsx) — reescrita

Estrutura:

- **Hoje**: tasks com prazo = hoje, agrupadas por slot horário (ou lista), badge de origem (Ciclo / Revisão).
- **Próximos dias**: lista cronológica até domingo, agrupada por dia.
- **Revisões pendentes**: seção própria, apenas tasks `origem: "revisao"`.
- **Avaliações próximas**: assessments nos próximos 14 dias.
- Header: barra de progresso da semana + botão "Regerar plano da semana".
- Empty state só aparece se não houver disciplinas (CTA → onboarding).

---

## 7. Tela Disciplina (src/routes/disciplinas.$id.tsx)

- Acima do currículo: barra de progresso por **módulo** (% de microtemas com status `dominado`).
- Em cada microtema: badge de status colorido (🟢 dominado, 🟡 superficial/revisar, 🔴 nao_iniciado) + menu para mudar status manualmente.
- Botão "Refazer onboarding desta disciplina".
- Tabs Tarefas / Leituras / Avaliações mantidas.

---

## 8. Calendário (src/routes/calendario.tsx) + AddTaskDialog

- Corrigir AddTaskDialog: substituir input nativo de data pelo `Calendar` shadcn em Popover, permitindo qualquer data (passada/futura).
- Calendário mensal exibe tasks de ciclo, revisões e avaliações com cores distintas.

---

## 9. Arquivos afetados

Novos:
- `src/lib/planner.ts`
- `src/components/SubjectMicrothemeOnboarding.tsx`

Editados:
- `src/lib/types.ts`, `src/lib/store.tsx`
- `src/routes/onboarding.tsx`, `src/routes/index.tsx`, `src/routes/disciplinas.$id.tsx`, `src/routes/calendario.tsx`
- `src/components/AddTaskDialog.tsx`

Sem login/IA/integrações — tudo localStorage.

---

## Notas técnicas

- Migração leve do localStorage: ao hidratar, se `microthemeProgress` não existir, inicializar `[]`; manter compatibilidade dos campos antigos (`completedMicrothemes` fica obsoleto mas não quebra).
- Regeneração do ciclo é idempotente: só remove tasks `origem: "ciclo"` com status `pendente` e prazo ≥ hoje.
- Limites para evitar excesso: máx. `horasSemana` slots/semana, máx. 3 slots por dia.

Pronto para implementar após sua aprovação.
