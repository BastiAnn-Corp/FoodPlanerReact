"use client"
import React from "react";
import {IRecipeIngredient} from "@/util/models";
import {IconButton, ListItem, ListItemText} from "@mui/material";
import {Delete} from "@mui/icons-material";

interface ItemRecipeIngredientProps {
  ingredient: IRecipeIngredient,
  index:number;
  deleteIngredient?: (ingredient: IRecipeIngredient) => void,
}
export function ItemRecipeIngredient(
  { ingredient, deleteIngredient, index } : ItemRecipeIngredientProps
) {

  const primaryText = () => {
    const {ingredient: ing, quantity, quantity_unit: unit} = ingredient
    return `${ing.name} (${quantity} ${unit})`
  }

  return (<ListItem
    divider
    secondaryAction={deleteIngredient ?
      <IconButton edge="end" aria-label="delete" onClick={()=>{deleteIngredient(ingredient)}}>
        <Delete/>
      </IconButton> : <></>
    }
  >
    <ListItemText primary={primaryText()} />
  </ListItem>)
}