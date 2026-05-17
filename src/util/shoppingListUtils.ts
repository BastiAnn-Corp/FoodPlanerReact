/**
 * shoppingListUtils.ts
 *
 * Pure utility functions for the shopping list feature.
 * No Firebase imports — fully unit-testable in isolation.
 *
 * Implements the consolidation rules from UC-6, UC-7, UC-8:
 *   - grs + kg  → normalize to grams, display in kg if ≥ 1000 g
 *   - ml  + lt  → normalize to ml,    display in lt if ≥ 1000 ml
 *   - same non-metric unit (cdta/cda/tz) → sum as plain numbers
 *   - different non-metric units          → display separately on one line
 *   - unidad                              → sum as integers
 *   - incompatible groups                → "300 g + 2 unidades"
 */

import { IRecipe, IShoppingListIngredient, IShoppingListRecipe, IShoppingList } from "@/util/models";
import { foodFamilies, marketAisles, TMeasureUnits } from "@/util/constants";
import { ShoppingAisle, ShoppingIngredient, ShoppingRecipe, RecipeIngredientDetail, SavedList, SortMode } from "@/components/Shopping/types";

// ---------------------------------------------------------------------------
// Unit conversion helpers
// ---------------------------------------------------------------------------

/** Convert a mass quantity to grams. Returns null for non-mass units. */
export function toGrams(qty: number, unit: TMeasureUnits): number | null {
  if (unit === "grs") return qty;
  if (unit === "kg") return qty * 1000;
  return null;
}

/** Convert a volume quantity to millilitres. Returns null for non-volume units. */
export function toMl(qty: number, unit: TMeasureUnits): number | null {
  if (unit === "ml") return qty;
  if (unit === "lt") return qty * 1000;
  return null;
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

/** Format a total-gram value for display: < 1000 → "NNN g", ≥ 1000 → "N.Nkg" */
export function formatMass(totalGrams: number): string {
  if (totalGrams < 1000) {
    return `${Math.round(totalGrams)} g`;
  }
  const kg = totalGrams / 1000;
  // Trim trailing .0 for clean display
  const formatted = kg % 1 === 0 ? `${kg}` : kg.toFixed(1);
  return `${formatted} kg`;
}

/** Format a total-ml value for display: < 1000 → "NNN ml", ≥ 1000 → "N.Nlt" */
export function formatVolume(totalMl: number): string {
  if (totalMl < 1000) {
    return `${Math.round(totalMl)} ml`;
  }
  const lt = totalMl / 1000;
  const formatted = lt % 1 === 0 ? `${lt}` : lt.toFixed(1);
  return `${formatted} lt`;
}

/** Single source of truth for quantity + unit display strings. */
export function formatQty(qty: number, unit: TMeasureUnits): string {
  const rounded = qty % 1 === 0 ? qty : parseFloat(qty.toFixed(2));
  switch (unit) {
    case "grs":   return `${rounded} g`;
    case "kg":    return `${rounded} kg`;
    case "ml":    return `${rounded} ml`;
    case "lt":    return `${rounded} lt`;
    case "cdta":  return `${rounded} cdta${rounded !== 1 ? "s" : ""}`;
    case "cda":   return `${rounded} cda${rounded !== 1 ? "s" : ""}`;
    case "tz":    return `${rounded} tz`;
    case "unidad":return `${rounded} unidad${rounded !== 1 ? "es" : ""}`;
    case "-":     return "-";
    default:      return `${rounded} ${unit}`;
  }
}

// ---------------------------------------------------------------------------
// Scaling
// ---------------------------------------------------------------------------

/** Scale an ingredient quantity by the portions ratio. */
export function scaleIngredient(
  ingredient: IShoppingListIngredient,
  targetPortions: number,
  basePortions: number
): { qty: number; unit: TMeasureUnits } {
  const multiplier = basePortions > 0 ? targetPortions / basePortions : 1;
  return {
    qty: ingredient.quantity * multiplier,
    unit: ingredient.quantity_unit,
  };
}

// ---------------------------------------------------------------------------
// Consolidation map
// ---------------------------------------------------------------------------

interface Contribution {
  qty: number;
  unit: TMeasureUnits;
}

interface ConsolidationEntry {
  ingredientId: string;
  name: string;
  aisles: string[];
  contributions: Contribution[];
}

/**
 * Build a map of ingredientId → ConsolidationEntry by iterating over every
 * recipe in the list and scaling each ingredient by the portions ratio.
 * Works entirely from the stored IShoppingListRecipe snapshot — no
 * additional Firestore reads needed.
 */
export function buildConsolidationMap(
  listRecipes: IShoppingListRecipe[]
): Map<string, ConsolidationEntry> {
  const map = new Map<string, ConsolidationEntry>();

  for (const recipe of listRecipes) {
    for (const ingredient of recipe.ingredients) {
      const scaled = scaleIngredient(ingredient, recipe.portions, recipe.basePortions);
      const key = ingredient.ingredientId || ingredient.name.toLowerCase().trim();

      const existing = map.get(key);
      if (existing) {
        existing.contributions.push(scaled);
      } else {
        map.set(key, {
          ingredientId: key,
          name: ingredient.name,
          aisles: ingredient.aisles,
          contributions: [scaled],
        });
      }
    }
  }

  return map;
}

// ---------------------------------------------------------------------------
// Quantity resolution — UC-6, UC-7, UC-8
// ---------------------------------------------------------------------------

const MASS_UNITS: TMeasureUnits[] = ["grs", "kg"];
const VOLUME_UNITS: TMeasureUnits[] = ["ml", "lt"];
const CULINARY_UNITS: TMeasureUnits[] = ["cdta", "cda", "tz"];

function unitGroup(unit: TMeasureUnits): "mass" | "volume" | "culinary" | "count" | "taste" {
  if (MASS_UNITS.includes(unit)) return "mass";
  if (VOLUME_UNITS.includes(unit)) return "volume";
  if (CULINARY_UNITS.includes(unit)) return "culinary";
  if (unit === "unidad") return "count";
  return "taste";
}

/**
 * Resolve a list of contributions into a single display string.
 *
 * Rules (applied in priority order):
 *  1. All same unit                          → sum → formatQty
 *  2. All mass units (grs/kg)               → sum as grams → formatMass
 *  3. All volume units (ml/lt)              → sum as ml → formatVolume
 *  4. All same culinary unit (cdta/cda/tz)  → sum → formatQty
 *  5. Mixed groups                           → per-group strings joined with " + "
 *     Priority order: mass > volume > culinary > count > taste
 */
export function resolveQty(contributions: Contribution[]): string {
  if (contributions.length === 0) return "-";

  const allSameUnit = contributions.every(c => c.unit === contributions[0].unit);

  if (allSameUnit) {
    const total = contributions.reduce((s, c) => s + c.qty, 0);
    return formatQty(total, contributions[0].unit);
  }

  const groups = new Map<string, Contribution[]>();
  for (const c of contributions) {
    const g = unitGroup(c.unit);
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(c);
  }

  const parts: string[] = [];
  const ORDER = ["mass", "volume", "culinary", "count", "taste"] as const;

  for (const g of ORDER) {
    const cs = groups.get(g);
    if (!cs) continue;

    if (g === "mass") {
      const totalGrams = cs.reduce((s, c) => s + (toGrams(c.qty, c.unit) ?? 0), 0);
      parts.push(formatMass(totalGrams));
    } else if (g === "volume") {
      const totalMl = cs.reduce((s, c) => s + (toMl(c.qty, c.unit) ?? 0), 0);
      parts.push(formatVolume(totalMl));
    } else if (g === "culinary") {
      // Try to sum within each culinary sub-unit
      const byUnit = new Map<TMeasureUnits, number>();
      for (const c of cs) {
        byUnit.set(c.unit, (byUnit.get(c.unit) ?? 0) + c.qty);
      }
      for (const [unit, total] of byUnit) {
        parts.push(formatQty(total, unit));
      }
    } else if (g === "count") {
      const total = cs.reduce((s, c) => s + c.qty, 0);
      parts.push(formatQty(total, "unidad"));
    } else {
      // taste ("-") — just show once
      parts.push("-");
    }
  }

  return parts.join(" + ");
}

// ---------------------------------------------------------------------------
// Aisle building — final output for the UI
// ---------------------------------------------------------------------------

/**
 * Build the ShoppingAisle[] used by the page to render the ingredient list.
 * Replaces makeStubAisles().
 *
 * sortMode 'aisle': grouped by supermarket aisle in marketAisles order.
 * sortMode 'alpha': single virtual aisle with all items sorted A-Z (es locale).
 */
export function buildAisles(
  listRecipes: IShoppingListRecipe[],
  checkedIds: Set<string>,
  sortMode: SortMode = "aisle"
): ShoppingAisle[] {
  const consolidationMap = buildConsolidationMap(listRecipes);

  // Convert each entry to a ShoppingIngredient
  const items: (ShoppingIngredient & { aisleId: string })[] = [];
  for (const entry of consolidationMap.values()) {
    const qty = resolveQty(entry.contributions);
    // Use first aisle, fallback to 'none'
    const aisleId = (entry.aisles?.[0] as string) ?? "none";
    items.push({
      id: entry.ingredientId,
      name: entry.name,
      qty,
      checked: checkedIds.has(entry.ingredientId),
      aisleId,
    });
  }

  if (sortMode === "alpha") {
    const sorted = [...items].sort((a, b) =>
      a.name.localeCompare(b.name, "es", { sensitivity: "base" })
    );
    return [
      {
        id: "alpha",
        icon: "🔤",
        name: "Todos los ingredientes",
        items: sorted.map(({ aisleId: _a, ...rest }) => rest),
      },
    ];
  }

  // Group by aisle, ordered by marketAisles index
  const aisleMap = new Map<string, ShoppingIngredient[]>();

  for (const item of items) {
    const { aisleId, ...ingredient } = item;
    const key = aisleId in VALID_AISLE_IDS ? aisleId : "none";
    if (!aisleMap.has(key)) aisleMap.set(key, []);
    aisleMap.get(key)!.push(ingredient);
  }

  const result: ShoppingAisle[] = [];
  for (const aisleDef of marketAisles) {
    const aisleItems = aisleMap.get(aisleDef.id);
    if (!aisleItems || aisleItems.length === 0) continue;

    // Sort items within each aisle alphabetically
    aisleItems.sort((a, b) =>
      a.name.localeCompare(b.name, "es", { sensitivity: "base" })
    );

    result.push({
      id: aisleDef.id,
      icon: aisleDef.icon ?? "🛒",
      name: aisleDef.name,
      items: aisleItems,
    });
  }

  return result;
}

// Set of valid aisle IDs for fast lookup (avoids falling through to "none" for valid ids)
const VALID_AISLE_IDS: Record<string, true> = Object.fromEntries(
  marketAisles.map(a => [a.id, true as const])
);

// ---------------------------------------------------------------------------
// RecipeIngModal detail helper
// ---------------------------------------------------------------------------

/**
 * Derive RecipeIngredientDetail[] for the RecipeIngModal from a stored
 * IShoppingListRecipe. Replaces STUB_RECIPE_DETAILS.
 */
export function getRecipeIngredientDetails(
  recipe: IShoppingListRecipe
): RecipeIngredientDetail[] {
  return recipe.ingredients.map(ing => {
    const scaled = scaleIngredient(ing, recipe.portions, recipe.basePortions);
    return {
      name: ing.name,
      qty: formatQty(scaled.qty, scaled.unit),
      aisle: ing.aisles?.[0] ?? "none",
    };
  });
}

// ---------------------------------------------------------------------------
// Google Keep export
// ---------------------------------------------------------------------------

/** Format aisles as Google Keep checkbox text (UC-14). */
export function buildKeepText(aisles: ShoppingAisle[]): string {
  return aisles
    .flatMap(a => a.items)
    .map(item => `[ ] ${item.qty} ${item.name}`)
    .join("\n");
}

// ---------------------------------------------------------------------------
// Persistence helpers
// ---------------------------------------------------------------------------

/**
 * Convert an IRecipe (from the autocomplete selection) into an
 * IShoppingListRecipe with a full ingredient snapshot.
 * Called when the user adds a recipe from the selector.
 */
export function recipeToShoppingListRecipe(
  recipe: IRecipe,
  portions: number
): IShoppingListRecipe {
  return {
    recipeId: recipe.id ?? "",
    name: recipe.name,
    family: recipe.family,
    basePortions: recipe.portions,
    portions,
    ingredients: (recipe.ingredients_list ?? []).map(ri => ({
      ingredientId: ri.ingredient.id ?? ri.ingredient.name.toLowerCase().trim(),
      name: ri.ingredient.name,
      aisles: ri.ingredient.aisles ?? [],
      quantity: ri.quantity,
      quantity_unit: ri.quantity_unit as TMeasureUnits,
    })),
  };
}

/**
 * Build the Firestore payload from current page state.
 * Does NOT include id, createdAt, updatedAt (those are set by the Firebase layer).
 */
export function buildListPayload(
  name: string,
  ownerUid: string,
  listRecipes: IShoppingListRecipe[],
  checkedIds: Set<string>,
  shareToken?: string
): Omit<IShoppingList, "id" | "createdAt" | "updatedAt"> {
  const payload: Omit<IShoppingList, "id" | "createdAt" | "updatedAt"> = {
    name,
    ownerUid,
    recipes: listRecipes,
    checkedIngredientIds: [...checkedIds],
  };
  if (shareToken) payload.shareToken = shareToken;
  return payload;
}

/**
 * Hydrate page state from a saved IShoppingList or ISharedListView.
 * Returns the ShoppingRecipe[] (for UI) and checkedIngredientIds Set.
 * Does not require a recipe cache — all data is in the stored snapshot.
 */
export function hydrateSavedList(list: {
  recipes: IShoppingListRecipe[];
  checkedIngredientIds?: string[];
}): {
  listRecipes: IShoppingListRecipe[];
  selRecipes: ShoppingRecipe[];
  checkedIngredientIds: Set<string>;
} {
  const selRecipes: ShoppingRecipe[] = list.recipes.map(r => ({
    id: r.recipeId,
    name: r.name,
    emoji: foodFamilies.find(f => f.id === r.family)?.icon ?? "🍽️",
    portions: r.portions,
    basePortions: r.basePortions,
  }));

  return {
    listRecipes: list.recipes,
    selRecipes,
    checkedIngredientIds: new Set(list.checkedIngredientIds ?? []),
  };
}

/**
 * Convert an IShoppingList[] to the SavedList[] shape used by the
 * list switcher modal.
 */
export function toSavedLists(lists: IShoppingList[]): SavedList[] {
  return lists.map(l => ({
    id: l.id ?? "",
    name: l.name,
    shortName: l.name.length > 15 ? l.name.slice(0, 14) + "…" : l.name,
    itemCount: l.recipes.length,
  }));
}
