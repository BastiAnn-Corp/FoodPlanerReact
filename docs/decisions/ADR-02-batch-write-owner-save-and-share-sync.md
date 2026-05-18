---
id: ADR-02
status: Accepted
date: 2026-05-17
---

## ADR-02 — Batch write for owner-save + share sync

### Context
When the owner saves a shared list, two documents must reflect the new state: the private canonical `shopping_lists/{listId}` and the public snapshot `shared_list_views/{shareToken}`. Doing these as two separate, unrelated writes risks a torn state — a recipient refreshing between the two writes would see stale data, or worse, see a snapshot that references recipes the owner has since removed. Polling, webhooks, and Cloud Functions were rejected as over-engineering for a 1-write-per-save use case that already happens client-side.

### Decision
Sharing (`shareList` in `src/lib/firebase/shoppingLists.ts`) uses a single Firestore `writeBatch` that both updates the private document to record the token and creates the public `shared_list_views/{token}` document atomically. The subsequent sync on save is implemented by `saveList` calling `syncSharedView` whenever `shareToken` is present on the payload.

### Consequences
- The initial share (`shareList`) is atomic — the token field on the private list and the public snapshot land together or not at all.
- No background infrastructure (Cloud Functions, schedulers) is needed; the client owns the sync.
- ⚠️ `saveList` performs the save and the share-sync as **two sequential awaits** rather than a single batch (see `saveList` body: `setDoc`/`addDoc` then `await syncSharedView`). If the second write fails the canonical list is already saved and the shared view goes stale until the next successful save. UC-13b's "atomic" promise is therefore only approximate today; reconciling this is tracked under UC-13b status `PARTIAL`.
- ⚠️ All writes happen from the client; a malicious owner could in theory submit divergent payloads for the two documents. Security rules mitigate but do not eliminate this — they validate `ownerUid` matches but do not cross-check recipe contents.

### Related
- UC-13 (Share list) — initial share is fully batched
- UC-13b (Shared list stays in sync) — currently PARTIAL, not single-batch
- ADR-01 (Share token as document ID) — defines the two-document layout this ADR keeps in sync
