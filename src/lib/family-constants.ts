export const RELATION_OPTIONS = [
  { value: "myself", label: "Myself" },
  { value: "husband", label: "Husband" },
  { value: "wife", label: "Wife" },
  { value: "spouse", label: "Spouse" },
  { value: "partner", label: "Partner" },
  { value: "mother", label: "Mother" },
  { value: "father", label: "Father" },
  { value: "grandmother", label: "Grandmother" },
  { value: "grandfather", label: "Grandfather" },
  { value: "great-aunt", label: "Great-Aunt" },
  { value: "great-uncle", label: "Great-Uncle" },
  { value: "aunt", label: "Aunt" },
  { value: "uncle", label: "Uncle" },
  { value: "sister", label: "Sister" },
  { value: "brother", label: "Brother" },
  { value: "cousin", label: "Cousin" },
  { value: "nephew", label: "Nephew" },
  { value: "niece", label: "Niece" },
  { value: "child", label: "Child" },
  { value: "daughter", label: "Daughter" },
  { value: "son", label: "Son" },
  { value: "family-friend", label: "Family friend" },
  { value: "mentor", label: "Mentor" },
  { value: "other", label: "Other" },
] as const;

export const RELATIONS = RELATION_OPTIONS.map((option) => option.label);

export type Relation = (typeof RELATION_OPTIONS)[number]["label"];

function toRelationKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const RELATION_LABEL_BY_KEY = new Map(
  RELATION_OPTIONS.flatMap((option) => [
    [option.value, option.label],
    [toRelationKey(option.label), option.label],
  ]),
);

export function normalizeRelationValue(relation?: string | null) {
  if (!relation) return null;

  return toRelationKey(relation);
}

export function getRelationLabel(relation?: string | null) {
  if (!relation) return null;

  const normalizedRelation = normalizeRelationValue(relation);

  if (!normalizedRelation) return null;

  const knownLabel = RELATION_LABEL_BY_KEY.get(normalizedRelation);

  if (knownLabel) return knownLabel;

  return normalizedRelation.replace(/-/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
}

/** Relations where a "parent in tree" selector should appear in the add/edit form. */
export const RELATIONS_REQUIRING_PARENT = new Set<string>(["nephew", "niece", "child", "cousin", "son", "daughter"]);

/**
 * All normalized relation values for which an explicit parent link makes sense
 * in the family tree (excludes the root node "myself" and couple/non-tree relations).
 */
export const RELATIONS_WITH_PARENTS = new Set<string>([
  "mother",
  "father",
  "grandmother",
  "grandfather",
  "great-grandmother",
  "great-grandfather",
  "great-aunt",
  "great-uncle",
  "aunt",
  "uncle",
  "sister",
  "brother",
  "cousin",
  "nephew",
  "niece",
  "child",
  "daughter",
  "son",
  "granddaughter",
  "grandson",
  "grandchild",
  "other",
]);
