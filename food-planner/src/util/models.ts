import {DocumentData} from "@firebase/firestore";
import {TAisle, TFoodFamily, TPotProgram, TSeasons} from "@/util/constants";

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
}

export interface IMenu extends DocumentData {
  id?: string;
  number: number;
  persons: number;
  seasons: TSeasons[];
  creator: string;
  description: string;
  days: {
    monday: Array<IRecipe | IIngredient>;
    tuesday:Array<IRecipe | IIngredient>;
    wednesday: Array<IRecipe | IIngredient>;
    thursday: Array<IRecipe | IIngredient>;
    friday: Array<IRecipe | IIngredient>;
    saturday: Array<IRecipe | IIngredient>;
    sunday: Array<IRecipe | IIngredient>;
  }
}

export interface IShoppingCart extends DocumentData{
  id?: string;
  menu: IMenu;
  persons: number;
  ingredients: IRecipeIngredient[];
}