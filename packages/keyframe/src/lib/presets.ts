import type { AnimationConfig, AnimationType, PerType } from "./_animate"

// Enhanced animation duration constants
export const DURATION = {
  INSTANT: 0.1,
  FASTER: 0.2,
  FAST: 0.4,
  NORMAL: 0.6,
  SLOW: 0.8,
  SLOWER: 1.0,
  SLOWEST: 1.5,
} as const

// Enhanced stagger timing constants
export const STAGGER = {
  TIGHTEST: 0.005, // For character animations
  TIGHT: 0.0075, // For character animations
  SNAPPY: 0.015, // Quick succession
  NORMAL: 0.033, // Default comfortable pace
  RELAXED: 0.06, // Slower, more deliberate
  LOOSE: 0.12, // Very spaced out
  DRAMATIC: 0.2, // For dramatic reveals
} as const

// Easing presets
export const EASING = {
  SMOOTH: "power1.out",
  SNAPPY: "power2.out",
  BOUNCY: "back.out(1.4)",
  ELASTIC: "elastic.out(1, 0.3)",
  CUSTOM_SMOOTH: "custom-smooth",
  CUSTOM_BOUNCE: "custom-bounce",
  CUSTOM_ELASTIC: "custom-elastic",
  CUSTOM_OVERSHOOT: "custom-overshoot",
} as const

// Base preset interface
export interface KeyframePreset {
  animation: readonly AnimationConfig[] | AnimationConfig[]
  duration?: number
  stagger?: number | number[]
  easing?: string
  delay?: number
  overflow?: boolean
}

// Text-specific preset interface
export interface TextPreset extends KeyframePreset {
  per?: PerType
}

// ===================
// GENERAL ANIMATIONS
// ===================

export const PRESETS = {
  // Simple fade animations
  fadeIn: {
    animation: ["fade"],
    duration: DURATION.NORMAL,
    stagger: STAGGER.NORMAL,
    easing: EASING.SMOOTH,
  },

  fadeInFast: {
    animation: ["fade"],
    duration: DURATION.FAST,
    stagger: STAGGER.SNAPPY,
    easing: EASING.SMOOTH,
  },

  fadeInSlow: {
    animation: ["fade"],
    duration: DURATION.SLOW,
    stagger: STAGGER.RELAXED,
    easing: EASING.SMOOTH,
  },

  // Slide animations
  slideUp: {
    animation: ["fade", "slide-up"],
    duration: DURATION.NORMAL,
    stagger: STAGGER.NORMAL,
    easing: EASING.SMOOTH,
  },

  slideUpSnappy: {
    animation: ["fade", "slide-up"],
    duration: DURATION.FAST,
    stagger: STAGGER.SNAPPY,
    easing: EASING.SNAPPY,
  },

  slideUpDramatic: {
    animation: ["fade", "slide-up"],
    duration: DURATION.SLOW,
    stagger: STAGGER.DRAMATIC,
    easing: EASING.SMOOTH,
  },

  // Scale animations
  scaleIn: {
    animation: ["fade", "scale"],
    duration: DURATION.NORMAL,
    stagger: STAGGER.NORMAL,
    easing: EASING.BOUNCY,
  },

  scaleInElastic: {
    animation: ["fade", "scale"],
    duration: DURATION.SLOW,
    stagger: STAGGER.RELAXED,
    easing: EASING.ELASTIC,
  },

  // Blur animations
  blurIn: {
    animation: ["fade", "blur"],
    duration: DURATION.SLOW,
    stagger: STAGGER.NORMAL,
    easing: EASING.SMOOTH,
  },

  // Combined dramatic animations
  heroEntry: {
    animation: ["fade", "blur", "slide-up"],
    duration: DURATION.SLOWER,
    stagger: STAGGER.TIGHT,
    easing: EASING.CUSTOM_SMOOTH,
  },

  cardReveal: {
    animation: ["fade", "scale"],
    duration: DURATION.NORMAL,
    stagger: STAGGER.RELAXED,
    easing: EASING.BOUNCY,
  },

  listAppear: {
    animation: ["fade", "slide-up"],
    duration: DURATION.FAST,
    stagger: STAGGER.SNAPPY,
    easing: EASING.SMOOTH,
  },
} as const

// ===================
// TEXT ANIMATIONS
// ===================

export const TEXT_PRESETS = {
  // Character animations
  typewriter: {
    animation: ["fade"],
    per: "char" as const,
    duration: DURATION.FAST,
    stagger: STAGGER.TIGHT,
    easing: EASING.SMOOTH,
  },

  characterReveal: {
    animation: ["fade", "slide-up"],
    per: "char" as const,
    duration: DURATION.NORMAL,
    stagger: STAGGER.TIGHT,
    easing: EASING.SMOOTH,
  },

  characterPop: {
    animation: ["fade", "scale"],
    per: "char" as const,
    duration: DURATION.FAST,
    stagger: STAGGER.TIGHT,
    easing: EASING.BOUNCY,
  },

  characterBlur: {
    animation: ["fade", "blur", "slide-up"],
    per: "char" as const,
    duration: DURATION.SLOWER,
    stagger: STAGGER.TIGHT,
    easing: EASING.CUSTOM_SMOOTH,
  },

  // Word animations
  wordReveal: {
    animation: ["fade", "slide-up"],
    per: "word" as const,
    duration: DURATION.NORMAL,
    stagger: STAGGER.NORMAL,
    easing: EASING.SMOOTH,
  },

  wordPop: {
    animation: ["fade", "scale"],
    per: "word" as const,
    duration: DURATION.FAST,
    stagger: STAGGER.NORMAL,
    easing: EASING.BOUNCY,
  },

  wordSlide: {
    animation: ["fade", "slide-left"],
    per: "word" as const,
    duration: DURATION.NORMAL,
    stagger: STAGGER.SNAPPY,
    easing: EASING.SMOOTH,
  },

  // Line animations
  lineReveal: {
    animation: ["fade", "slide-up"],
    per: "line" as const,
    duration: DURATION.NORMAL,
    stagger: STAGGER.LOOSE,
    easing: EASING.SMOOTH,
  },

  lineTypewriter: {
    animation: ["fade"],
    per: "line" as const,
    duration: DURATION.SLOW,
    stagger: STAGGER.DRAMATIC,
    easing: EASING.SMOOTH,
  },

  // Special text effects
  heroTitle: {
    animation: ["fade", "blur", "slide-up"],
    per: "char" as const,
    duration: DURATION.SLOWER,
    stagger: STAGGER.TIGHT,
    easing: EASING.CUSTOM_SMOOTH,
  },

  subtitle: {
    animation: ["fade", "slide-up"],
    per: "word" as const,
    duration: DURATION.NORMAL,
    stagger: STAGGER.NORMAL,
    easing: EASING.SMOOTH,
  },

  caption: {
    animation: ["fade"],
    per: "word" as const,
    duration: DURATION.FAST,
    stagger: STAGGER.SNAPPY,
    easing: EASING.SMOOTH,
  },
} as const

// ===================
// HELPER FUNCTIONS
// ===================

// Create a custom preset with overrides
export function createPreset(
  basePreset: KeyframePreset,
  overrides: Partial<KeyframePreset> = {},
): KeyframePreset {
  return { ...basePreset, ...overrides }
}

// Create a custom text preset with overrides
export function createTextPreset(
  basePreset: TextPreset,
  overrides: Partial<TextPreset> = {},
): TextPreset {
  return { ...basePreset, ...overrides }
}

// Quick access to common combinations
export const QUICK = {
  // Ultra-fast for micro-interactions
  instant: (animation: AnimationType[]): KeyframePreset => ({
    animation,
    duration: DURATION.INSTANT,
    stagger: STAGGER.TIGHT,
    easing: EASING.SMOOTH,
  }),

  // Fast and snappy
  snappy: (animation: AnimationType[]): KeyframePreset => ({
    animation,
    duration: DURATION.FAST,
    stagger: STAGGER.SNAPPY,
    easing: EASING.SNAPPY,
  }),

  // Smooth and natural
  smooth: (animation: AnimationType[]): KeyframePreset => ({
    animation,
    duration: DURATION.NORMAL,
    stagger: STAGGER.NORMAL,
    easing: EASING.SMOOTH,
  }),

  // Slow and dramatic
  dramatic: (animation: AnimationType[]): KeyframePreset => ({
    animation,
    duration: DURATION.SLOW,
    stagger: STAGGER.DRAMATIC,
    easing: EASING.SMOOTH,
  }),

  // Bouncy and playful
  bouncy: (animation: AnimationType[]): KeyframePreset => ({
    animation,
    duration: DURATION.NORMAL,
    stagger: STAGGER.RELAXED,
    easing: EASING.BOUNCY,
  }),
}

//
