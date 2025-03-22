"use client"
import React from "react";
import {IRecipeIngredient} from "@/util/models";
import {IconButton, ListItem, ListItemText} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {TMeasureUnits} from "@/util/constants";
import {convertionsOnIngredient} from "@/util/convertions";

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

  const secondaryText = () => {
    const {ingredient: ing,quantity, quantity_unit: unit} = ingredient
    const convetionsTexts = convertionsOnIngredient({
      measurementUnitInput: unit as TMeasureUnits,
      quantityInput: quantity,
      ingredientConvertions: ing.convertions
    })
    return convetionsTexts.map(({quantity, unit})=>{
      return `${quantity.toFixed(2)} ${unit}`
    }).flat().join(' / ')
  }

  return (<ListItem
    divider
    secondaryAction={deleteIngredient ?
      <IconButton edge="end" aria-label="delete" onClick={()=>{deleteIngredient(ingredient)}}>
        <Delete/>
      </IconButton> : <></>
    }
  >
    <ListItemText primary={primaryText()} secondary={secondaryText()} />
  </ListItem>)
}