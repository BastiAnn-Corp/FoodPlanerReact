import {IconButton, ListItem, ListItemProps, ListItemText} from "@mui/material";
import {IRecipeIngredient} from "@/util/models";import React from "react";
import {Delete} from "@mui/icons-material";

interface ItemRecipeIngredientProps extends ListItemProps{
  ingredient: IRecipeIngredient;
  editing?: {
    active: boolean,
    updateStep: (step: IRecipeIngredient) => void,
  }
  deleteIngredient?: (step: IRecipeIngredient) => void;
}

export function ItemRecipeIngredient(props: ItemRecipeIngredientProps) {
  const {
    ingredient,
    deleteIngredient,
  } = props

  function renderContent () {
    const {
      ingredient: ingredeintDetail,
      quantity_unit,
      quantity
    } = ingredient
    return <ListItem
      {...props}
      divider
      secondaryAction={deleteIngredient ?
        <IconButton edge="end" aria-label="delete" onClick={()=>{deleteIngredient(ingredient)}}>
          <Delete/>
        </IconButton> : <></>
    }>
      <ListItemText>
        {`${ingredeintDetail.name} (${quantity} ${quantity_unit})`}
      </ListItemText>
    </ListItem>
  }

  return renderContent()
}