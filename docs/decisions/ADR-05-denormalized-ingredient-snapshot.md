---
id: ADR-05
status: Accepted
date: 2026-05-17
---

## ADR-05 — Denormalized ingredient snapshot in shopping list recipes

### Context
A shopping list references recipes, and each recipe has an ingredient list that can change over time as the recipe is edited. Two storage shapes were possible: (a) store only `recipeId` references and re-fetch the full recipe on every page load to consolidate ingredients, or (b) snapshot the full ingredient list into the shopping list document at the moment the recipe is added. Option (a) means N extra Firestore reads per page load and produces surprising behaviour if the source recipe changes mid-shop (quantities silently mutate). Option (b) trades storage size and write effort for read simplicity and a stable "what I was shopping for at this moment" record.

### Decision
`IShoppingListRecipe` in `src/util/models.ts` carries a full `ingredients: IShoppingListIngredient[]` snapshot (id, name, aisles, quantity, unit) captured at add time by `recipeToShoppingListRecipe`. `buildConsolidationMap` and `buildAisles` operate exclusively on this snapshot — no recipe-catalog fetch is needed to render or consolidate.

### Consequences
- A single document read fetches everything needed to render and consolidate the list; the recipe catalog fetch is only used for autocomplete.
- Shared views work without the recipient having any access to the `recipe/` collection — the snapshot travels with the share document.
- Page renders are deterministic over the life of the list; an edit to the source recipe does not silently change what the user is shopping for.
- ⚠️ Shopping list documents grow proportionally to (recipes × ingredients). A 20-recipe list with 10 ingredients each is ~200 embedded objects per document. Still well under Firestore's 1 MiB document limit, but worth watching.
- ⚠️ No mechanism exists to "refresh recipe X to its latest version" inside an existing list. If a recipe was added with stale data, the user must remove and re-add it.

### Related
- UC-3 (Add recipes to the list) — captures the snapshot
- UC-4 (Adjust portions) — scales from `basePortions` stored in the snapshot
- UC-6, UC-7, UC-8 (Consolidation rules) — operate on the snapshot, not live recipe data
- UC-13 (Share list) — snapshot is what gets shared
