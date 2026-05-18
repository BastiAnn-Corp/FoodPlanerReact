# Use Cases: <Feature Name>

Feature: <One sentence — what this feature does, for whom, and the core value it delivers.>

**Why:** <One sentence — the motivation. What problem does this solve, or what does it unlock?>

---

## UC-1 — <Name>

**Status:** `PLANNED` <!-- update to DONE / PARTIAL — <what's missing> when implemented -->

**GIVEN** <precondition — system state and user context>
**WHEN** <trigger — the action the user takes or the event that fires>
**THEN** <observable outcome — what the user sees or what the system does>

---

## UC-2 — <Name>

**Status:** `PLANNED`

**GIVEN** …
**WHEN** …
**THEN** …

---

<!-- Add more UCs following the same pattern. -->
<!-- UC numbering is sequential. Variants of a UC use lettered suffixes: UC-3b. -->

---

## Notes

### <Business rule or reference table title>

<!--
Use this section for:
- Reference tables (unit rules, permission matrices, persistence model)
- Mixed-case or edge-case display formats
- Constraints that cut across multiple UCs (write these as invariants, not prose)

Example invariant block:
**Invariants**
- The same list object is always mutated on clear — a new document is never created.
- Anonymous users have no write path to Firestore.
-->

---

## Known gaps

<!--
Deliberately deferred scope. Add entries here rather than leaving UCs in PLANNED
indefinitely when the decision to defer is intentional.

Format:
- <UC or capability> — deferred because <reason>. Revisit when <condition>.
-->

---

## Bugs

<!--
Add BUG entries here as they are found and fixed. Do not wait until the end.

### BUG-01 — <Short description> (<status: fixed in PR #N | open>)

**Symptom:** What the user observed.

**Root cause:** Why it happened. Be specific — file and function if relevant.

**Fix:** What changed and why that resolves it.

**Files changed:** `src/...`

**See:** UC-N (which use case this bug affected)
-->
