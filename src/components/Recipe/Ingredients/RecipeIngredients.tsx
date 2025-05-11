"use client"
import React, {useEffect} from "react";
import {IIngredient, IRecipeIngredient} from "@/util/models";
import {Grid2, List} from "@mui/material";
import {ItemRecipeIngredient} from "@/components/Recipe/Ingredients/ItemRecipeIngredient";
import {RecipeIngredientForm} from "@/components/Recipe/Ingredients/RecipeIngredientForm";

interface RecipeIngredientsProps {
  ingredients: IRecipeIngredient[];
  baseIngredients: IIngredient[];
  editable?: boolean;
  saveIngredient?: (listOfIngredient: IRecipeIngredient) => void;
}
export function RecipeIngredients(
  { ingredients, baseIngredients = [], editable=false,  saveIngredient } : RecipeIngredientsProps
) {
  useEffect(()=>{},[ingredients, baseIngredients]);

  function addIngredient(ingredient: IRecipeIngredient) {
    if (editable && saveIngredient) {
      saveIngredient(ingredient)
    }
  }

  return (<Grid2 container>
  {editable ? <Grid2 size={12}>
    <RecipeIngredientForm
      addIngredient={addIngredient}
      ingredients={baseIngredients}
    />
  </Grid2> : <br/>}
  </Grid2>)
}