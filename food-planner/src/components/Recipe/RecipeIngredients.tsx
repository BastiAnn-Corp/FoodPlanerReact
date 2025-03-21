"use client"
import React, {useEffect} from "react";
import {IIngredient, IRecipeIngredient} from "@/util/models";
import {Grid2, List} from "@mui/material";
import {ItemRecipeIngredient} from "@/components/Recipe/ItemRecipeIngredient";
import {RecipeIngredientForm} from "@/components/Recipe/RecipeIngredientForm";

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
    <Grid2 size={12}>
    <List>{
      ingredients.map((ingredient,index)=>{
        return (<ItemRecipeIngredient
          key={`recipe-ingredient-${index}`}
          index={index}
          ingredient={ingredient}
          deleteIngredient={addIngredient}
        />)
      })
    }</List>
    </Grid2>
  </Grid2>)
}