import {ICategory, IIngredient} from "@/util/models";
import { Chip, IconButton, ListItem, ListItemText} from "@mui/material";
import {Delete} from "@mui/icons-material";
import React from "react";
import {marketAisles, TAisle} from "@/util/constants";

interface ItemIngredientProps {
  ingredient: IIngredient;
  editable?: boolean;
  index?: number;
}

export function ItemIngredient(props: ItemIngredientProps) {
  const {
    id,
    name,
    aisles,
    convertions
  } = props.ingredient;

  const getAisleDetail = ( searchString: TAisle ) : ICategory => {
    const findAisle = marketAisles.find((
      aisle) => aisle.id === searchString);
    if (findAisle) {
      return findAisle
    } else {
      return marketAisles[marketAisles.length - 1]
    }
  }

  return (<ListItem
    secondaryAction={props.editable ?
      <IconButton edge="end" aria-label="delete">
        <Delete/>
      </IconButton> : <></>
    }
  >
    <ListItemText
      primary={name}
      secondary={`${convertions.map(({unit, quantity})=>{
        return `${quantity} ${unit} = `
      })}`}
    >
      {aisles.length > 0 ? aisles.map((aisle,i)=> {
        const item = getAisleDetail(aisle)
        return <Chip size={"small"} label={`${item.icon} ${item.name}`} key={`${id}-aisle-${i}`}/>
      }) : (<Chip size={"small"} label={"Sin pasillo asignado"}/>)}
    </ListItemText>
  </ListItem>)
}