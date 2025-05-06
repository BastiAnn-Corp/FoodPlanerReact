"use client"

import {IRecipe} from "@/util/models";
import {Accordion, AccordionDetails, AccordionSummary, Grid2, List, Typography} from "@mui/material";
import {ItemRecipe} from "@/components/Recipe/ItemRecipe";
import {ItemRecipeIngredient} from "@/components/Recipe/Ingredients/ItemRecipeIngredient";
import {ItemRecipeStep} from "@/components/Recipe/Steps/ItemRecipeStep";
import {KeyboardArrowDownRounded} from "@mui/icons-material";

interface AccordionRecipeProps {
  recipe: IRecipe
  index: number
}

export function AccordionRecipe({recipe, index}: AccordionRecipeProps) {
  const {ingredients_list, steps} = recipe;
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
  </Accordion>
}