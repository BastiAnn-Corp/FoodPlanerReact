---
id: ADR-03
status: Accepted
date: 2026-05-17
---

## ADR-03 — Recipient check-off state held in memory only

### Context
Multiple recipients may open the same share link and check off items concurrently while shopping. Persisting their check-off state to Firestore would require either (a) writeable anonymous access to `shared_list_views`, expanding the attack surface to anyone who knows the token, or (b) per-recipient subdocuments keyed by some client-generated identity, which introduces merge conflicts when two people check different items in the same row. Neither cost is justified for a shared grocery session that ends when the shopping is done.

### Decision
In `src/app/shopping/page.tsx`, `toggleIngredient` only calls `updateChecked` when `pageMode === "owner"`. For `readonly` (recipient) and `anonymous` modes, the `checkedIds` Set is held in React state and never written to Firestore. Recipients always start with an empty checked set (`setCheckedIds(new Set())` in the readonly load branch).

### Decision rationale (Likely)
Likely: the team accepted "state lost on tab close" because a shared shopping session is short and the alternative (multi-writer sync) is disproportionately complex.

### Consequences
- Security rules for `shared_list_views` keep `allow write` gated on `request.auth.uid == ownerUid`; no anonymous write path exists.
- Zero merge conflicts between concurrent recipients — each device has its own independent view.
- Recipients always see a fresh, unchecked list on load, which matches "I'm about to start shopping" expectations.
- ⚠️ Closing the tab or refreshing wipes recipient progress. If a recipient is mid-shop and their phone screen times out aggressively, they will lose check marks.
- ⚠️ Recipients cannot collaborate (e.g. one person at the produce aisle, one at dairy) — each sees only their own check-offs. Revisit this ADR if explicit collaborative shopping is requested.

### Related
- UC-10 (Check off items) — owner path persists, recipient path does not
- UC-13 (Share list) — defines the recipient role this ADR governs
- ADR-01 (Share token as document ID) — public read rule depends on no public write path existing
