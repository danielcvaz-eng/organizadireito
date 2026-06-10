# Organiza Direito — Validação antes da implementação

Vou apresentar abaixo a arquitetura, jornada, dados e escopo do MVP. **Nada será codado até você aprovar.**

---

## 1. Arquitetura do produto (telas e função)

### Telas do MVP

1. **Onboarding (`/onboarding`)**
   - Função: capturar contexto mínimo do aluno (semestre, rotina, horas/semana, disciplinas atuais, objetivo) e gerar o ambiente inicial automaticamente.
   - Saída: cria disciplinas selecionadas, define carga semanal e leva direto para "Minha Semana".

2. **Minha Semana (`/`) — tela principal**
   - Função: responder diariamente *"o que eu preciso fazer esta semana para não me enrolar?"*.
   - Mostra prioridades da semana, leituras pendentes, trabalhos pendentes, prazos próximos, disciplinas em risco e barra de progresso semanal.
   - É o "home" pós-onboarding. Todo o resto orbita aqui.

3. **Disciplinas (`/disciplinas`)**
   - Lista das disciplinas do semestre com progresso e próximos compromissos.
   - **Detalhe da disciplina (`/disciplinas/$id`)**: tópicos, tarefas, leituras, avaliações e progresso da matéria.

4. **Calendário Acadêmico (`/calendario`)**
   - Visão mensal/semanal de provas, trabalhos, seminários, leituras obrigatórias e eventos, com cores por categoria/disciplina.

5. **Dashboard do Semestre (`/semestre`)**
   - Visão macro: disciplinas, progresso geral, próximas provas, próximos trabalhos e metas. Pouco gráfico, muita clareza.

6. **Ajustes (`/ajustes`)** *(mínimo)*
   - Editar semestre, horas/semana, objetivo, disciplinas ativas.

### Como elas se conectam

```text
            ┌──────────────┐
            │  Onboarding  │  (1ª vez apenas)
            └──────┬───────┘
                   ▼
         ┌───────────────────┐
         │   Minha Semana    │◄─── home recorrente
         └───┬───────┬───────┘
             │       │
   ┌─────────┘       └──────────┐
   ▼                            ▼
┌──────────────┐         ┌──────────────┐
│ Disciplinas  │◄───────►│  Calendário  │
│  /detalhe    │         │  Acadêmico   │
└──────┬───────┘         └──────┬───────┘
       └────────┬───────────────┘
                ▼
        ┌───────────────┐
        │  Dashboard do │
        │   Semestre    │
        └───────────────┘
```

Tarefas, leituras e avaliações **são criadas dentro da disciplina** e aparecem automaticamente em Minha Semana e no Calendário — uma única fonte de verdade.

---

## 2. Fluxo do usuário

**Primeiro acesso**
1. Abre o app → tela de boas-vindas curta.
2. Onboarding em 5 passos (semestre → trabalho/estágio → horas/semana → disciplinas → objetivo).
3. Sistema gera disciplinas, define carga e cria a primeira "semana".

**Configuração inicial (sem fricção)**
- Disciplinas vêm pré-cadastradas do catálogo jurídico; o aluno só marca as que cursa.
- Nenhum formulário obrigatório além do onboarding.

**Primeira semana**
- Home = Minha Semana já populada com sugestões de leitura/estudo baseadas nas disciplinas e horas/semana.
- Aluno adiciona 1ª prova ou trabalho real → vê aparecer em Minha Semana e no Calendário.

**Uso contínuo (rotina)**
- Abrir o app → olhar Minha Semana → marcar itens como feitos → adicionar novo prazo quando o professor anunciar → conferir Calendário antes de provas → revisar Dashboard no fim do semestre.

---

## 3. Estrutura de dados

### Entidades

- **user** — id, nome, email, semestre, trabalha/estagia (bool), horas_semana, objetivo (`faculdade` | `oab` | `faculdade_oab` | `concurso`), onboarding_completo.
- **subject_catalog** — catálogo fixo de disciplinas jurídicas comuns (semente).
- **subject** — disciplina ativa do aluno: id, user_id, catalog_id (opcional), nome, cor, semestre.
- **topic** — tópico dentro de uma disciplina: id, subject_id, titulo, ordem, concluido.
- **task** — tarefa genérica: id, user_id, subject_id (opcional), tipo (`leitura` | `trabalho` | `seminario` | `estudo` | `outro`), titulo, descricao, prazo, prioridade, status (`pendente` | `fazendo` | `feito`), estimativa_horas.
- **reading** — leitura obrigatória: id, subject_id, titulo, fonte, paginas, prazo, status. *(pode ser modelada como `task` tipo `leitura`; ver nota técnica)*
- **assessment** — avaliação: id, subject_id, tipo (`prova` | `trabalho` | `seminario`), titulo, data, peso, nota (opcional).
- **event** — evento de calendário derivado: id, user_id, subject_id (opcional), titulo, inicio, fim, categoria, origem (`task` | `assessment` | `manual`).

### Relacionamentos

```text
user 1───* subject 1───* topic
                  │
                  ├──* task        (também pode ser solta sem subject)
                  ├──* reading
                  └──* assessment

user 1───* event   (event referencia task/assessment via origem+ref_id)
subject_catalog 1───* subject (semente; o aluno "ativa" do catálogo)
```

Regra-chave: **tarefa/leitura/avaliação são a fonte; o calendário e Minha Semana são views derivadas.** Isso elimina duplicação e mantém a UX simples.

---

## 4. MVP

### Entra no MVP
- Onboarding em 5 passos com geração automática do ambiente.
- Minha Semana (prioridades, leituras, trabalhos, prazos, progresso).
- Disciplinas a partir de catálogo pré-pronto + página de detalhe (tópicos, tarefas, leituras, avaliações, progresso).
- Calendário Acadêmico (mensal e semanal, cores por categoria/disciplina).
- Dashboard do Semestre (visão macro enxuta).
- Ajustes básicos.
- Design system alinhado às referências (Notion/Linear/Sunsama/Motion), paleta indicada, tom acolhedor.
- **Persistência local no navegador** (sem login) para validar UX rápido — ver nota técnica.

### NÃO entra no MVP
- Login/contas, multiusuário, sincronização entre dispositivos.
- Banco completo de disciplinas e ementas oficiais.
- Planejamento inteligente / IA / sugestão automática de cronograma.
- Integração com OAB, importação de calendário acadêmico, Google Calendar.
- Notificações push/email, mobile app nativo.
- Compartilhamento, grupos, colaboração.
- Gamificação, estatísticas avançadas, relatórios.

---

## Notas técnicas (para você, opcional)

- Stack já provisionada: TanStack Start + React + Tailwind v4 + shadcn.
- **Persistência**: proponho começar com `localStorage` (zero fricção, sem backend). Quando validar, ligamos Lovable Cloud para auth + Postgres e migramos. Se preferir já começar com Cloud + login, me avise.
- `reading` pode virar simplesmente `task` com `tipo='leitura'` para reduzir entidades — recomendo essa simplificação no MVP.
- Catálogo de disciplinas será um arquivo seed no front (ex.: `src/data/subjectCatalog.ts`).

---

## Decisões que preciso de você antes de codar

1. **Persistência inicial**: localStorage agora e Cloud depois, ou já entrar com Lovable Cloud + login desde o MVP?
2. **`reading` separada ou unificada como `task` tipo leitura?** (recomendo unificar).
3. **Algo no escopo "NÃO entra" que você quer puxar para o MVP?**

Se aprovar como está (com as escolhas padrão: localStorage + reading unificada), começo a implementação na sequência: design system → onboarding → Minha Semana → Disciplinas → Calendário → Dashboard.