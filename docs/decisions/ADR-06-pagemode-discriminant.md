---
id: ADR-06
status: Accepted
date: 2026-05-17
---

## ADR-06 — `pageMode` discriminant replacing two boolean constants

### Context
The shopping page has three mutually exclusive operating modes: an anonymous visitor, a logged-in owner, and a recipient viewing a shared link via `?token=`. An earlier version of the page used two boolean constants (`USER_IS_LOGGED_IN`, `IS_READONLY`) to gate behaviour, which permits the unrepresentable combination `logged-in && readonly` and forces every gated code path to evaluate both booleans together. Bugs of the form "I forgot to also check the other flag" are likely under that shape.

### Decision
`src/components/Shopping/types.ts` defines `type PageMode = 'owner' | 'readonly' | 'anonymous'`. `ShoppingPageContent` derives it once from auth + URL token (`shareToken ? "readonly" : user ? "owner" : "anonymous"`) and every gated handler (`toggleIngredient`, `handleSave`, `handleClear`, `handleShare`) compares against the single discriminant.

### Consequences
- The unrepresentable state is gone; TypeScript's `switch` exhaustiveness catches new modes if any are added.
- Each handler has a single, readable guard (`if (pageMode !== "owner")`) instead of compound boolean expressions.
- Derivation is centralized — auth and URL changes flow through one expression rather than multiple `useEffect`s.
- ⚠️ Adding a fourth mode (e.g. "editor invited via link") requires touching every guard. The discriminant is correct for the current three roles but is not extensible to per-action permissions; if role complexity grows, a capability-bag pattern would replace this.

### Related
- UC-1 (Anonymous), UC-2 (Owner), UC-13 (Readonly recipient) — the three modes
- UC-10 (Check off) — uses `pageMode === "owner"` to decide whether to persist
