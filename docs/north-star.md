# Keyframe — North Star

> **What this is.** The constitution for `@tjcages/keyframe`. Every feature, API, and agent change is judged against it. When this doc and any other doc conflict, **this wins** and the other gets corrected.
>
> **What this is not.** A feature list or roadmap. Those live elsewhere.

---

## Premise

Animations today are either **verbose per-element glue** or **agent-generated garbage**. Developers, vibe coders, and agents all end up hand-building motion for every component — or inventing an `animations.ts` that shouldn't exist. Keyframe ends that loop.

> **Keyframe is primitive animations: components that already know how to move.** Proper motion for any component, with the least amount of code — and restraint when motion isn't earned.

---

## Who it's for

1. **Developers** shipping real UI who want correct motion without an animation engineering tax
2. **Vibe coders** who want it to look right without learning a motion API
3. **Agents** that must animate a site from a prompt without inventing horrible or incorrect motion

---

## Creed (non-negotiables)

1. **It works perfectly.** Correct defaults beat clever demos. Broken or janky motion is a bug, not a style.
2. **Customizable — intuitively.** Power is available; the happy path stays obvious. Customization that needs a thesis is wrong.
3. **Built intelligently.** The library understands components and context — not just "run this tween on a node."
4. **Engine-agnostic.** Motion, GSAP, CSS, and future backends are adapters. The primitive API does not marry one library.
5. **Restraint.** Not every element should animate. Keyframe shows taste — it prevents over-animation as much as it enables motion.
6. **Plug-and-play.** Minimal packages, minimal setup, minimal code to first good result. If getting started needs a guide longer than the Creed, we failed.

---

## Out of scope

- A kitchen-sink of numerous packages the user must compose by hand
- Requiring a pile of boilerplate before anything moves
- Replacing design systems, layout engines, or full app frameworks
- Teaching every motion theory — defaults should already be best practice

---

## Philosophical "done"

You can fully animate a website — cleanly, top to bottom, with best practices — **from a single agent prompt**. No per-component custom animation files. No verbose motion glue. The agent reaches for Keyframe primitives and shows restraint.

---

## The pattern this replaces

| Before | After |
|---|---|
| Custom animation code per component / element | Aware primitives with correct defaults |
| Verbose motion glue / orphan `animations.ts` | Declarative props on the component itself |
| Agents inventing bad or excessive motion | Library-guided motion + restraint |

---

## Decision checklist

Before adding an API, default, adapter, or demo, answer:

1. **Does this reduce code** for a real component animation — or add surface area?
2. **Is the default correct** without configuration?
3. **Is customization still obvious** to a vibe coder / agent?
4. **Does this stay engine-agnostic** (or clearly sit in one adapter)?
5. **Does this show restraint** — or encourage animating everything?
6. **Can an agent use this from one prompt** without a ritual setup?

If any answer breaks a Creed line, the idea isn't ready — or it isn't Keyframe.
