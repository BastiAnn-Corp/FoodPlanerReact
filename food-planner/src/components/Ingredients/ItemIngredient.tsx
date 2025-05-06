import {ICategory, IIngredient} from "@/util/models";
import {Checkbox, Chip, ListItem, ListItemText} from "@mui/material";
import {Edit} from "@mui/icons-material";
import React from "react";
import {marketAisles, TAisle} from "@/util/constants";

interface ItemIngredientProps {
  ingredient: IIngredient;
  editable?: boolean;
  index?: number;
  selected?: boolean;
  select?:(i:IIngredient) => void
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

  const defaultStartIcon = <></>

  const renderSelection = () => {
    return props.select ?
      <Checkbox
        checked={props.selected}
        onClick={()=>{props.select!(props.ingredient)}}
      />
      : defaultStartIcon
  }

  const renderEdition = () => {
    return props.editable ?
      <Edit
        onClick={()=>{}}
      />
      : defaultStartIcon
  }

  return (<ListItem
    divider={true}
    secondaryAction={
      props.select ? renderSelection() : renderEdition()
    }
  >
    <ListItemText
      primary={name}
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