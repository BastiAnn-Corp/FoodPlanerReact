"use client"

import {IRecipe} from "@/util/models";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid2,
  List, Snackbar,
  Typography
} from "@mui/material";
import {ItemRecipe} from "@/components/Recipe/ItemRecipe";
import {ItemRecipeIngredient} from "@/components/Recipe/Ingredients/ItemRecipeIngredient";
import {ItemRecipeStep} from "@/components/Recipe/Steps/ItemRecipeStep";
import { KeyboardArrowDownRounded, ModeEditRounded} from "@mui/icons-material";
import {DeleteButton} from "@/components/Common/DeleteButton";
import {deleteRecipe} from "@/lib/firebase/recipes";
import {useState} from "react";

interface AccordionRecipeProps {
  refreshAction: ()=>void
  recipe: IRecipe
  index: number
}

export function AccordionRecipe({recipe, index, refreshAction}: AccordionRecipeProps) {
  const {ingredients_list, steps} = recipe;
  const [errorMessage, setErrorMessage] = useState<string>('');

  async function deleteAction() {
    const error = await deleteRecipe(recipe.id!)
    setErrorMessage(error)
  }

  return <Accordion id={`accordion-recipe-${index}`}>
    <AccordionSummary
      expandIcon={<KeyboardArrowDownRounded />}
      id={`accordion-recipe-summary-${index}`}
    >
      <ItemRecipe recipe={recipe} index={index}/>
    </AccordionSummary>
    <AccordionDetails id={`accordion-recipe-details-${index}`}>
      <Grid2 container spacing={2} columns={{ xs: 6, sm: 6, md: 12, lg:12, xl:12 }}>
        <Grid2 size={6}>
          <Typography variant={"h6"} color={"primary"}>Ingredientes: </Typography>
          <List dense>
            {ingredients_list.map((ingredient,i)=>{
              return <ItemRecipeIngredient ingredient={ingredient} index={i}
                                           key={`ingredient-${index}-${i}`}/>
            })}
          </List>
        </Grid2>
        <Grid2 size={6}>
          <List dense>
            {steps.map((recipeStep,i)=>{
              return <ItemRecipeStep step={recipeStep} index={i} key={`step-${index}-${i}`}/>
            })}
          </List>
        </Grid2>
      </Grid2>
    </AccordionDetails>
    <AccordionActions disableSpacing>
      <Grid2 container direction={"row"} spacing={1} justifyContent={"space-between"} >
        <Grid2 size={"grow"}>
          <DeleteButton
            variant={"contained"}
            deleteAction={()=> {deleteAction()}}
            refresh={()=>{refreshAction()}}
          />
          <Snackbar open={errorMessage !== ''}
                    autoHideDuration={6000}
                    onClose={()=>{setErrorMessage('')}}
                    message={errorMessage}
          />
        </Grid2>
        <Grid2 size={"grow"}>
          <Button variant={"contained"} color={"primary"} startIcon={<ModeEditRounded/>} fullWidth disabled>Modificar</Button>
        </Grid2>
      </Grid2>
    </AccordionActions>
  </Accordion>
}