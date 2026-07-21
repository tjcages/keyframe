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

## Parallel agents (worktrees)

When ≥2 agents touch this repo, isolate — do not share one working tree.

1. **Own branch + worktree** off `main` (prefer Linear branch name when tracked).
2. **Share env:** `bash scripts/worktree.sh setup` (symlinks only; this repo uses an empty `worktree.share`).
3. **Own preview** on an auto-chosen port if running `dev` / `dev:web` — never hardcode 3000/5173.
4. **Claim** the task/files you own; clear the claim when done.
5. **Land from main:** `bash scripts/worktree.sh land <branch>` then `git push origin main` (or open a PR if the repo requires it).
6. **Teardown:** `bash scripts/worktree.sh teardown ../keyframe-<slug> <branch>` — stop your preview first.

Status line on every agent message:

`🔌 <branch> · <one-line task> · <preview URL or n/a>`

Full method: skills pack `agent-worktrees` (methodology in the skills monorepo).
