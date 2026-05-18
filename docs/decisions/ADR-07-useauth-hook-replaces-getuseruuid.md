---
id: ADR-07
status: Accepted
date: 2026-05-17
---

## ADR-07 — `useAuth` hook replaces synchronous `getUserUUID`

### Context
A previous helper `getUserUUID()` in `authentication.ts` returned `authApp.currentUser?.uid ?? null` synchronously. Firebase's `onAuthStateChanged` is asynchronous and `currentUser` is `null` until the SDK finishes restoring the session from IndexedDB, so any caller invoking `getUserUUID()` during the first render of a page reliably got `null` — even for users who were in fact logged in. The shopping page in particular needs the UID to load saved lists; using the broken helper meant logged users saw the anonymous experience on first render and only recovered if the page happened to re-render after auth resolved.

### Decision
A `useAuth()` hook in `src/hooks/useAuth.ts` subscribes to `onAuthStateChanged` in a `useEffect`, exposes `{ user, loading }`, and unsubscribes on unmount. The shopping page guards data loading with `if (authLoading) return;` inside its load effect, ensuring the first list-load attempt only fires after auth has resolved.

### Consequences
- The race condition is structurally impossible; data-loading effects can declare `authLoading` as a dependency and React schedules them correctly.
- The `loading` flag enables intentional skeleton/blank states instead of flashes of the wrong UI.
- The subscription is cleaned up on unmount, avoiding the memory leak the bare helper could not address.
- ⚠️ Every consumer pays for its own subscription (one `onAuthStateChanged` listener per component using the hook). For the current handful of callers this is fine; a shared `AuthContext` provider would be the next step if usage grows.

### Related
- UC-2 (View shopping page, returning user) — depends on `useAuth` resolving before list load
- UC-12 (Multiple saved lists) — same dependency
- ADR-06 (`pageMode` discriminant) — `pageMode` derivation reads `user` from this hook
