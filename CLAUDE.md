# keyframe — agent instructions

## Linear tracking (non-negotiable)

Every agent, every session. Linear workspace: **team "Off-brand"**, **project "keyframe"**.

Product is the **library** (`@tjcages/keyframe`). `apps/web` is a showcase site for demos — not the product.

Milestones: `Library foundation` (library shipped) · `Showcase site` (active demos). Project label: `Tool`.

- **Search before creating.** Never file a duplicate for work already tracked.
- **Non-trivial work gets an issue** in **keyframe**, filed when the work is identified. Typos don't need one; a library API change, release, or showcase demo does.
- **Every issue gets a milestone.** Use `Library foundation` or `Showcase site` (or add a milestone if a real new phase appears).
- **Lifecycle is real.** `Backlog` → `In Progress` at start → `Done` only when actually shipped/committed. Session ending mid-work leaves it `In Progress` with a comment.
- **Wire real dependencies** (`blockedBy`/`blocks`) when one issue truly gates another.
- **Close the loop before ending a session** — update issue state/comments for any tracked work before finishing.
- Prefer Linear’s generated branch names.
- Commit to **main** until this product has real users (then use a branch/PR).
