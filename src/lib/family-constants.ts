export const RELATIONS = [
  "Myself",
  "Mother",
  "Father",
  "Grandmother",
  "Grandfather",
  "Aunt",
  "Uncle",
  "Sister",
  "Brother",
  "Cousin",
  "Nephew",
  "Niece",
  "Child",
  "Family friend",
  "Mentor",
  "Other",
] as const;

export type Relation = (typeof RELATIONS)[number];

/** Relations where a "parent in tree" selector should appear in the add/edit form. */
export const RELATIONS_REQUIRING_PARENT = new Set<string>(["nephew", "niece", "child", "cousin"]);
