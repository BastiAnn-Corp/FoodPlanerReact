---
id: ADR-04
status: Accepted
date: 2026-05-17
---

## ADR-04 — Client-side sort replacing Firestore orderBy

### Context
`getUserLists` and `getMostRecentList` originally combined `where("ownerUid", "==", uid)` with `orderBy("updatedAt", "desc")`. Firestore requires a **composite index** on `(ownerUid ASC, updatedAt DESC)` for any query that filters one field and sorts on a different one. That index was never deployed: the initial `firebase deploy` step failed with a 401 auth error, and only the security rules were uploaded manually afterwards. Without the index Firestore throws at query time, the error was silently swallowed by a `Promise.all` with no `.catch()`, and the list switcher appeared empty (BUG-02). The proper fix is to deploy the composite index from `firestore.indexes.json` via `firebase deploy --only firestore`. That fix was blocked on the same auth issue and not pursued during the bug fix window.

### Decision
**This is a forced workaround, not a preferred design.** Both queries drop `orderBy` entirely, use only the single-field `where("ownerUid", "==", uid)` (which Firestore indexes automatically), and sort the result client-side by `updatedAt.toMillis()` descending in JS. The cost is paid per query rather than amortized into an index.

### Consequences
- Queries succeed immediately for any user without requiring an `firestore.indexes.json` deploy step.
- The bug is unblocked without depending on resolving the Firebase CLI auth problem.
- ⚠️ Sort cost is O(n) per call, computed on the client. For users with dozens of lists this is invisible; for users with thousands it would become noticeable. There is no upstream limit on list count today, so this scales linearly forever.
- ⚠️ The entire matching document set is downloaded before sorting — Firestore cannot apply `limit()` meaningfully without an index because there is no server-side order to limit. `getMostRecentList` in particular reads every list the user owns just to pick the newest one.
- ⚠️ **The proper solution is to deploy the composite index and restore `orderBy("updatedAt", "desc")` with `limit(1)` on `getMostRecentList`.** Revisit this ADR once the Firebase deploy auth is fixed and `firestore.indexes.json` is in place; the code change to revert is ~10 lines.

### Related
- BUG-02 (Saved lists not appearing in the list switcher) — the root cause this ADR documents
- UC-2 (View shopping page, returning user) — depends on `getMostRecentList`
- UC-12 (Multiple saved lists) — depends on `getUserLists`
