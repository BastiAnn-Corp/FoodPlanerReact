# Use Cases: Shopping List

Feature: A dedicated `/shopping` page where users select recipes and receive a consolidated grocery list with metric unit merging, aisle grouping, persistence for logged users, and export/share capabilities.

---

## UC-1 — View shopping page (anonymous)

**GIVEN** a user is not logged in and navigates to `/shopping`  
**WHEN** the page loads  
**THEN** they see an empty list with a prompt to add recipes, and a banner saying "Log in to save your list across sessions"

---

## UC-2 — View shopping page (logged user, returning)

**GIVEN** a logged user navigates to `/shopping`  
**WHEN** the page loads  
**THEN** their most recently used list loads automatically with all previously selected recipes and checked-off items restored

---

## UC-3 — Add recipes to the list

**GIVEN** a user is on `/shopping`  
**WHEN** they search and select one or more recipes from the selector  
**THEN** the recipes appear as chips at the top of the page and the ingredient list updates immediately

---

## UC-4 — Adjust portions per recipe

**GIVEN** a user has added a recipe to the list  
**WHEN** they change the portion multiplier (e.g. ×2) on that recipe's chip  
**THEN** all ingredient quantities for that recipe are scaled and the consolidated list recalculates

---

## UC-5 — Remove a recipe from the list

**GIVEN** a user has recipes in their list  
**WHEN** they dismiss a recipe chip  
**THEN** the consolidated ingredient list recalculates removing that recipe's contribution

---

## UC-6 — Metric unit consolidation

**GIVEN** the same ingredient appears across recipes with compatible metric units (`grs`/`kg` or `ml`/`lt`)  
**WHEN** the list is rendered  
**THEN** quantities are summed in a normalized unit (e.g. 500grs + 1kg → 1.5kg displayed as the dominant/largest unit)

---

## UC-7 — Mixed unit merging (same ingredient, incompatible units)

**GIVEN** the same ingredient appears in two recipes with incompatible units (e.g. `300grs` and `2 unidades`)  
**WHEN** the list is rendered  
**THEN** both quantities are shown on a single line: "Tomatoes — 300g + 2 units" (no forced conversion)

---

## UC-8 — Non-metric units left as-is

**GIVEN** an ingredient uses `cdta`, `cda`, `tz`, or `unidad`  
**WHEN** the same ingredient appears multiple times with the same non-metric unit  
**THEN** quantities are summed as plain numbers (e.g. 1 cdta + 2 cdta = 3 cdta); if units differ, they are listed separately on the same line

---

## UC-9 — Sort by aisle (default)

**GIVEN** a user has a populated shopping list  
**WHEN** the list renders (or they select "By aisle" sort)  
**THEN** ingredients are grouped under collapsible aisle headers, ordered to match a logical supermarket walk

---

## UC-10 — Check off items while shopping

**GIVEN** a user is viewing their shopping list  
**WHEN** they tap a checkbox next to an ingredient  
**THEN** the item is marked as done (strikethrough, muted color); for logged users this state is persisted; unchecking restores it

---

## UC-11 — Clear list and start over (logged user)

**GIVEN** a logged user has an existing list  
**WHEN** they tap "Clear list" and confirm  
**THEN** the current list is wiped (recipes and check-off state reset) and they start fresh — no new list is created, the same list object is reused

---

## UC-12 — Multiple saved lists (logged user)

**GIVEN** a logged user wants to plan for different occasions  
**WHEN** they tap "New list"  
**THEN** a new empty list is created, the previous one is preserved, and the new one becomes the active list; a list switcher lets them navigate between saved lists

---

## UC-13 — Share list (read-only + checkable)

**GIVEN** a logged user has a list they want to share  
**WHEN** they tap "Share" and copy the generated link  
**THEN** a link is generated in the form `https://bastiann-corp.github.io/FoodPlanerReact/shopping?list=<id>&token=<token>` and anyone with that link can open it, see the full ingredient list, and check items off — but cannot add/remove recipes or edit quantities

---

## UC-14 — Export to clipboard (Google Keep format)

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

Share links must be rooted at this URL since the app is hosted on GitHub Pages under a subpath. The share route should follow the pattern:

```
https://bastiann-corp.github.io/FoodPlanerReact/shopping?list=<listId>&token=<shareToken>
```

The `token` serves as an unguessable access key (no authentication required to view). The data layer must validate the token against the list before serving the read-only view.

**Implication for routing**: The Next.js `basePath` is already set to `/FoodPlanerReact` for GitHub Pages deployment. Share links must respect this — never generate bare `/shopping?list=...` URLs for sharing; always use the full production URL or rely on `window.location.origin + basePath`.
