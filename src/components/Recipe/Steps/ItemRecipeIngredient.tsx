import {FormControl, FormControlLabel, Grid2, IconButton, ListItem, ListItemProps, ListItemText, TextField, Typography} from "@mui/material";
import {IRecipeIngredient} from "@/util/models";
import React, { ReactNode, useState } from "react";
import {Delete} from "@mui/icons-material";
import { TMeasureUnits } from "@/util/constants";

interface ItemRecipeIngredientProps extends ListItemProps{
  ingredient: IRecipeIngredient;
  editing?: {
    active: boolean,
    update: (step: IRecipeIngredient) => void,
  }
  deleteIngredient?: (step: IRecipeIngredient) => void;
}

export function ItemRecipeIngredient(props: ItemRecipeIngredientProps) {

  const [quantity, setQuantity] = useState(props.ingredient.quantity);
  const [unit, setUnit] = useState<TMeasureUnits>(props.ingredient.quantity_unit as TMeasureUnits);

  function handleSave() {
      const recipeIngredient: IRecipeIngredient = {
         ingredient: {...props.ingredient.ingredient, convertions:[]},
         quantity,
         quantity_unit: unit
       }
       props.editing?.update(recipeIngredient);
      }
    }

  function renderContent () {
    const {
      ingredient: ingredeintDetail,
      quantity_unit,
      quantity
    } = props.ingredient

    return <ListItem
      {...props}
      divider
    >
      <ListItemText>
        {`${ingredeintDetail.name} (${quantity} ${quantity_unit})`}
      </ListItemText>
    </ListItem>
  }

  function renderInput(){
    return <ListItem {...props}
      secondaryAction={deleteIngredient ?
        <IconButton edge="end" aria-label="delete" onClick={()=>{deleteIngredient(ingredient)}}>
          <Delete/>
        </IconButton> : <></>
    }
    >
      <Grid2 container direction={"row"}>
        <Grid2 size={2}>
         <Typography>{ingredient.ingredient.name}</Typography>
        </Grid2>
        <Grid2 size={2}>
          <TextField
                fullWidth
                size={"small"}
                value={quantity}
                type={"number"}
                onChange={(e)=>{setQuantity(Number(e.target.value))}}
                disabled={ingredient === null}
              />
        </Grid2>
        <Grid2 size={2}>
          
        </Grid2>
      </Grid2>
    </ListItem>
  }

  return renderContent()
}