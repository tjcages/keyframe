"use client"

import { gsap } from "gsap"
import React, { useEffect, useMemo, useRef } from "react"
import { ANIMATION_VALUES } from "./defaults"
import { cn } from "./utils"

// Extend Window interface for GSAP CustomEase plugin
declare global {
  interface Window {
    CustomEase?: {
      create: (name: string, path: string) => void
    }
  }
}

// Animation types that can be combined
export type AnimationType =
  | "fade"
  | "blur"
  | "scale"
  | "scale-up"
  | "scale-down"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"

export type AnimationConfig =
  | AnimationType
  | {
      type: "slide-up" | "slide-down"
      distance?: number
    }
  | {
      type: "slide-left" | "slide-right"
      distance?: number
    }

export type PerType = "char" | "word" | "line"

// Custom easing definitions
const customEasings = {
  "custom-smooth":
    "M0,0,C0.11,0.494,0.192,0.726,0.318,0.852,0.45,0.984,0.504,1,1,1",
  "custom-bounce": "M0,0 C0.5,0 0.5,0.5 0.5,0.5 C0.5,0.5 0.5,1 1,1",
  "custom-elastic": "M0,0,C0.5,0.1,0.7,0.3,0.8,0.5,0.9,0.7,1.1,0.9,1,1",
  "custom-overshoot": "M0,0,C0.5,0,0.5,0,0.7,0.2,0.9,0.4,1.2,1.2,1,1",
}

// Register custom easings with GSAP
Object.entries(customEasings).forEach(([name, path]) => {
  try {
    // Try to create custom ease if CustomEase is available
    if (typeof window !== "undefined" && window.CustomEase) {
      window.CustomEase.create(name, path)
    }
  } catch (error) {
    console.warn(`Failed to register custom easing "${name}":`, error)
  }
})

export const defaultStaggerTimes: Record<PerType, number> = {
  char: 0.03,
  word: 0.05,
  line: 0.1,
}

// Individual animation effect configs
export const animationConfigs: Record<
  AnimationType,
  {
    from: gsap.TweenVars
    to: gsap.TweenVars
  }
> = {
  fade: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  blur: {
    from: { filter: ANIMATION_VALUES.blur.from },
    to: { filter: "blur(0px)" },
  },
  scale: {
    from: { scale: ANIMATION_VALUES.scale.from },
    to: { scale: 1 },
  },
  "scale-up": {
    from: { scale: ANIMATION_VALUES.scaleUp.from },
    to: { scale: 1 },
  },
  "scale-down": {
    from: { scale: ANIMATION_VALUES.scaleDown.from },
    to: { scale: 1 },
  },
  "slide-up": {
    from: { y: ANIMATION_VALUES.slide.distance },
    to: { y: 0 },
  },
  "slide-down": {
    from: { y: -ANIMATION_VALUES.slide.distance },
    to: { y: 0 },
  },
  "slide-left": {
    from: { x: ANIMATION_VALUES.slide.distance },
    to: { x: 0 },
  },
  "slide-right": {
    from: { x: -ANIMATION_VALUES.slide.distance },
    to: { x: 0 },
  },
}

// Helper function to get animation config with custom parameters
const getAnimationConfig = (
  animConfig: AnimationConfig,
): {
  from: gsap.TweenVars
  to: gsap.TweenVars
} => {
  if (typeof animConfig === "string") {
    return animationConfigs[animConfig]
  }

  // Handle custom slide animations with distance parameter
  const { type, distance = ANIMATION_VALUES.slide.distance } = animConfig

  switch (type) {
    case "slide-up":
      return {
        from: { y: distance },
        to: { y: 0 },
      }
    case "slide-down":
      return {
        from: { y: -distance },
        to: { y: 0 },
      }
    case "slide-left":
      return {
        from: { x: distance },
        to: { x: 0 },
      }
    case "slide-right":
      return {
        from: { x: -distance },
        to: { x: 0 },
      }
    default:
      return animationConfigs[type]
  }
}

// Helper function to combine multiple animation configs
export const combineAnimations = (
  animations: AnimationConfig[],
): {
  from: gsap.TweenVars
  to: gsap.TweenVars
  blurTo: gsap.TweenVars
  hasBlur: boolean
} => {
  const combined = { from: {}, to: {}, blurTo: {}, hasBlur: false }

  animations.forEach((animConfig) => {
    const config = getAnimationConfig(animConfig)
    Object.assign(combined.from, config.from)

    const animationType =
      typeof animConfig === "string" ? animConfig : animConfig.type

    if (animationType === "blur") {
      // Separate blur animation properties
      Object.assign(combined.blurTo, config.to)
      combined.hasBlur = true
    } else {
      Object.assign(combined.to, config.to)
    }
  })

  return combined
}

export interface StaggerOptions {
  animation?: AnimationConfig[]
  delay?: number
  duration?: number
  stagger?: number | number[]
  easing?: string
  trigger?: boolean
  visible?: boolean // Controls animation state - defaults to true
  onAnimationComplete?: () => void
  onAnimationStart?: () => void
  selector?: string // CSS selector for elements to animate
  childFoucClass?: string | undefined // CSS class to remove when animation starts
}

// Shared animation hook
export function useStagger(
  containerRef: React.RefObject<HTMLElement>,
  options: StaggerOptions = {},
) {
  const {
    animation = ["fade"],
    delay = 0,
    duration = 0.6,
    stagger = 0.05,
    easing = "power1.out",
    trigger = true,
    visible = true,
    onAnimationComplete,
    onAnimationStart,
    selector = "*", // Default to all direct children
    childFoucClass,
  } = options

  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  // Store latest callbacks in refs to avoid dependency issues
  const onAnimationStartRef = useRef(onAnimationStart)
  const onAnimationCompleteRef = useRef(onAnimationComplete)

  // Update refs when callbacks change
  onAnimationStartRef.current = onAnimationStart
  onAnimationCompleteRef.current = onAnimationComplete

  // Memoize config to prevent unnecessary re-renders
  const config = useMemo(() => combineAnimations(animation), [animation])

  useEffect(() => {
    if (!containerRef.current) return

    // Clean up previous timeline
    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    // Create new timeline
    const timeline = gsap.timeline({
      paused: true,
      onStart: () => onAnimationStartRef.current?.(),
      onComplete: () => onAnimationCompleteRef.current?.(),
    })

    // Get all animatable elements
    let elements: Element[] | NodeListOf<Element>
    if (selector === "self") {
      // Special case: animate the container itself
      elements = [containerRef.current]
    } else if (selector === "> *") {
      // Handle direct children selector specially since "> *" isn't universally supported
      elements = Array.from(containerRef.current.children)
    } else {
      elements = containerRef.current.querySelectorAll(selector)
    }

    if (elements.length === 0) return

    // Remove child FOUC class if provided
    if (childFoucClass) {
      containerRef.current.classList.remove(childFoucClass)
    }

    // Set initial state - no need to remove CSS classes since we use inline styles
    gsap.set(elements, config.from)

    // Create staggered animation for non-blur properties
    if (Object.keys(config.to).length > 0) {
      if (Array.isArray(stagger)) {
        // Handle array stagger - create individual tweens positioned at specific times
        const elementsArray = Array.from(elements)
        elementsArray.forEach((element, index) => {
          const elementStaggerDelay =
            stagger[index] !== undefined
              ? stagger[index]
              : stagger[stagger.length - 1] || 0
          const positionInTimeline = delay + elementStaggerDelay

          timeline.to(
            element,
            {
              ...config.to,
              duration,
              ease: easing,
            },
            positionInTimeline,
          ) // Position the tween at the specific time in the timeline
        })
      } else {
        // Handle number stagger - use GSAP's built-in stagger
        timeline.to(elements, {
          ...config.to,
          duration,
          ease: easing,
          stagger: stagger,
          delay: delay, // Apply delay to the stagger sequence
        })
      }
    }

    // Create separate blur animation that ends 20% earlier
    if (config.hasBlur) {
      if (Array.isArray(stagger)) {
        // Handle array stagger for blur animation - position at specific times
        const elementsArray = Array.from(elements)
        elementsArray.forEach((element, index) => {
          const elementStaggerDelay =
            stagger[index] !== undefined
              ? stagger[index]
              : stagger[stagger.length - 1] || 0
          const positionInTimeline = delay + elementStaggerDelay

          timeline.to(
            element,
            {
              ...config.blurTo,
              duration: duration * 0.8, // 20% shorter duration
              ease: easing,
            },
            positionInTimeline, // Position at the same time as the main animation
          )
        })
      } else {
        // Handle number stagger for blur animation
        timeline.to(
          elements,
          {
            ...config.blurTo,
            duration: duration * 0.8, // 20% shorter duration
            ease: easing,
            stagger: stagger,
            delay: delay, // Apply same delay to blur animation
          },
          0,
        ) // Start at the same time as other animations
      }
    }

    timelineRef.current = timeline

    return () => {
      timeline.kill()
    }
  }, [
    delay,
    duration,
    stagger,
    easing,
    config,
    selector,
    containerRef,
    childFoucClass,
  ])

  // Handle dynamic visible changes and initial state
  useEffect(() => {
    if (!timelineRef.current) return

    const timeline = timelineRef.current

    if (trigger && visible) {
      // Show: play forward
      if (timeline.reversed()) {
        timeline.play()
      } else if (timeline.paused() || timeline.progress() === 0) {
        timeline.play()
      }
    } else if (!visible) {
      // Hide: reverse the animation
      if (timeline.progress() > 0) {
        timeline.reverse()
      } else {
        // If animation hasn't started, set to hidden state immediately
        timeline.progress(0).pause()
      }
    } else if (!trigger) {
      // Paused state
      timeline.pause()
    }
  }, [trigger, visible])

  // Return timeline controls for advanced usage
  return {
    timeline: timelineRef.current,
    play: () => timelineRef.current?.play(),
    pause: () => timelineRef.current?.pause(),
    reverse: () => timelineRef.current?.reverse(),
    restart: () => timelineRef.current?.restart(),
  }
}

// React component interface
export interface StaggerProps {
  children: React.ReactNode
  as?: keyof React.JSX.IntrinsicElements
  className?: string
  animation?: AnimationConfig[]
  delay?: number
  duration?: number
  stagger?: number | number[]
  easing?: string
  trigger?: boolean
  visible?: boolean
  onAnimationComplete?: () => void
  onAnimationStart?: () => void
  selector?: string
  style?: React.CSSProperties
}

// React component
export function Stagger({
  children,
  as = "div",
  className,
  animation = ["fade"],
  delay = 0,
  duration = 0.6,
  stagger = 0.05,
  easing = "power1.out",
  trigger = true,
  visible = true,
  onAnimationComplete,
  onAnimationStart,
  selector = "> *", // Default to direct children
  style,
}: StaggerProps) {
  const containerRef = useRef<HTMLElement>(null)

  // Use the shared animation hook
  const options: StaggerOptions = {
    animation,
    delay,
    duration,
    stagger,
    easing,
    trigger,
    visible,
    selector,
  }
  if (onAnimationComplete) options.onAnimationComplete = onAnimationComplete
  if (onAnimationStart) options.onAnimationStart = onAnimationStart
  useStagger(containerRef as React.RefObject<HTMLElement>, options)

  return React.createElement(
    as,
    {
      ref: containerRef,
      className: cn("stagger", className),
      style,
    },
    children,
  )
}

//
