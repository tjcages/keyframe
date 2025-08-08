# @tjcages/keyframe

Declarative motion primitives for React, powered by GSAP.

- Semantic API: `keyframe.div`, `keyframe.h1`, `keyframe.button`, etc.
- Text animations with word/char/line splitting
- Built‑in FOUC prevention
- Presets and sensible defaults
- Lightweight and performant

## Install

```bash
pnpm add @tjcages/keyframe
# or
npm i @tjcages/keyframe
```

## Usage

```tsx
import { keyframe } from '@tjcages/keyframe'

<keyframe.div animation={["fade", "slide-up"]} stagger={0.1}>
  <div>Card 1</div>
  <div>Card 2</div>
</keyframe.div>

<keyframe.h1 animation={["fade", "blur", "slide-up"]} per="word" stagger={0.05}>
  Animate this text word by word
</keyframe.h1>
```

## API

See the root repo README for full docs, presets, and best practices.

- Props: `animation`, `delay`, `duration`, `stagger`, `easing`, `per`, `trigger`, `visible`, `selector`, `overflow`, `segmentWrapperClassName`, `onAnimationStart`, `onAnimationComplete`.
- Types: `AnimationType = 'fade' | 'blur' | 'scale' | 'scale-up' | 'scale-down' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right'`.

## Links

- GitHub: https://github.com/tjcages/keyframe

## License

MIT © @tjcages
