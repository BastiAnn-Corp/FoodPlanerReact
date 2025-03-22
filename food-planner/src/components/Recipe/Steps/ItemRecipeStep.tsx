import {IRecipeStep} from "@/util/models";
import {Grid2, IconButton, Paper, Typography} from "@mui/material";
import {Delete} from "@mui/icons-material";
import React from "react";
import {potText, robotCookText} from "@/util/convertions";

interface ItemRecipeStepProps {
  step: IRecipeStep;
  index: number;
  deleteStep?: (step: IRecipeStep) => void;
}

export function ItemRecipeStep({step, index, deleteStep}: ItemRecipeStepProps) {

  const primaryText = ():string => {
    return `${index+1}. ${step.instructions}`
  }

  const secondaryText = () => {
    const texts = [
      potText(step),
      robotCookText(step)
    ]
    return texts.filter(
      (text) => text !== ''
    ).flat().join(' | ')
  }

  return (<Paper
    elevation={1}
    variant="outlined"
    square
  >
    <Grid2 container direction={"row"} spacing={2}>
      <Grid2 size={8}>
        <Typography>{primaryText()}</Typography>
        <Typography variant={"caption"}>{secondaryText()}</Typography>
      </Grid2>
      {deleteStep ?
        <Grid2 size={4}>
          <IconButton edge="end" aria-label="delete" onClick={()=>{deleteStep(step)}}>
            <Delete/>
          </IconButton>
        </Grid2>: <></>
      }
    </Grid2>
  </Paper>)
}