# Use Cases: Latest Recipes Strip

Feature: A horizontal, scrollable strip at the top of `/recipes` showing the 7 most recently added recipes as compact cards. Surfaces newcomer activity, highlights fresh content, and encourages users to contribute their own recipes.

**Why:** Signal that the app is active and receiving new content; create social proof that nudges users into adding recipes themselves.

---

## UC-1 — View latest recipes strip

**Status:** `DONE` <!-- src/app/recipes/page.tsx mounts `<LatestRecipesStrip />`; src/components/Recipe/LatestRecipesStrip.tsx -->

**GIVEN** a user navigates to `/recipes`
**WHEN** the page loads
**THEN** a horizontal strip labeled "ÚLTIMAS RECETAS" appears above the filter sidebar and recipe list, showing up to 7 recipes ordered by `createdAt` descending

---

## UC-2 — Identify the most recent recipe

**Status:** `DONE` <!-- src/components/Recipe/RecipeCard.tsx (`isLatest` prop renders "Última" badge); LatestRecipesStrip passes `idx === 0` -->

**GIVEN** the latest recipes strip is rendered with at least one card
**WHEN** the user looks at the first card in the strip
**THEN** the first card displays an "Última" badge in the top-right corner, distinguishing it from the others

---

## UC-3 — Scroll the strip horizontally

**Status:** `DONE` <!-- src/components/Recipe/LatestRecipesStrip.tsx (`overflowX: auto` + hidden scrollbar) -->

**GIVEN** the strip contains more cards than fit in the viewport (typical on mobile)
**WHEN** the user swipes / scrolls horizontally on the strip
**THEN** the cards scroll to reveal the next ones, with the scrollbar hidden for a clean appearance

---

## UC-4 — Open a recipe from the strip

**Status:** `DONE` <!-- src/components/Recipe/RecipeCard.tsx (`component="a"` with `href={envVars.baseURL + /recipes/${id}}`) -->

**GIVEN** the user sees a recipe card in the strip
**WHEN** they click / tap the card
**THEN** they navigate to that recipe's detail page (`/recipes/[id]`), same target as the existing list rows

---

## UC-5 — Recipe receives a creation timestamp

**Status:** `DONE` <!-- src/lib/firebase/recipes.ts:createRecipe injects `createdAt: serverTimestamp()` -->

**GIVEN** a logged-in user submits a new recipe via `/recipes/create`
**WHEN** the recipe is written to Firestore
**THEN** the document is created with `createdAt` and `modifiedAt` set to the Firestore server timestamp, and it becomes eligible to appear in the strip

---

## UC-6 — Recipe receives a modification timestamp

**Status:** `DONE` <!-- src/lib/firebase/recipes.ts:updateRecipe & updateRecipeIngredients set `modifiedAt: serverTimestamp()` -->

**GIVEN** a logged-in user edits an existing recipe (full update or ingredients-only update)
**WHEN** the change is written to Firestore
**THEN** the document's `modifiedAt` field is set to the current server timestamp; `createdAt` is never touched

---

## UC-7 — Strip handles recipes without `createdAt`

**Status:** `DONE` <!-- src/lib/firebase/recipes.ts:getLatestRecipes uses orderBy("createdAt","desc"); src/components/Recipe/LatestRecipesStrip.tsx returns null when empty -->

**GIVEN** Firestore contains legacy recipes written before the timestamp fields existed
**WHEN** the strip queries the latest 7 recipes
**THEN** legacy recipes (lacking `createdAt`) are excluded from the query result — effectively treated as the oldest — and the strip displays only timestamped recipes. The accordion list below the strip continues to show every recipe regardless of timestamp.

---

## Notes

### Card anatomy

Each card in the strip is 148 px wide and includes:

- 3 px colored accent bar at the top, tinted per food family
- 52 × 52 emoji avatar with a family-tinted background
- Recipe name (2-line clamp)
- Family label
- Portions pill (`👤 N por.`)
- Optional creation date (controlled by a prop, **default off** until legacy recipes are backfilled)
- "Última" badge — only on the newest card (index 0)

### Family accent colors

Pulled from the existing MUI palette in [`src/styles/theme.ts`](../../src/styles/theme.ts):

| Family | Color |
|---|---|
| starters, fish | `info.main` (#008395) |
| veggies, beans, others | `primary.main` (#7cb342) |
| carbs, bakery | `warning.main` (#b9a440) |
| birds | `secondary.main` (#ff8f00) |
| meat, desserts | `error.main` (#a64529) |

### Invariants

- `createdAt` is set once on creation and never modified.
- `modifiedAt` is touched on every recipe update.
- The strip query uses `orderBy("createdAt", "desc").limit(7)` — Firestore silently excludes documents missing the field.
- The existing "Nueva receta" button at the top of the page stays where it is; the strip header has no action button.

---

## Known gaps

- **Legacy recipe backfill** — deferred. Existing recipes without `createdAt` are invisible to the strip until edited. Revisit if the strip looks sparse in production or when the "Recently modified" feature is built (which will read `modifiedAt`).
- **`modifiedAt` consumer** — the field is written but not yet read by any UI. It exists to unblock a future "Recently modified" feature.

---

## Bugs

<!-- None yet -->
