# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root, if it exists (created lazily by `/domain-modeling` — its absence is not a problem).
- **`docs/engineering/ADRS.md`**: this repo's ADR log. Unlike the skill's default `docs/adr/*.md` layout, all ADRs live as sequential `## ADR-NNN` entries in this single file. Read the entries relevant to the area you're about to work in.
- The other docs already required by the root `CLAUDE.md` (`docs/product/*.md`, `docs/engineering/ARCHITECTURE.md`, `docs/engineering/STATUS_MODEL.md`, `docs/engineering/SECURITY_AND_LGPD.md`) — these are this repo's domain source of truth alongside `CONTEXT.md`.

This is a pnpm monorepo (`apps/web`, `apps/api`, `apps/worker`, `packages/ui`, `packages/types`, `packages/config`), but documentation is single-context: one set of product/architecture docs for the whole system, not per-package. Don't create per-package `CONTEXT.md`/ADR files unless a real per-package need emerges.

## New ADRs

When `/domain-modeling` or any skill needs to record a new decision, append a new `## ADR-NNN` section to `docs/engineering/ADRS.md` following the existing format (Contexto / Decisão / Por que, and Segurança when relevant) — don't create a separate `docs/adr/` directory.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `CONTEXT.md` (once it exists) or in the existing product docs. Don't drift to synonyms the docs explicitly avoid.

If the concept you need isn't documented yet, that's a signal: either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR in `docs/engineering/ADRS.md`, surface it explicitly rather than silently overriding:

> _Contradicts ADR-002 (idempotência de webhook), but worth reopening because…_
