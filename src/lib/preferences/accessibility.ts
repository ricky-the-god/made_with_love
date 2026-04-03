export const REDUCED_MOTION_VALUES = ["no-preference", "reduce"] as const;
export const TEXT_SIZE_VALUES = ["normal", "large"] as const;

export type ReducedMotionPreference = (typeof REDUCED_MOTION_VALUES)[number];
export type TextSizePreference = (typeof TEXT_SIZE_VALUES)[number];

export function applyReducedMotionPreference(value: ReducedMotionPreference) {
  document.documentElement.setAttribute("data-reduced-motion", value);
}

export function applyTextSizePreference(value: TextSizePreference) {
  document.documentElement.setAttribute("data-text-size", value);
}
