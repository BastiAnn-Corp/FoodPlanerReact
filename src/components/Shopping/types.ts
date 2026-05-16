export interface ShoppingRecipe {
  id: string;
  name: string;
  emoji: string;
  portions: number;
  basePortions: number;
}

export interface RecipeIngredientDetail {
  name: string;
  qty: string;
  aisle: string;
}

export interface ShoppingIngredient {
  id: string;
  name: string;
  qty: string;
  checked: boolean;
}

export interface ShoppingAisle {
  id: string;
  icon: string;
  name: string;
  items: ShoppingIngredient[];
}

export interface SavedList {
  id: string;
  name: string;
  shortName: string;
  itemCount: number;
}

export type SortMode = 'aisle' | 'alpha';
