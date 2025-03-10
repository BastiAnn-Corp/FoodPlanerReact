"use client"
import {IFoodFamily, IRecipe} from "@/util/models";
import React from "react";
import {Avatar, ListItem, ListItemAvatar, ListItemText, Typography} from "@mui/material";
import {ChevronRightRounded} from "@mui/icons-material";
import {foodFamilies} from "@/util/constants";

export function ItemRecipe(
  { recipe , index=0} : {
    recipe: IRecipe
    index: number
  }
) {
  const {family, name,portions} = recipe
  function familyEmoji(): IFoodFamily{
    const item = foodFamilies.find((item) => item.id === family)
    if (!item){
      return {
        name: family,
        id: family.toLowerCase(),
        icon: '🍽️'
      }
    } else {
      return item
    }
  }
  const familyData = familyEmoji()

  return (<ListItem
    secondaryAction={<ChevronRightRounded href={`/recipes/${recipe.id}`}/>}
  >
    <ListItemAvatar>
      <Avatar
        key={`family-${index}-${familyData.id}`}
        sx={{height: 45, width: 45}}
      >{familyData.icon}</Avatar>
    </ListItemAvatar>
    <ListItemText
      primary={name}
      secondary={<Typography variant={"caption"}>
        {`${portions} porciones`}
      </Typography>}
    />
  </ListItem>)
}