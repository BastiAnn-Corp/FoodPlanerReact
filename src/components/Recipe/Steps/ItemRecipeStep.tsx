"use client"
import {IRecipeStep} from "@/util/models";
import {
  Checkbox,
  Chip,
  Grid2,
  IconButton,
  ListItem, ListItemButton, ListItemIcon,
  ListItemProps,
  ListItemText,
  Paper,
  Typography
} from "@mui/material";
import {Delete} from "@mui/icons-material";
import React, {ReactNode, useEffect} from "react";
import {potText, robotCookText} from "@/util/convertions";
import {InstructionChip} from "@/components/Recipe/Steps/InstructionChip";

interface ItemRecipeStepProps extends ListItemProps{
  step: IRecipeStep;
  index: number;
  editing?: {
    active: boolean,
    updateStep: (step: IRecipeStep) => void,
  }
  deleteStep?: (step: IRecipeStep) => void;
}

export function ItemRecipeStep(props: ItemRecipeStepProps) {
  const {
    step,
    index,
    deleteStep
  } = props

  useEffect(() => {

  }, [step, index]);

  function renderContent(): ReactNode{
    return <ListItem {...props}>
      <ListItemIcon>
        {deleteStep ?
          <Delete fontSize={"small"} onClick={()=>{deleteStep(step)}}/>
          :
          <Checkbox size={"small"}/>
        }
      </ListItemIcon>
      <ListItemText>
        {`${index+1}. ${step.instructions}`} <br/>
        <InstructionChip step={step} type={'machine'} key={`instruction-machine-${index}`}/>
        <InstructionChip step={step} type={'robot'} key={`instruction-robot-${index}`}/>
      </ListItemText>
    </ListItem>
  }

  return (<Paper
    elevation={1}
    variant="outlined"
    style={{padding: 2, marginTop: 3}}
  >
    {renderContent()}
  </Paper>)
}