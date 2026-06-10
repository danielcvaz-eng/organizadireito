export type Goal = "faculdade" | "oab" | "faculdade_oab" | "concurso";

export type TaskType = "leitura" | "trabalho" | "seminario" | "estudo" | "outro";
export type TaskStatus = "pendente" | "fazendo" | "feito";
export type Priority = "baixa" | "media" | "alta";

export type AssessmentType = "prova" | "trabalho" | "seminario";

export interface UserProfile {
  semestre: number;
  trabalhaEstagia: boolean;
  horasSemana: number;
  objetivo: Goal;
  onboardingCompleto: boolean;
  nome?: string;
}

export interface Subject {
  id: string;
  catalogId?: string;
  nome: string;
  cor: string;
}

export interface Topic {
  id: string;
  subjectId: string;
  titulo: string;
  ordem: number;
  concluido: boolean;
}

export interface Task {
  id: string;
  subjectId?: string;
  tipo: TaskType;
  titulo: string;
  descricao?: string;
  prazo?: string; // ISO date
  prioridade: Priority;
  status: TaskStatus;
  estimativaHoras?: number;
  createdAt: string;
}

export interface Assessment {
  id: string;
  subjectId: string;
  tipo: AssessmentType;
  titulo: string;
  data: string; // ISO date
  peso?: number;
  nota?: number;
}

export interface AppState {
  user: UserProfile | null;
  subjects: Subject[];
  topics: Topic[];
  tasks: Task[];
  assessments: Assessment[];
  /** Microtemas concluídos. Chave: `${subjectId}:${microthemeId}` */
  completedMicrothemes: string[];
}
