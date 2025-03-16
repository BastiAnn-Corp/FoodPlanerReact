"use client"
import React from "react";
import {IRecipeIngredient} from "@/util/models";
import {List} from "@mui/material";
import {ItemRecipeIngredient} from "@/components/ItemRecipeIngredient";

interface RecipeIngredientsProps {
  ingredients: IRecipeIngredient[];
  editable?: boolean;
  saveIngredients?: (listOfIngredients: IRecipeIngredient[]) => void;
}
export function RecipeIngredients(
  { ingredients, editable = false, saveIngredients = ()=>{} } : RecipeIngredientsProps
) {
  function addIngredient(ingredient: IRecipeIngredient) {
    const items = ingredients
    items.push(ingredient)
    saveIngredients(items)
  }
  return (<List>{
    ingredients.map((ingredient,index)=>{
      return (<ItemRecipeIngredient
        key={`recipe-ingredient-${index}`}
        ingredient={ingredient}
        editable={editable}
        saveIngredient={addIngredient}
      />)
    })
  }</List>)
}