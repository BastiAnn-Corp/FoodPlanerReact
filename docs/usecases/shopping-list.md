# Use Cases: Shopping List

Feature: A dedicated `/shopping` page where users select recipes and receive a consolidated grocery list with metric unit merging, aisle grouping, persistence for logged users, and export/share capabilities.

---

## UC-1 — View shopping page (anonymous)

**Status:** `DONE` <!-- src/app/shopping/page.tsx:ShoppingPageContent (pageMode === "anonymous" + AnonBanner) -->
**See:** ADR-06

**GIVEN** a user is not logged in and navigates to `/shopping`  
**WHEN** the page loads  
**THEN** they see an empty list with a prompt to add recipes, and a banner saying "Log in to save your list across sessions"

---

## UC-2 — View shopping page (logged user, returning)

**Status:** `DONE` <!-- src/lib/firebase/shoppingLists.ts:getMostRecentList; src/app/shopping/page.tsx useEffect "owner" branch -->
**See:** ADR-04, ADR-06, ADR-07

**GIVEN** a logged user navigates to `/shopping`  
**WHEN** the page loads  
**THEN** their most recently used list loads automatically with all previously selected recipes and checked-off items restored

---

## UC-3 — Add recipes to the list

**Status:** `DONE` <!-- src/app/shopping/page.tsx:addRecipe; src/util/shoppingListUtils.ts:recipeToShoppingListRecipe -->
**See:** ADR-05

**GIVEN** a user is on `/shopping`  
**WHEN** they search and select one or more recipes from the selector  
**THEN** the recipes appear as chips at the top of the page and the ingredient list updates immediately

---

## UC-4 — Adjust portions per recipe

**Status:** `DONE` <!-- src/app/shopping/page.tsx:changePortions; src/util/shoppingListUtils.ts:scaleIngredient -->

**GIVEN** a user has added a recipe to the list  
**WHEN** they change the portion multiplier (e.g. ×2) on that recipe's chip  
**THEN** all ingredient quantities for that recipe are scaled and the consolidated list recalculates

---

## UC-5 — Remove a recipe from the list

**Status:** `DONE` <!-- src/app/shopping/page.tsx:removeRecipe -->

**GIVEN** a user has recipes in their list  
**WHEN** they dismiss a recipe chip  
**THEN** the consolidated ingredient list recalculates removing that recipe's contribution

---

## UC-6 — Metric unit consolidation

**Status:** `DONE` <!-- src/util/shoppingListUtils.ts:resolveQty + toGrams/toMl/formatMass/formatVolume -->

**GIVEN** the same ingredient appears across recipes with compatible metric units (`grs`/`kg` or `ml`/`lt`)  
**WHEN** the list is rendered  
**THEN** quantities are summed in a normalized unit (e.g. 500grs + 1kg → 1.5kg displayed as the dominant/largest unit)

---

## UC-7 — Mixed unit merging (same ingredient, incompatible units)

**Status:** `DONE` <!-- src/util/shoppingListUtils.ts:resolveQty mixed-group branch (joins parts with " + ") -->

**GIVEN** the same ingredient appears in two recipes with incompatible units (e.g. `300grs` and `2 unidades`)  
**WHEN** the list is rendered  
**THEN** both quantities are shown on a single line: "Tomatoes — 300g + 2 units" (no forced conversion)

---

## UC-8 — Non-metric units left as-is

**Status:** `DONE` <!-- src/util/shoppingListUtils.ts:resolveQty culinary/count groups -->

**GIVEN** an ingredient uses `cdta`, `cda`, `tz`, or `unidad`  
**WHEN** the same ingredient appears multiple times with the same non-metric unit  
**THEN** quantities are summed as plain numbers (e.g. 1 cdta + 2 cdta = 3 cdta); if units differ, they are listed separately on the same line

---

## UC-9 — Sort by aisle (default)

**Status:** `DONE` <!-- src/util/shoppingListUtils.ts:buildAisles (sortMode 'aisle' grouped by marketAisles); src/components/Shopping/organisms/AisleGroup.tsx -->

**GIVEN** a user has a populated shopping list  
**WHEN** the list renders (or they select "By aisle" sort)  
**THEN** ingredients are grouped under collapsible aisle headers, ordered to match a logical supermarket walk

---

## UC-10 — Check off items while shopping

**Status:** `DONE` <!-- src/app/shopping/page.tsx:toggleIngredient; src/lib/firebase/shoppingLists.ts:updateChecked -->
**See:** ADR-03, ADR-06

**GIVEN** a user is viewing their shopping list  
**WHEN** they tap a checkbox next to an ingredient  
**THEN** the item is marked as done (strikethrough, muted color); for logged users this state is persisted; unchecking restores it

---

## UC-11 — Clear list and start over (logged user)

**Status:** `PARTIAL — handleClear logic exists in page.tsx but is not wired to any UI; ActionBar has no Clear button and no confirmation dialog component exists` <!-- src/app/shopping/page.tsx:handleClear (defined but unreferenced); src/components/Shopping/organisms/ActionBar.tsx (no onClear prop); no ClearListDialog under src/components/Shopping/dialogs/ -->

**GIVEN** a logged user has an existing list  
**WHEN** they tap "Clear list" and confirm  
**THEN** the current list is wiped (recipes and check-off state reset) and they start fresh — no new list is created, the same list object is reused

---

## UC-12 — Multiple saved lists (logged user)

**Status:** `DONE` <!-- src/app/shopping/page.tsx:handleNewList + handleSelectList; src/components/Shopping/dialogs/ListSwitcherModal.tsx; src/lib/firebase/shoppingLists.ts:createList + getUserLists -->
**See:** ADR-04, ADR-07

**GIVEN** a logged user wants to plan for different occasions  
**WHEN** they tap "New list"  
**THEN** a new empty list is created, the previous one is preserved, and the new one becomes the active list; a list switcher lets them navigate between saved lists

---

## UC-13 — Share list (read-only + checkable)

**Status:** `DONE` <!-- src/lib/firebase/shoppingLists.ts:shareList (writeBatch updates shopping_lists + creates shared_list_views/{token}); src/app/shopping/page.tsx:handleShare; src/components/Shopping/dialogs/ShareDialog.tsx -->
**See:** ADR-01, ADR-03

**GIVEN** a logged user has a list they want to share  
**WHEN** they tap "Share" and copy the generated link  
**THEN** a link is generated in the form `https://bastiann-corp.github.io/FoodPlanerReact/shopping?token=<shareToken>` and anyone with that link can open it, see the full ingredient list, and check items off — but cannot add/remove recipes or edit quantities

---

## UC-13b — Shared list stays in sync

**Status:** `PARTIAL — saveList calls syncSharedView via a sequential await rather than a single writeBatch, so the canonical list and shared snapshot are not written atomically` <!-- src/lib/firebase/shoppingLists.ts:saveList (setDoc/addDoc, then await syncSharedView with updateDoc — two separate round-trips, not batched) -->
**See:** ADR-02

**GIVEN** a logged user has shared a list and later modifies it (adds/removes recipes, changes portions)  
**WHEN** they save the list  
**THEN** the shared view is updated atomically in the same write — any recipient who refreshes their link sees the current state immediately, with no action required from the owner

---

## UC-14 — Export to clipboard (Google Keep format)

**Status:** `DONE` <!-- src/app/shopping/page.tsx:handleCopy; src/util/shoppingListUtils.ts:buildKeepText -->

**GIVEN** a user has a shopping list  
**WHEN** they tap "Copy for Keep"  
**THEN** the clipboard receives one line per ingredient in the format `[ ] 1.5 kg Tomatoes`, which Google Keep converts to checkboxes on paste

---

## Notes

### Unit consolidation rules

| Unit group | Units | Behaviour |
|---|---|---|
| Weight (metric) | `grs`, `kg` | Normalize to grams, display in kg if ≥ 1000g |
| Volume (metric) | `ml`, `lt` | Normalize to ml, display in L if ≥ 1000ml |
| Volume (imperial/informal) | `cdta`, `cda`, `tz` | Sum only if same unit; otherwise list separately on one line |
| Count | `unidad` | Sum as plain integer |
| None | `-` | List as-is, no merging |

### Mixed-unit display format

When an ingredient appears with incompatible units across recipes, display them together on one row:

```
Tomatoes    300g + 2 units
```

### Persistence model

| User type | Storage | Lifetime |
|---|---|---|
| Anonymous | React state (in-memory) | Lost on tab/browser close |
| Logged | Firestore, scoped to user UID | Permanent, private by default |

### Shared list permissions

| Action | Owner | Recipient (via link) |
|---|---|---|
| View ingredients | ✅ | ✅ |
| Check off items | ✅ | ✅ |
| Add/remove recipes | ✅ | ❌ |
| Edit quantities | ✅ | ❌ |
| Share further | ✅ | ❌ |

### Share URL format

Production base URL: `https://bastiann-corp.github.io/FoodPlanerReact/`

Share links must be rooted at this URL since the app is hosted on GitHub Pages under a subpath. The share route follows the pattern:

```
https://bastiann-corp.github.io/FoodPlanerReact/shopping?token=<shareToken>
```

The `token` is the only parameter needed — it acts as both the lookup key and the access credential (no authentication required to view). The data layer resolves the list by querying `shared_list_views/{shareToken}` directly.

**Implication for routing**: The Next.js `basePath` is already set to `/FoodPlanerReact` for GitHub Pages deployment. Share links must respect this — never generate bare `/shopping?token=...` URLs for sharing; always use the full production URL or rely on `window.location.origin + basePath`.

---

### Shared list — technical considerations

#### Why `shared_list_views/{shareToken}` (token as document ID)?

Firestore security rules cannot inspect query parameters or verify that a client "knows" a value at read time unless that value is part of the document path. Storing the share token as the document ID means a simple `allow read: if true` on the `shared_list_views` collection is safe — only someone who knows the unguessable token can ever retrieve the document. The `shopping_lists` collection remains private (owner-only reads/writes) throughout.

#### Document structure

`shared_list_views/{shareToken}`:
```
{
  listId: string,          // back-reference to the source list
  ownerName: string,       // display name of the owner
  listName: string,        // name of the list at time of last save
  recipes: IShoppingListRecipe[],   // full recipe + ingredient snapshot
  updatedAt: Timestamp
}
```

#### Auto-sync via batch write

When the owner saves their list, a single `writeBatch` atomically updates both:
- `shopping_lists/{listId}` — the private canonical list
- `shared_list_views/{shareToken}` — the public snapshot

Any recipient who refreshes the share link immediately sees the current state. No webhook, no polling, no secondary trigger needed.

#### Checked state for recipients

Recipients can check items off while shopping, but that state is held **in-memory only** (React state) on their device — it is never written to Firestore. This keeps security rules simple (no write path for anonymous users on `shared_list_views`) and avoids merge conflicts between multiple recipients checking different items. State is lost on tab close, which is acceptable for a shared grocery session.

#### Edge cases

| Scenario | Behaviour |
|---|---|
| Owner deletes a recipe after sharing | Next save overwrites the snapshot; recipients see updated list on refresh |
| Owner renames the list | Reflected in `shared_list_views.listName` on next save |
| Owner wants to revoke access | Delete the `shared_list_views/{shareToken}` document; the link 404s immediately |
| Owner generates a new share link | A new `shareToken` is created; old token document can be deleted or left to expire |

---

## Known issues & fixes

### BUG-01 — Recipe chips overflow horizontally on mobile (fixed in PR #8)

**Status:** `FIXED in PR #8 (e7e8832)` <!-- src/components/Shopping/organisms/RecipeSelector.tsx (flexWrap: 'wrap') -->

**Symptom:** On small screens or narrow windows, selected recipe chips in the `RecipeSelector` formed a single horizontal row with hidden overflow scroll. This made chips unreachable and hid the remove button on the last chip.

**Root cause:** The chip container had `flexWrap: { xs: 'nowrap', md: 'wrap' }` combined with `overflowX: 'auto'`, deliberately enabling horizontal scroll on mobile. This was a design decision that turned out to degrade usability.

**Fix:** Replaced with `flexWrap: 'wrap'` on all breakpoints, removing the horizontal scroll entirely. Chips now wrap to new lines consistently regardless of screen size.

**File changed:** `src/components/Shopping/organisms/RecipeSelector.tsx`

---

### BUG-02 — Saved lists not appearing in the list switcher (fixed in PR #8)

**Status:** `FIXED in PR #8 (fdbc20a)` <!-- src/lib/firebase/shoppingLists.ts:getUserLists + getMostRecentList (orderBy removed, client-side sort by updatedAt); src/app/shopping/page.tsx Promise.all .catch added -->
**See:** ADR-04

**Symptom:** Logged-in users opened the "Mi lista" dropdown and saw no lists, even when lists existed in Firestore.

**Root cause:** `getMostRecentList` and `getUserLists` in `shoppingLists.ts` combined `where("ownerUid", "==", uid)` with `orderBy("updatedAt", "desc")`. Firestore requires a **composite index** for queries that filter on one field and sort on a different one. That index was never deployed (the `firebase deploy` step failed with a 401 auth error during initial setup, and only the security rules were added manually). Without the index, both queries threw a Firestore error at runtime.

The error was silently swallowed because the `Promise.all` in `page.tsx` had no `.catch()`, so `allLists` stayed `[]` and the switcher appeared empty with no feedback.

**Fix (two parts):**
1. Removed `orderBy` from both Firestore queries and replaced with client-side sorting by `updatedAt`. A plain `where` on a single field uses Firestore's automatic single-field index — no composite index required.
2. Added `.catch(err => console.error(...))` to the `Promise.all` so future Firestore errors are visible in the browser console.

**Files changed:** `src/lib/firebase/shoppingLists.ts`, `src/app/shopping/page.tsx`

**Note on composite indexes:** Firestore security rules and composite indexes are deployed separately. Rules control access; indexes control query capability. Both must be present for a query to succeed. The `firebase deploy --only firestore` command deploys both from `firestore.rules` and `firestore.indexes.json` respectively — deploying only rules leaves indexes untouched.
