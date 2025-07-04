"use client"

import {IRecipe} from "@/util/models";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button, ButtonGroup,
  Grid2,
  List, Paper, Snackbar,
  Typography
} from "@mui/material";
import {ItemRecipe} from "@/components/Recipe/ItemRecipe";
import {ItemRecipeIngredient} from "@/components/Recipe/Ingredients/ItemRecipeIngredient";
import {ItemRecipeStep} from "@/components/Recipe/Steps/ItemRecipeStep";
import {EditRounded, KeyboardArrowDownRounded, ModeEditRounded, OpenInNewRounded} from "@mui/icons-material";
import {DeleteButton} from "@/components/Common/DeleteButton";
import {deleteRecipe} from "@/lib/firebase/recipes";
import {useEffect, useState} from "react";
import {onAuthStateChanged} from "@firebase/auth";
import {authApp} from "@/lib/firebase/firebase-config";
import {envVars} from "@/util/config";
import {PortionsCard} from "@/components/Recipe/PortionsCard";
import {AuthorCard} from "@/components/Recipe/AuthorCard";

interface AccordionRecipeProps {
  refreshAction: ()=>void
  recipe: IRecipe
  index: number
}

export function AccordionRecipe({recipe, index, refreshAction}: AccordionRecipeProps) {
  const {ingredients_list, steps} = recipe;
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [userUUID, setUserUUID] = useState<string>("")

  useEffect(()=>{
    onAuthStateChanged(authApp, (user) => {
      if (user !== null) {
        setUserUUID(user.email!)
      } else {
        setUserUUID("")
      }
    });
  }, [])

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
      <Grid2 container spacing={2} columns={{ xs: 6, sm: 6, md: 12, lg:12, xl:12 }} justifyContent={"center"}>
        <Grid2 size={12} justifyItems={"center"}>
          <PortionsCard type={"chip"} portions={recipe.portions} color={"primary"} />{" "}
          <AuthorCard type={"chip"} creatorName={recipe.creator} color={"secondary"}/></Grid2>
        <Grid2 size={12}>
          <Typography>{recipe.notes || ''}</Typography>
        </Grid2>
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