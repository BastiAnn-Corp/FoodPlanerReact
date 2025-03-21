"use client"
import React from "react";
import {IIngredient, IRecipeIngredient} from "@/util/models";
import {Grid2, List} from "@mui/material";
import {ItemRecipeIngredient} from "@/components/Recipe/ItemRecipeIngredient";
import {RecipeIngredientForm} from "@/components/Recipe/RecipeIngredientForm";

interface RecipeIngredientsProps {
  ingredients: IRecipeIngredient[];
  baseIngredients: IIngredient[];
  editable?: boolean;
  saveIngredients?: (listOfIngredients: IRecipeIngredient[]) => void;
}
export function RecipeIngredients(
  { ingredients, baseIngredients = [], editable=false,  saveIngredients } : RecipeIngredientsProps
) {

  function addIngredient(ingredient: IRecipeIngredient) {
    const items = ingredients
    items.push(ingredient)
    if (editable && saveIngredients) {
      saveIngredients(items)
    }
  }

  return (<Grid2 container>
  {editable ? <Grid2 size={12}>
    <RecipeIngredientForm
      addIngredient={addIngredient}
      ingredients={baseIngredients}
    />
  </Grid2> : <br/>}
    <Grid2 size={12}>
    <List>{
      ingredients.map((ingredient,index)=>{
        return (<ItemRecipeIngredient
          key={`recipe-ingredient-${index}`}
          ingredient={ingredient}
        />)
      })
    }</List>
    </Grid2>
  </Grid2>)
}