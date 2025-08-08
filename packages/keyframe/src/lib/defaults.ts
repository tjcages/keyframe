import type { AnimationConfig, PerType } from "./_animate"
import { DURATION, EASING, STAGGER } from "./presets"

// Default animation configuration for each element type
export interface Defaults {
  animation: readonly AnimationConfig[] | AnimationConfig[]
  per?: PerType
  duration?: number
  stagger?: number | number[]
  easing?: string
  overflow?: boolean
}

// ===================
// STARTING ANIMATION VALUES
// ===================

export const ANIMATION_VALUES = {
  scale: { from: 0 },
  scaleUp: { from: 0.95 },
  scaleDown: { from: 1.05 },
  slide: { distance: 20 },
  blur: { from: "blur(12px)" },
} as const

// ===================
// ELEMENT-SPECIFIC OVERRIDES
// ===================

// Override specific properties for individual elements
const ELEMENT_OVERRIDES: Record<string, Partial<Defaults>> = {
  // Make h5 and h6 even faster
  h5: {
    stagger: STAGGER.SNAPPY,
  },
  h6: {
    stagger: STAGGER.SNAPPY,
  },

  // Make spans faster
  span: {
    duration: DURATION.FAST,
  },

  // Custom overrides can be added here as needed
}

// ===================
// ELEMENT DEFAULTS WITH ARRAY GROUPING
// ===================

// Define element defaults with CSS-like array syntax for grouping
const ELEMENT_GROUPS: Record<string, Defaults> = {
  // Hero title - Character-based animations for maximum impact
  h1: {
    animation: ["fade", "blur", "slide-up"],
    per: "char",
    duration: DURATION.SLOWER,
    stagger: STAGGER.TIGHT,
    easing: EASING.CUSTOM_SMOOTH,
    overflow: false,
  },

  // Large heading - Character-based for impact
  h2: {
    animation: ["fade", "slide-up"],
    per: "char",
    duration: DURATION.NORMAL,
    stagger: STAGGER.TIGHT,
    easing: EASING.SMOOTH,
  },

  // Medium & Small headings - Word-based animations
  "h3, h4, h5, h6": {
    animation: ["fade"],
    per: "word",
    duration: DURATION.NORMAL,
    stagger: STAGGER.NORMAL,
    easing: EASING.SMOOTH,
  },

  // Body text - Word-based for readability
  p: {
    animation: ["fade", "slide-up"],
    per: "word",
    duration: DURATION.NORMAL,
    stagger: STAGGER.NORMAL,
    easing: EASING.SMOOTH,
    overflow: true,
  },

  // Fast text elements - Quick word-based animations
  "span, em": {
    animation: ["fade", "slide-up"],
    per: "word",
    duration: DURATION.FAST,
    stagger: STAGGER.NORMAL,
    easing: EASING.SMOOTH,
  },

  // Emphasis text - Bouncy scale for attention
  strong: {
    animation: ["fade", "scale"],
    per: "word",
    duration: DURATION.FAST,
    stagger: STAGGER.SNAPPY,
    easing: EASING.BOUNCY,
  },

  // List elements - Structured animations
  "ul, ol, li": {
    animation: ["fade", "slide-up"],
    duration: DURATION.FAST,
    stagger: STAGGER.SNAPPY,
    easing: EASING.SMOOTH,
  },

  // Structural elements - Subtle container animations
  div: {
    animation: ["fade"],
    duration: DURATION.SLOWER,
    stagger: STAGGER.NORMAL,
    easing: EASING.SMOOTH,
  },

  // Section elements - Slower, more deliberate animations
  "section, article, header, footer": {
    animation: ["fade", "slide-up"],
    duration: DURATION.SLOW,
    stagger: STAGGER.RELAXED,
    easing: EASING.SMOOTH,
  },

  // Interactive elements - Engaging animations
  "button, a": {
    animation: ["fade"],
    duration: DURATION.FAST,
    stagger: STAGGER.SNAPPY,
    easing: EASING.SMOOTH,
  },

  // Media elements - Subtle entrance
  "img, video": {
    animation: ["fade", "scale"],
    duration: DURATION.NORMAL,
    stagger: STAGGER.NORMAL,
    easing: EASING.SMOOTH,
  },

  // Form elements - Clean animations
  "input, textarea": {
    animation: ["fade", "slide-up"],
    duration: DURATION.FAST,
    stagger: STAGGER.SNAPPY,
    easing: EASING.SMOOTH,
  },

  // Form text - Word-based for readability
  label: {
    animation: ["fade", "slide-up"],
    per: "word",
    duration: DURATION.FAST,
    stagger: STAGGER.NORMAL,
    easing: EASING.SMOOTH,
  },

  // Form container
  form: {
    animation: ["fade", "slide-up"],
    duration: DURATION.NORMAL,
    stagger: STAGGER.NORMAL,
    easing: EASING.SMOOTH,
  },

  // Fallback for any other elements
  default: {
    animation: ["fade"],
    duration: DURATION.NORMAL,
    stagger: STAGGER.NORMAL,
    easing: EASING.SMOOTH,
  },
}

// ===================
// RESOLVER FUNCTIONS
// ===================

// Parse element groups and create individual element mappings
function parseElementGroups(): Record<string, Defaults> {
  const elementDefaults: Record<string, Defaults> = {}

  for (const [selector, defaults] of Object.entries(ELEMENT_GROUPS)) {
    if (selector.includes(",")) {
      // Split comma-separated selectors
      const elements = selector.split(",").map((el) => el.trim())
      for (const element of elements) {
        elementDefaults[element] = defaults
      }
    } else {
      // Single element
      elementDefaults[selector] = defaults
    }
  }

  return elementDefaults
}

// Generate the complete element defaults
const parsedElementDefaults: Record<string, Defaults> = parseElementGroups()

// Helper function to get defaults for an element
export function getDefaults(element: string): Defaults {
  // Get base defaults
  const baseDefaults =
    parsedElementDefaults[element] ??
    (parsedElementDefaults["default"] as Defaults)

  // Apply element-specific overrides
  const overrides = ELEMENT_OVERRIDES[element] || {}

  // Merge base defaults with overrides
  const merged: Defaults = { ...baseDefaults, ...overrides }
  return merged
}

// Export the complete element defaults (for backwards compatibility)
export const DEFAULTS: Record<string, Defaults> = Object.keys(
  parsedElementDefaults,
).reduce(
  (acc, element) => {
    const value = getDefaults(element)
    acc[element] = value
    return acc
  },
  {} as Record<string, Defaults>,
)

// Add the default fallback
DEFAULTS["default"] = parsedElementDefaults["default"] as Defaults

//
