# Milestones: Simplify goal drafting while hardening runtime execution and audit

Free-form implementation log. Record meaningful phase changes, successful milestones, failed attempts, setbacks, fixes, validation notes, and decisions. Use third-level headings with timestamps down to seconds, for example `### 2026-05-13 14:16:36 - Short milestone title`. No strict schema is required.

### 2026-05-13 00:00:00 - Spec established

Created the initial PRODUCT.md and TECH.md for simplifying `/goal-set` and `/goal-sisyphus` drafting while preserving strict active-goal execution and independent completion audit behavior. Research found that drafting validators were already softened in `extensions/goal-draft.ts`, but `extensions/goal.ts` still carried heavier session state through `draftingFor`, `draftId`, `questionsAsked`, `draftingNudgesByDraftId`, hidden prompt reinjection, and drafting-specific turn hooks.

### 2026-05-13 16:54:11 - Milestone

Implemented the lightweight goal confirmation refactor. `extensions/goal.ts` now uses a thin `confirmationIntent` instead of `draftId`/`questionsAsked` drafting state, starts `/goal-set` and `/goal-sisyphus` through a normal confirmation prompt, removes drafting nudges and prompt reinjection, and keeps strict execution/audit gates intact. `extensions/goal-draft.ts` now validates against confirmation intent, ignores deprecated `draftId` for compatibility, and emits shorter lightweight confirmation guidance. Updated README, architecture/design docs, PRODUCT/TECH decisions, and goal-draft tests. Validation passed: `npm run check`, `npm test`, `npm pack --dry-run`, and `git diff --check`.

### 2026-05-13 17:41:36 - Milestone

Updated the command model after user direction: `/goals` and `/sisyphus` now start discussion/research/grilling-based confirmation flows, while `/goals-set` and `/sisyphus-set` directly create and start goals from the supplied objective. Removed registration of the redundant `/goal-set`, `/goal-sisyphus`, and `/goal-replace` creation aliases; refreshed prompt/validator/docs wording for the new command surface. Validation passed with `npm run check` and `npm test` (75 tests).

### 2026-05-17 15:00:00 - Custom tools count as active-goal progress by default

Fixed active-goal continuation gating so unknown extension/custom tools are treated as meaningful progress without requiring a central pi-goal allowlist. Known dialogue/inspection tools remain non-progress, and lifecycle stop tools still set `turnStoppedFor`; ordinary non-progress calls no longer stop sibling tool calls in the same batch. This prevents multi-call research batches such as `websearch`/`webfetch` from losing later results after the first custom tool call.
