import {ICategory, IRecipe} from "@/util/models";
import React from "react";
import {Avatar, Button, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography} from "@mui/material";
import {MoreVert, OpenInNewRounded} from "@mui/icons-material";
import {foodFamilies} from "@/util/constants";
import {envVars} from "@/util/config";

export function ItemRecipe(
  { recipe , index=0} : {
    recipe: IRecipe
    index: number
  }
) {
  const {family, name,portions} = recipe
  function familyEmoji(): ICategory{
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
    secondaryAction={
      <Button href={envVars.baseURL+`/recipes/${recipe.id}`} endIcon={<OpenInNewRounded/>}/>
    }
  >
    <ListItemAvatar>
      <Avatar
        key={`family-${index}-${familyData.id}`}
        sx={{height: 45, width: 45}}
      >{familyData.icon}</Avatar>
    </ListItemAvatar>
    <ListItemText
      primary={`${name}`}
      secondary={<Typography variant={"caption"}>
        {familyData.name}
      </Typography>}
    />
  </ListItem>)
}