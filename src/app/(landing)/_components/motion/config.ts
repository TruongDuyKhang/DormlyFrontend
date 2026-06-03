/** Shared cinematic motion tokens */
export const CINEMATIC_EASE = [0.16, 1, 0.3, 1] as const;

export const CINEMATIC_SPRING = {
  type: "spring" as const,
  stiffness: 80,
  damping: 22,
};

export const SLOW_FADE = {
  duration: 1.1,
  ease: CINEMATIC_EASE,
};
