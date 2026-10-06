---
id: ADR-09
status: Accepted
date: 2026-10-06
---

## ADR-09 — Guest view surfaces recipe composition as inert chips

### Context
The guest/readonly view (`pageMode === "readonly"`, opened via a `?token=` share link) previously rendered only `ReadonlyHeader` followed by the aisle-grouped ingredient list — it never showed which recipes the consolidated ingredients came from. A guest shopping on someone else's behalf had no way to see "this is for Pasta al Pesto and Ensalada César," only an undifferentiated grocery list. This gap wasn't a missing data fetch: per ADR-05, the full recipe snapshot (`IShoppingListRecipe[]`) already travels inside the `shared_list_views/{token}` document and is already hydrated client-side into `listRecipes` / `selRecipes` to build the aisle list — it just was never rendered for this mode. Closing the gap is therefore a pure UI change, not a new read path or a security-rules change.

### Decision
A new read-only pair, `ReadonlyRecipes` (`src/components/Shopping/organisms/ReadonlyRecipes.tsx`) and `ReadonlyRecipeChip` (`src/components/Shopping/molecules/ReadonlyRecipeChip.tsx`), renders a "Recetas en esta lista · N" section directly below `ReadonlyHeader` in `leftPanel` (`src/app/shopping/page.tsx`), reusing the already-computed `selRecipes` and `getIngredientDetails`. These are deliberately separate components from `RecipeChip`/`RecipeSelector` rather than that pair plus a `readonly` prop: the owner components take `onRemove`/`onPortionChange` callbacks that have no meaning for a guest, and per the `pageMode` discriminant philosophy (ADR-06), a component a guest renders should never be wired to mutation handlers at all — not merely have them disabled. Tapping a recipe name still opens the shared `RecipeIngModal` (view-only in both modes already), so guests get the same ingredient-breakdown detail an owner has.

### Consequences
- No new Firestore reads, no security-rule changes — the data was already present client-side; this only changes what's rendered.
- `leftPanel`'s single definition serves both the desktop sticky-card layout and the mobile stacked layout, so the recipe section appears in both without separate responsive logic.
- Visually distinguishable from the owner's editable chips (no stepper, no remove button, no hover affordance) so guests aren't misled into thinking they can edit.
- ⚠️ If recipe composition should ever become hideable per-share (e.g. an owner wants to share ingredients without revealing recipe names), this ADR's "always show if present" behavior would need revisiting — there is currently no such toggle.

### Related
- UC-15 (Guest view shows recipe composition)
- UC-13 (Share list) — defines the readonly role this extends
- ADR-05 (Denormalized ingredient snapshot) — why the recipe data is already available client-side
- ADR-06 (`pageMode` discriminant) — why this is a separate component rather than a shared one with a flag
