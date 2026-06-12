// ============================================================
// Builder compacto para currículos.
// Recebe estrutura plana [moduleName, [[themeName, [microtheme...]]]]
// e produz CurriculumModule[] com IDs estáveis e únicos.
// Usado pelos arquivos de semestre para evitar verbosidade.
// ============================================================
import type { CurriculumModule, DisciplineCurriculum } from "../legalCurriculum";

export type ThemeData = [string, string[]];
export type ModuleData = [string, ThemeData[]];

export function buildModules(prefix: string, data: ModuleData[]): CurriculumModule[] {
  return data.map((mod, mi) => {
    const moduleId = `${prefix}.m${mi + 1}`;
    return {
      id: moduleId,
      nome: mod[0],
      themes: mod[1].map((theme, ti) => {
        const themeId = `${moduleId}.t${ti + 1}`;
        return {
          id: themeId,
          nome: theme[0],
          microthemes: theme[1].map((micro, mti) => ({
            id: `${themeId}.${mti + 1}`,
            nome: micro,
          })),
        };
      }),
    };
  });
}

export function buildDiscipline(
  catalogId: string,
  data: ModuleData[],
): DisciplineCurriculum {
  return { catalogId, modules: buildModules(catalogId, data) };
}
