"use client"

import React, { useRef } from "react"
import {
  type AnimationConfig,
  type AnimationType,
  defaultStaggerTimes,
  type PerType,
  useStagger,
} from "./_animate"
import { getDefaults } from "./defaults"
import type { KeyframePreset, TextPreset } from "./presets"
import { cn } from "./utils"

// Simple CSS injection for child element FOUC prevention
// FOUC prevention styles are now in global.css to avoid hydration mismatches

// Base props that all keyframe components accept
export interface KeyframeProps {
  children: React.ReactNode
  className?: string

  // Either use individual props OR a preset
  preset?: KeyframePreset | TextPreset
  animation?: AnimationConfig[]
  delay?: number
  duration?: number
  stagger?: number | number[] | boolean
  easing?: string
  trigger?: boolean
  visible?: boolean // Controls animation state - defaults to true
  onAnimationComplete?: () => void
  onAnimationStart?: () => void
  selector?: string
  style?: React.CSSProperties

  // Text-specific props (optional)
  per?: PerType
  overflow?: boolean
  segmentWrapperClassName?: string
}

// Helper to resolve props from preset, individual values, or element defaults
const resolveAnimationProps = (
  props: Partial<KeyframeProps>,
  elementType: string,
) => {
  const {
    preset,
    animation,
    delay,
    duration,
    stagger,
    easing,
    trigger,
    visible,
    onAnimationComplete,
    onAnimationStart,
    selector,
    per,
    overflow,
  } = props

  // Get element defaults as fallback
  const elementDefaults = getDefaults(elementType)

  // If preset is provided, use it as base and allow individual props to override
  if (preset) {
    const hasExplicitStagger = stagger !== undefined || "stagger" in preset
    const resolvedStagger = hasExplicitStagger
      ? stagger === true
        ? 0
        : typeof stagger === "number" || Array.isArray(stagger)
          ? stagger
          : (preset.stagger ?? elementDefaults.stagger)
      : elementDefaults.stagger

    return {
      animation: animation ?? preset.animation,
      delay: delay ?? preset.delay ?? 0,
      duration: duration ?? preset.duration ?? elementDefaults.duration ?? 0.6,
      stagger: resolvedStagger,
      easing: easing ?? preset.easing ?? elementDefaults.easing ?? "power1.out",
      trigger: trigger ?? true,
      visible: visible ?? true,
      onAnimationComplete,
      onAnimationStart,
      selector: selector ?? (hasExplicitStagger ? "> *" : "self"),
      per: per ?? ("per" in preset ? preset.per : elementDefaults.per),
      overflow:
        overflow ??
        ("overflow" in preset ? preset.overflow : elementDefaults.overflow) ??
        false,
    }
  }

  // Use individual props with element defaults as fallback
  const hasExplicitStagger = stagger !== undefined
  const resolvedStagger = hasExplicitStagger
    ? stagger === true
      ? 0
      : typeof stagger === "number" || Array.isArray(stagger)
        ? stagger
        : elementDefaults.stagger
    : elementDefaults.stagger

  return {
    animation: animation ?? elementDefaults.animation,
    delay: delay ?? 0,
    duration: duration ?? elementDefaults.duration ?? 0.6,
    stagger: resolvedStagger,
    easing: easing ?? elementDefaults.easing ?? "power1.out",
    trigger: trigger ?? true,
    visible: visible ?? true,
    onAnimationComplete,
    onAnimationStart,
    selector: selector ?? (hasExplicitStagger ? "> *" : "self"),
    per: per ?? elementDefaults.per,
    overflow: overflow ?? elementDefaults.overflow ?? false,
  }
}

// Text splitting and animation logic
const splitText = (text: string, per: PerType): string[] => {
  if (per === "line") {
    return splitTextIntoLines(text)
  }
  return text.split(/(\s+)/)
}

// Simplified line splitting - split by sentences for now
const splitTextIntoLines = (text: string): string[] => {
  // Split on periods, exclamation marks, question marks, or newlines
  const sentences = text.split(/(?<=[.!?])\s+|\n/)
  return sentences.filter((sentence) => sentence.trim().length > 0)
}

const AnimationComponent: React.FC<{
  segment: string
  per: "line" | "word" | "char"
  segmentWrapperClassName?: string | undefined
  className?: string | undefined
  overflow?: boolean | undefined
}> = React.memo(
  ({ segment, per, segmentWrapperClassName, className, overflow = false }) => {
    const content =
      per === "line" ? (
        <span className="block origin-bottom-left">{segment}</span>
      ) : per === "word" ? (
        <span className="inline-block whitespace-pre">{segment}</span>
      ) : (
        <span className="inline-block whitespace-pre">
          {segment.split("").map((char, i) => (
            <span
              key={`char-${char}-${char.charCodeAt(0)}-${i}`}
              className="inline-block origin-bottom-left whitespace-pre"
            >
              {char}
            </span>
          ))}
        </span>
      )

    // Always wrap in line-level clipping container when overflow is true
    if (overflow) {
      return (
        <span
          className={cn(
            per === "line" ? "block" : "inline-block",
            "overflow-hidden",
            className,
          )}
        >
          {content}
        </span>
      )
    }

    if (!segmentWrapperClassName) {
      return <span className={className}>{content}</span>
    }

    const defaultWrapperClassName = per === "line" ? "block" : "inline-block"

    return (
      <span
        className={cn(
          defaultWrapperClassName,
          segmentWrapperClassName,
          className,
        )}
      >
        {content}
      </span>
    )
  },
)

AnimationComponent.displayName = "AnimationComponent"

// Create a unified component factory for any HTML element
function createKeyframeComponent<T extends keyof React.JSX.IntrinsicElements>(
  element: T,
) {
  const KeyframeComponent = React.forwardRef<
    React.ElementRef<T>,
    KeyframeProps & React.ComponentPropsWithoutRef<T>
  >(
    (
      {
        children,
        className,
        overflow = false,
        segmentWrapperClassName,
        style,
        ...restProps
      },
      ref,
    ) => {
      const containerRef = useRef<HTMLElement>(null)

      // Merge refs callback
      const mergedRef = (element: React.ElementRef<T> | null) => {
        containerRef.current = element as HTMLElement
        if (typeof ref === "function") {
          ref(element)
        } else if (ref) {
          ;(ref as React.MutableRefObject<React.ElementRef<T> | null>).current =
            element
        }
      }

      // Resolve animation properties from preset, individual props, or element defaults
      const resolved = resolveAnimationProps(
        restProps as Partial<KeyframeProps>,
        element,
      )
      const {
        animation,
        delay,
        duration,
        stagger,
        easing,
        trigger,
        visible,
        onAnimationComplete,
        onAnimationStart,
        selector,
        per,
        overflow: resolvedOverflow,
      } = resolved

      // Filter out keyframe-specific props from restProps
      const domProps = Object.fromEntries(
        Object.entries(restProps).filter(
          ([key]) =>
            ![
              "preset",
              "animation",
              "delay",
              "duration",
              "stagger",
              "easing",
              "trigger",
              "visible",
              "onAnimationComplete",
              "onAnimationStart",
              "selector",
              "per",
              "overflow",
            ].includes(key),
        ),
      )

      // Determine if this is a text animation
      const isTextAnimation = per !== undefined && typeof children === "string"

      // Line animations now use the simplified splitTextIntoLines function

      // Calculate effective stagger and selector
      const effectiveStagger =
        stagger ??
        (isTextAnimation ? defaultStaggerTimes[per as PerType] : 0.05)
      const effectiveSelector = isTextAnimation
        ? per === "char"
          ? "span span span" // For character animation, target the deepest spans
          : `.keyframe-text-segment > span` // For word/line animation, target the content spans
        : selector

      // Smart FOUC prevention: apply opacity 0 to elements that GSAP will animate
      const hasFadeAnimation = (animation as AnimationType[]).includes("fade")

      // Determine what elements will be animated and apply FOUC prevention accordingly
      let containerStyles = style
      let shouldApplyFoucToChildren = false
      let childFoucClass = ""

      // Apply FOUC prevention consistently to avoid hydration mismatches
      if (hasFadeAnimation) {
        if (effectiveSelector === "self") {
          // GSAP will animate the container itself
          containerStyles = { ...style, opacity: 0 }
        } else if (effectiveSelector === "> *") {
          // GSAP will animate direct children - use CSS to hide them
          shouldApplyFoucToChildren = true
          childFoucClass = "keyframe-hide-children"
        } else if (isTextAnimation) {
          // GSAP will animate text segments - use CSS to hide them
          shouldApplyFoucToChildren = true
          childFoucClass = "keyframe-hide-text-segments"
        }
      }

      // Use the shared animation hook
      const options: import("./_animate").StaggerOptions = {
        animation: animation as AnimationType[],
        delay,
        duration,
        stagger: effectiveStagger,
        easing,
        trigger,
        visible,
        selector: effectiveSelector,
        childFoucClass: shouldApplyFoucToChildren ? childFoucClass : undefined,
      }
      if (onAnimationComplete) options.onAnimationComplete = onAnimationComplete
      if (onAnimationStart) options.onAnimationStart = onAnimationStart
      useStagger(containerRef as React.RefObject<HTMLElement>, options)

      // Handle text animation case
      if (isTextAnimation) {
        // Use splitText for all text animations, including lines
        const segments = splitText(children as string, per as PerType)

        const textSegments = segments.map((segment: string, index: number) =>
          React.createElement(AnimationComponent, {
            key: `${per}-${index}-${segment}`,
            segment,
            per: per as PerType,
            segmentWrapperClassName: segmentWrapperClassName as
              | string
              | undefined,
            className: "keyframe-text-segment",
            overflow: resolvedOverflow ?? false,
          }),
        )

        return React.createElement(
          element,
          {
            ref: mergedRef,
            className: cn(
              "keyframe-text-container",
              childFoucClass,
              className,
              resolvedOverflow && "overflow-hidden",
            ),
            style: {
              ...containerStyles,
              ...(resolvedOverflow && {
                lineHeight: "1em",
              }),
            },
            ...domProps,
          },
          // Screen reader text
          per !== "line" &&
            React.createElement("span", { className: "sr-only" }, children),
          // Animated segments
          textSegments,
        )
      }

      // Handle regular element animation case
      return React.createElement(
        element,
        {
          ref: mergedRef,
          className: cn("keyframe-container", childFoucClass, className),
          style: {
            ...containerStyles,
          },
          ...domProps,
        },
        children,
      )
    },
  )

  KeyframeComponent.displayName = `Keyframe.${element}`
  return KeyframeComponent
}

// Type for the keyframe proxy object
type KeyframeComponents = {
  [K in keyof React.JSX.IntrinsicElements]: React.ForwardRefExoticComponent<
    KeyframeProps &
      React.ComponentPropsWithoutRef<K> &
      React.RefAttributes<React.ElementRef<K>>
  >
}

// Create the keyframe proxy object
export const keyframe = new Proxy({} as KeyframeComponents, {
  get(target, prop) {
    // Handle Symbol properties (like Symbol.toStringTag, Symbol.iterator, etc.)
    if (typeof prop === "symbol") {
      return (target as Record<symbol, unknown>)[prop]
    }

    // Handle string properties
    if (typeof prop === "string") {
      if (!(prop in target)) {
        // Cache the component so we don't recreate it every time
        const component = createKeyframeComponent(
          prop as keyof React.JSX.IntrinsicElements,
        )
        ;(target as Record<string, typeof component>)[prop] = component
      }
      return (target as Record<string, unknown>)[prop]
    }

    // For any other property type, return undefined
    return undefined
  },
}) as KeyframeComponents

// Export individual components for better tree-shaking if needed
export const KeyframeDiv = keyframe.div
export const KeyframeSpan = keyframe.span
export const KeyframeP = keyframe.p
export const KeyframeH1 = keyframe.h1
export const KeyframeH2 = keyframe.h2
export const KeyframeH3 = keyframe.h3
export const KeyframeUl = keyframe.ul
export const KeyframeLi = keyframe.li
export const KeyframeSection = keyframe.section
export const KeyframeArticle = keyframe.article
export const KeyframeButton = keyframe.button

//
