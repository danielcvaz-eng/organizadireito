export interface CatalogSubject {
  id: string;
  nome: string;
  cor: string;
}

export const SUBJECT_CATALOG: CatalogSubject[] = [
  { id: "constitucional", nome: "Direito Constitucional", cor: "#2563eb" },
  { id: "civil-1", nome: "Direito Civil I", cor: "#22c55e" },
  { id: "civil-2", nome: "Direito Civil II", cor: "#16a34a" },
  { id: "penal-1", nome: "Direito Penal I", cor: "#ef4444" },
  { id: "penal-2", nome: "Direito Penal II", cor: "#dc2626" },
  { id: "administrativo", nome: "Direito Administrativo", cor: "#f59e0b" },
  { id: "empresarial", nome: "Direito Empresarial", cor: "#8b5cf6" },
  { id: "tributario", nome: "Direito Tributário", cor: "#ec4899" },
  { id: "processo-civil", nome: "Processo Civil", cor: "#14b8a6" },
  { id: "processo-penal", nome: "Processo Penal", cor: "#0ea5e9" },
  { id: "trabalho", nome: "Direito do Trabalho", cor: "#f97316" },
  { id: "internacional", nome: "Direito Internacional", cor: "#6366f1" },
];
