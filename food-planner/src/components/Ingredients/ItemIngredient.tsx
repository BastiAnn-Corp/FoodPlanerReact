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
      primary={name + ` (1 unidad ${convertions.map(({unit, quantity})=>{
        return `/ ${quantity} ${unit} `
      })})`}
      secondary={aisles ? aisles.map((aisle,i)=> {
          const item = getAisleDetail(aisle)
          return <Chip variant={"outlined"} size={"small"} label={`${item.icon} ${item.name}`} key={`${id}-aisle-${i}`}/>
        }) : (<Chip
        size={"small"}
        variant={"outlined"}
        label={"Sin pasillo asignado"}
        disabled
      />)}
    >
    </ListItemText>
  </ListItem>)
}