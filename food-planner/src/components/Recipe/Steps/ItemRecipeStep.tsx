"use client"
import {IRecipeStep} from "@/util/models";
import {Chip, Grid2, IconButton, Paper, Typography} from "@mui/material";
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
    return texts.filter(
      (text) => text !== ''
    )
  }

  return (<Paper
    elevation={1}
    variant="outlined"
    style={{padding: 5}}
  >
    <Grid2 container direction={"row"} spacing={2} justifyContent={"space-around"}>
      <Grid2 size={8}>
        <Typography>{primaryText()}</Typography>
        {secondaryText().map((text, i)=>{
          return <Chip
            key={`instruction-cooking-${index}-${i}`}
            label={text}
            size={"small"} style={{marginRight: 5}}
          />
        })}
      </Grid2>
      {deleteStep ?
        <Grid2 size={2} justifyContent={"right"} alignContent={"center"}>
          <IconButton edge="end" aria-label="delete" onClick={()=>{deleteStep(step)}}>
            <Delete/>
          </IconButton>
        </Grid2>: <></>
      }
    </Grid2>
  </Paper>)
}