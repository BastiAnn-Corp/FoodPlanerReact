import {DocumentData, Timestamp} from "@firebase/firestore";
import {TAisle, TDaysMenu, TFoodFamily, TMeasureUnits, TPotProgram, TRecipeSection, TSeasons} from "@/util/constants";

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>


export interface ICategory {
  name: string;
  id: string;
  icon?: string;
  subcategories?: ICategory[]
}

export interface IConvertionIngredients {
  unit: string;
  quantity: number;
}

export interface IIngredient extends DocumentData{
  id?: string;
  name: string;
  aisles: TAisle[];
  grams_per_unit?: number;
  ml_per_unit?: number;
  convertions: IConvertionIngredients[]
}

export interface IRecipeStep{
  instructions: string;
  sc_time?: string; // mm:ss
  sc_temp_in_celcius?: IntRange<0, 120>;
  sc_speed?: IntRange<0, 10>;
  pot_program?: TPotProgram;
  pot_time?: string; // HH:mm:ss
  pot_temp?: 1 | 2 | 3;
}

export interface IRecipeIngredient {
  ingredient: IIngredient;
  quantity_unit: string;
  quantity: number;
}

export interface IRecipe extends DocumentData{
  id?:string;
  name: string;
  portions: number;
  seasons: TSeasons[];
  family: TFoodFamily;
  ingredients_list: Array<IRecipeIngredient>;
  steps: Array<IRecipeStep>;
  notes?: string;
  creator?: string;
  editors?: string[];
}

export interface IMenuRecipe {
  name: string;
  id: string;
  family: TFoodFamily;
  portions: number;
  days: TDaysMenu[];
  section?: TRecipeSection;
}
export interface IMenu extends DocumentData {
  id?: string;
  persons: number;
  seasons: TSeasons[];
  creator: string;
  editors: string[];
  notes: string;
  public: boolean;
  recipes: IMenuRecipe[]
}

export interface IShoppingCart extends DocumentData{
  id?: string;
  menu: IMenu;
  persons: number;
  ingredients: IRecipeIngredient[];
}

// --- Shopping List models ---

/** Ingredient snapshot stored inside IShoppingListRecipe.
 *  Captured at the moment a recipe is added to the list so consolidation
 *  can run without re-fetching the recipe catalog on subsequent page loads. */
export interface IShoppingListIngredient {
  ingredientId: string;
  name: string;
  aisles: TAisle[];
  quantity: number;
  quantity_unit: TMeasureUnits;
}

/** Recipe entry inside a shopping list.
 *  Includes a full ingredient snapshot (denormalized). */
export interface IShoppingListRecipe {
  recipeId: string;
  name: string;
  family: TFoodFamily;               // used to derive emoji via foodFamilies constant
  basePortions: number;              // original recipe portions (for scaling)
  portions: number;                  // user-adjusted portion count
  ingredients: IShoppingListIngredient[];
}

export interface IShoppingList extends DocumentData {
  id?: string;
  ownerUid: string;
  name: string;
  recipes: IShoppingListRecipe[];
  checkedIngredientIds: string[];    // flat array — supports arrayUnion / arrayRemove
  shareToken?: string;               // present once the list has been shared
  updatedAt: Timestamp;
  createdAt: Timestamp;
}

export interface ISharedListView extends DocumentData {
  // Document ID IS the shareToken (crypto.randomUUID()).
  // allow read: if true is safe because the token is unguessable.
  ownerUid: string;
  ownerDisplayName: string;          // snapshot of display name at share time
  listId: string;                    // back-reference to shopping_lists document
  name: string;                      // snapshot of list name at share time
  recipes: IShoppingListRecipe[];    // full denormalized ingredient snapshot
  updatedAt: Timestamp;
}