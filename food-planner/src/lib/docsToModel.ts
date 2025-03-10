import {DocumentData} from "@firebase/firestore";
import {IIngredient, IRecipe, IRecipeIngredient, IRecipeStep} from "@/util/models";

export function docToRecipe(doc: DocumentData): IRecipe{
  const ingredients = doc["ingredients_list"] || []
  const steps = doc["steps"] || []
  const data : IRecipe = {
    id: doc.id || 'id',
    name: doc.name || '',
    portions: doc.portions || 1,
    seasons: doc.seasons || doc.estacion || [],
    family: doc.family || '' ,
    ingredients_list: ingredients.map((i) => {
      return recipeIngredientsToObj(i);
    }),
    steps: steps.map((i) => {
      return recipeStepsToObj(i)
    }) || []
  }
  return data
}

function recipeIngredientsToObj(doc): IRecipeIngredient {
  const data: IRecipeIngredient = {
    ingredient: doc["ingredient"] as IIngredient || null,
    quantity_unit: doc["quantity_unit"] || 1,
    quantity: doc["quantity"] || 0,
  }
  return data;
}

function recipeStepsToObj(doc: any): IRecipeStep {
  const data: IRecipeStep = {
    instructions: doc["instructions"] || '',
    sc_time_in_seconds: doc["sc_time_in_seconds"] || undefined,
    sc_temp_in_celcius: doc["sc_temp_in_celcius"] || undefined,
    sc_speed: doc["sc_speed"] || undefined,
    pot_program: doc["pot_program"] || undefined,
    pot_time_minutes: doc["pot_time_minutes"] || undefined,
    pot_temp: doc["pot_temp"] || undefined,
  }
  return data;
}