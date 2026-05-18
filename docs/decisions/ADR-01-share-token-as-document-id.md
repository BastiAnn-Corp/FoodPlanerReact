---
id: ADR-01
status: Accepted
date: 2026-05-17
---

## ADR-01 — Share token as Firestore document ID

### Context
Anonymous (unauthenticated) recipients must be able to open a share link and read the shopping list, while the owner's private `shopping_lists` collection must remain inaccessible to anyone else. Firestore security rules can inspect `resource.data`, `request.auth`, and the document path, but **cannot inspect query parameters or verify that the client "knows" a value at read time** unless that value is part of the document path. Storing a `shareToken` as a field on a document would force one of two bad choices: open the whole collection to public read (and let attackers enumerate IDs), or require an auth path that defeats the purpose of a public link.

### Decision
The share token is generated via `crypto.randomUUID()` and used directly as the document ID of `shared_list_views/{shareToken}`. The companion `allow get, read: if true` rule on that collection is safe because retrieval requires possession of the unguessable UUID. The private `shopping_lists/{listId}` collection keeps owner-only rules and is never exposed.

### Consequences
- Public access works without an auth round-trip; share links open instantly for recipients.
- Security rules stay trivially auditable (`allow read: if true` is correct because the path itself is the credential).
- The private list stays fully isolated — sharing copies a snapshot rather than relaxing rules on the source.
- ⚠️ Revoking a share requires deleting the `shared_list_views/{token}` document; there is no expiry, rotation, or audit log of who fetched a link.
- ⚠️ UUID entropy (122 bits) is the entire security boundary — if a token ever leaks (logs, analytics, referer headers), anyone who sees it has permanent read access until manually revoked.
- ⚠️ Cannot enumerate "all shares for a user" by querying `shared_list_views` because there is no index on `ownerUid` (and adding one would weaken the model). Owners only know about shares whose token is recorded in their `shopping_lists/{listId}.shareToken` field.

### Related
- UC-13 (Share list)
- UC-13b (Shared list stays in sync) — depends on this collection layout
- ADR-02 (Batch write for owner-save + share sync)
- ADR-03 (Recipient check-off state held in memory only)
- `firestore.rules` lines 20–27
