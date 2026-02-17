export const AI_CATEGORY = {
  CANDIDATE: "CANDIDATE",
  NODE: "NODE",
  TECH: "TECH",
} as const;

export type AiCategory = (typeof AI_CATEGORY)[keyof typeof AI_CATEGORY];

export function isValidAiCategory(value: unknown): value is AiCategory {
  return Object.values(AI_CATEGORY).includes(value as AiCategory);
}
