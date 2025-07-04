import {
  Button,
  Grid2,
  IconButton,
  ListItem,
  ListItemProps,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import {IRecipeIngredient} from "@/util/models";
import React, {useEffect, useState} from "react";
import {Delete, SaveAltRounded} from "@mui/icons-material";
import {measuerementUnits, TMeasureUnits} from "@/util/constants";

interface ItemRecipeIngredientProps extends ListItemProps {
  ingredient: IRecipeIngredient;
  editing?: {
    active: boolean,
    update: (ingredient: IRecipeIngredient) => void,
  }
  deleteIngredient?: (ingredient: IRecipeIngredient) => void;
}

export function ItemRecipeIngredient(props: ItemRecipeIngredientProps) {

  const [quantity, setQuantity] = useState(props.ingredient.quantity);
  const [unit, setUnit] = useState<TMeasureUnits>(props.ingredient.quantity_unit as TMeasureUnits);

  useEffect(() => {
    setQuantity(props.ingredient.quantity);
    setUnit(props.ingredient.quantity_unit as TMeasureUnits);
  }, [props.editing?.active]);

  function handleSave() {
    const recipeIngredient: IRecipeIngredient = {
      ingredient: {...props.ingredient.ingredient, convertions: []},
      quantity,
      quantity_unit: unit
    }
    props.editing?.update(recipeIngredient);
  }

  function renderContent() {
    const {
      ingredient: ingredeintDetail,
      quantity_unit,
      quantity
    } = props.ingredient
    
    function unitText(unit:string, q: number): string{
      switch (unit) {
        case "-":
          return ""
        case "unidad":
          return `${q}`
        default:
          return `${q} ${unit}`
      }
    }
    return <ListItem
      {...props}
      divider
    >
      <ListItemText>
        <Grid2 container direction={"row"}>
          <Grid2 size={2}>
            {unitText(quantity_unit, quantity)}
          </Grid2>
          <Grid2 size={8}>{ingredeintDetail.name}</Grid2>
        </Grid2>
      </ListItemText>
    </ListItem>
  }

  function renderInput() {
    return <ListItem
      {...props}
       secondaryAction={props.deleteIngredient ?
         <IconButton edge={"start"} aria-label="delete" onClick={() => {
           props.deleteIngredient!(props.ingredient)
         }}>
           <Delete/>
         </IconButton> : <></>
       }
    >
      <Grid2 container direction={"row"} spacing={1} alignItems={"center"} justifyContent={"space-evenly"}>
        <Grid2 size={3}>
          <TextField
            fullWidth
            size={"small"}
            value={quantity}
            type={"number"}
            onChange={(e) => {
              setQuantity(Number(e.target.value));
              handleSave()
            }}
          />
        </Grid2>
        <Grid2 size={4}>
          <Select
            fullWidth
            size={"small"}
            value={unit}
            onChange={(e)=>{
              setUnit(e.target.value as TMeasureUnits)
              handleSave()
            }}
          >
            {measuerementUnits.map((item, index)=>{
              return <MenuItem
                key={`recipe-ingredient-unit-${item.id}-${index}`}
                value={item.id}
              >{item.name}</MenuItem>
            })}
          </Select>
        </Grid2>
        <Grid2 size={4}>
          <Typography>{props.ingredient.ingredient.name}</Typography>
        </Grid2>
      </Grid2>
    </ListItem>
  }

  return props.editing?.active ? renderInput() : renderContent()
}