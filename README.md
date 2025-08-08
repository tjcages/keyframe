# Keyframe Animation System

A declarative motion primitives framework for React, built on GSAP.

- Semantic component API: use `keyframe.div`, `keyframe.h1`, `keyframe.button`, etc.
- Automatic text animation (word/char/line splitting)
- Built‑in FOUC prevention
- Presets and sensible element defaults
- Performance‑friendly by design

## Packages

- `@tjcages/keyframe` – the React animation library (published)
- `apps/web` – the Next.js marketing site consuming the library

## Installation (library)

```bash
pnpm add @tjcages/keyframe
# or
npm i @tjcages/keyframe
```

## Basic Usage

```tsx
import { keyframe } from '@tjcages/keyframe'

// Animate elements
<keyframe.div animation={["fade", "slide-up"]} stagger={0.1}>
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</keyframe.div>

// Animate text (add 'per' prop for splitting)
<keyframe.h1 animation={["fade", "blur", "slide-up"]} per="word" stagger={0.05}>
  This hero text will animate word by word
</keyframe.h1>
```

## API (KeyframeProps)

```ts
interface KeyframeProps {
  // Animation
  animation?: AnimationType[] // Default: element-specific
  delay?: number // Default: 0
  duration?: number // Default: 0.6
  stagger?: number | number[] // Default: 0.05
  easing?: string // Default: 'power1.out'

  // Text splitting (optional)
  per?: 'word' | 'char' | 'line'

  // Advanced
  trigger?: boolean // Default: true
  visible?: boolean // Default: true (controls show/hide)
  selector?: string // Default: '> *' (or text-target selector)
  overflow?: boolean // Default: false (clip text before animating)
  segmentWrapperClassName?: string
  onAnimationStart?: () => void
  onAnimationComplete?: () => void
}
```

## Animation Types

- "fade"
- "blur"
- "scale", "scale-up", "scale-down"
- "slide-up", "slide-down", "slide-left", "slide-right"

## Callbacks

```tsx
<keyframe.div
  onAnimationStart={() => console.log('Started')}
  onAnimationComplete={() => console.log('Done!')}
>
  Content
</keyframe.div>

// Chain animations
<keyframe.div onAnimationComplete={() => setNextVisible(true)}>
  First element
</keyframe.div>
```

## Dynamic Visibility

```tsx
const [isVisible, setIsVisible] = useState(true)

<keyframe.div visible={isVisible} animation={["fade", "slide-up"]}>
  Toggleable content
</keyframe.div>
```

## Presets & Defaults

Element defaults are smart (e.g. `h1` = char animations, `p` = word animations). You can override via presets or per‑element defaults.

```tsx
import { keyframe, PRESETS, TEXT_PRESETS } from '@tjcages/keyframe'

// Element presets
<keyframe.div preset={PRESETS.slideUp}>
  <div>Quick setup</div>
</keyframe.div>

// Text presets
<keyframe.h1 preset={TEXT_PRESETS.heroTitle}>
  Beautiful animated title
</keyframe.h1>

// Override preset properties
<keyframe.div preset={PRESETS.slideUp} delay={0.5}>
  Custom delay with preset
</keyframe.div>
```

## Performance Tips

- Define animation arrays outside components or memoize them
- Prefer `preset` for consistent, cached configs

```tsx
const FADE_BLUR = ["fade", "blur"]

const anim = useMemo(() => (shouldBlur ? FADE_BLUR : ["fade"]), [shouldBlur])
<keyframe.div animation={anim} />
```

## HTML Elements

Use with any intrinsic element:

```
<keyframe.div>…</keyframe.div>
<keyframe.p>…</keyframe.p>
<keyframe.h1>…</keyframe.h1>
<keyframe.section>…</keyframe.section>
<keyframe.button>…</keyframe.button>
```

## FOUC Prevention

Handled automatically via minimal CSS and timing—no extra setup required.

## Repo Scripts

- `pnpm dev` – runs library watcher and web dev together
- `pnpm build` – builds all packages
- `pnpm start` – starts the web app
- `pnpm -w typecheck` – typecheck workspace

---

Made with GSAP + React. Enjoy!
