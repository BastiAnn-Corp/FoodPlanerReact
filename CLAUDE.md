# FoodPlanerReact — Claude Code Instructions

## Project overview

A Next.js + Firebase app for meal planning. Users can create recipes, plan weekly menus,
and generate shopping lists. Deployed on GitHub Pages under the subpath `/FoodPlanerReact`.

Key paths: `src/app/` (pages), `src/components/` (UI), `src/lib/firebase/` (data layer),
`docs/usecases/` (feature specs), `docs/decisions/` (ADRs).

---

## Feature documentation practice

These rules apply whenever we are building or modifying a named feature.

### Starting a feature

1. If the user has not stated a **why**, ask for it before any design work.
   One sentence is enough. Do not proceed until you have it.
2. Check `docs/usecases/` for an existing doc on this feature before creating a new one.
3. Use `docs/templates/uc-template.md` as the starting structure.
4. Draft the UC list and show it to the user **before writing any files**.
   Scope is most likely to be wrong at this moment — catch it here.
5. Once confirmed, create `docs/usecases/<feature-slug>.md`. All UCs start as `PLANNED`.

### During implementation

- When a UC is implemented, update its status to `DONE` or
  `PARTIAL — <one line on what is missing>` immediately — not at the end.
- When you fix a bug that was not in the original design, add a BUG entry to the doc
  at the same moment you write the fix. Root cause is freshest right then.
- When you make an architectural decision whose WHY is not obvious from the code,
  create an ADR in `docs/decisions/` using `docs/templates/adr-template.md` before
  moving on. Rule of thumb: if a competent developer would ask "why did they do it
  this way?", it needs an ADR.
- Add a `**See:** ADR-NN` line to any UC governed by a new ADR.

### Wrapping up

When the user declares a feature done or asks to open a PR, do a final doc pass:
- Verify all UC statuses reflect actual code (read the files, don't assume).
- Check for undocumented architectural decisions.
- Add a `### Known gaps` section under Notes for anything deferred.

### Session continuity

At the start of any session that touches an existing feature, read its doc first and
flag any UC whose status looks stale given recent commits. Do not wait to be asked.

---

## ADR conventions

- Files live in `docs/decisions/ADR-NN-slug.md`.
- Number sequentially from the highest existing ADR.
- Status values: `Accepted` | `Deprecated` | `Superseded by ADR-NN`.
- Only write an ADR when the WHY cannot be inferred from the code alone.
  Do not document obvious or conventional choices.
- The `⚠️` prefix on a consequence bullet means: if this changes, revisit the ADR.

---

## Code conventions

- TypeScript strict mode is on.
- Firebase basePath is `/FoodPlanerReact` — never generate bare share URLs;
  always use the full production URL or `window.location.origin + basePath`.
- Firestore security rules and indexes are deployed separately via
  `firebase deploy --only firestore`. Deploying only rules leaves indexes untouched.
- Anonymous users have no Firestore write path — design accordingly.
