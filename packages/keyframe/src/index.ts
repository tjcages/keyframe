// Re-export the shared animation system
export * from "./lib/_animate"

// Import for unified export
import { keyframe } from "./lib/_keyframe"

export { Stagger } from "./lib/_animate"
// Export types
export type { KeyframeProps } from "./lib/_keyframe"
// Export the unified keyframe system
// Export individual components for better tree-shaking
export {
  KeyframeArticle,
  KeyframeButton,
  KeyframeDiv,
  KeyframeH1,
  KeyframeH2,
  KeyframeH3,
  KeyframeLi,
  KeyframeP,
  KeyframeSection,
  KeyframeSpan,
  KeyframeUl,
  keyframe,
} from "./lib/_keyframe"

// Create a unified export that works for both regular and text animations
export const Keyframe = keyframe

export * from "./lib/_animate"
export * from "./lib/_keyframe"
// Export element defaults
export * from "./lib/defaults"
export * from "./lib/defaults"
// Export presets system
export * from "./lib/presets"
export * from "./lib/presets"
