"use client"
import React from "react";
import {IRecipeIngredient} from "@/util/models";
import {Avatar, IconButton, ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {TMeasureUnits} from "@/util/constants";
import {convertionsOnIngredient} from "@/util/convertions";

interface ItemRecipeIngredientProps {
  ingredient: IRecipeIngredient,
  deleteIngredient?: (ingredient: IRecipeIngredient) => void,
}
export function ItemRecipeIngredient(
  { ingredient, deleteIngredient } : ItemRecipeIngredientProps
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
    return convetionsTexts.join(' / ')
  }

  return (<ListItem
    secondaryAction={deleteIngredient ?
      <IconButton edge="end" aria-label="delete" onClick={()=>{deleteIngredient(ingredient)}}>
        <Delete/>
      </IconButton> : <></>
    }
  >
    <ListItemAvatar>
      <Avatar title={ingredient.quantity.toString()}/>
    </ListItemAvatar>
    <ListItemText primary={primaryText()} secondary={secondaryText()} />
  </ListItem>)
}