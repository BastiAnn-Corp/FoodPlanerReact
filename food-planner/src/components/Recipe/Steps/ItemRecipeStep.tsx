"use client"
import {IRecipeStep} from "@/util/models";
import {Checkbox, Chip, Grid2, IconButton, Paper, Typography} from "@mui/material";
import {Delete} from "@mui/icons-material";
import React, {useEffect} from "react";
import {potText, robotCookText} from "@/util/convertions";

interface ItemRecipeStepProps {
  step: IRecipeStep;
  index: number;
  deleteStep?: (step: IRecipeStep) => void;
}

export function ItemRecipeStep({step, index, deleteStep}: ItemRecipeStepProps) {
  useEffect(() => {

  }, [step, index]);

  const primaryText = ():string => {
    return `${index+1}. ${step.instructions}`
  }

  const secondaryText = () => {
    const texts = [
      potText(step),
      robotCookText(step)
    ]
    const chips = []
    if (texts[0] !== ''){
      chips.push(<Chip
        key={`instruction-cooking-pot-${index}`}
        label={texts[0]}
        color={"warning"}
        size={"small"} style={{marginRight: 5}}
      />)
    }
    if (texts[1] !== ''){
      chips.push(<Chip
        key={`instruction-cooking-robot-${index}`}
        label={texts[1]}
        color={"info"}
        size={"small"} style={{marginRight: 5}}
      />)
    }
    return chips
  }

  return (<Paper
    elevation={1}
    variant="outlined"
    style={{padding: 5, marginTop: 3}}
  >
    <Grid2 container direction={"row"} spacing={2} justifyContent={"space-around"}>
      <Grid2 size={8}>
        <Typography>{primaryText()}</Typography>
        {secondaryText().map((chip)=>{
          return chip
        })}
      </Grid2>
      {deleteStep ?
        <Grid2 justifyContent={"right"} alignContent={"center"}>
          <IconButton edge="end" aria-label="delete" onClick={()=>{deleteStep(step)}}>
            <Delete/>
          </IconButton>
        </Grid2>: <Grid2 alignContent={"center"}>
          <Checkbox/>
        </Grid2>
      }
    </Grid2>
  </Paper>)
}