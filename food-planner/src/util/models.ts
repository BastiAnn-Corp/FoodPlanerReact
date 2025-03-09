type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>



export interface IFoodFamily {
  name: string;
  id: string;
  subcategories?: IFoodFamily[]
}

interface IShoppingAisle{
  id: string;
  aisle: string;
}

interface IConvertionIngredients {
  unit: string;
  quantity: number;
}

export interface IIngredient{
  id: string;
  name: string;
  aisle: string;
  grams_per_unit?: number;
  ml_per_unit?: number;
  convertions: IConvertionIngredients[]
}

export interface IRecipeStep{
  instructions: string;
  sc_time_in_seconds?: number;
  sc_temp_in_celcius?: IntRange<0, 120>;
  sc_speed?: 1|2|3|4|5|6|7|8|9;
  pot_program: string;
  pot_time_mìnutes: number;
  pot_temp: 1 | 2 | 3;
}

export interface IRecipeIngredient {
  ingredient: IIngredient;
  quantity_unit: string;
  quantity: number;
}

export interface IRecipe{
  id:string;
  name: string;
  portions: number;
  seasons: string[];
  family: string;
  ingredients_list: Array<IRecipeIngredient>;
  steps: Array<IRecipeStep>;
}

export interface IDayMenu {
  starter: IRecipe;
  protein: IRecipe;
  veggies: IRecipe;
  carbs: IRecipe;
  dessert: IRecipe | IIngredient
}

export interface IMenu {
  id: string;
  number: number;
  persons: number;
  seasons: string[];
  creator: string;
  description: string;
  days: {
    monday: IDayMenu;
    tuesday: IDayMenu;
    wednesday: IDayMenu;
    thursday: IDayMenu;
    friday: IDayMenu;
    saturday: IDayMenu;
    sunday: IDayMenu;
  }
}