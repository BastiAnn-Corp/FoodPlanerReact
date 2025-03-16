"use client"
import React, {useState} from "react";
import {IRecipeIngredient} from "@/util/models";
import {Avatar, IconButton, ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import {Delete} from "@mui/icons-material";

interface ItemRecipeIngredientProps {
  ingredient: IRecipeIngredient,
  editable?: boolean,
  saveIngredient?: (ingredient: IRecipeIngredient) => void,
}
export function ItemRecipeIngredient(
  { ingredient, editable = false, saveIngredient = ()=>{} } : ItemRecipeIngredientProps
) {
  const [quantity, setQuantity] = useState<number>(ingredient.quantity || 0);
  const [quantityUnit, setQuantityUnit] = useState<string>(ingredient.quantity_unit || "Unidad");

  const [name, setName] = useState<string>(ingredient.ingredient.name || "")

  return (<ListItem
    secondaryAction={editable ?
      <IconButton edge="end" aria-label="delete">
        <Delete/>
      </IconButton> : <></>
    }
  >
    <ListItemAvatar>
      <Avatar title={quantity.toString()}/>
    </ListItemAvatar>
    <ListItemText primary={name} secondary={`${quantity} ${quantityUnit}`} />
  </ListItem>)
}