"use client"
import {IRecipe, IRecipeIngredient, IRecipeStep} from "@/util/models";
import {Alert, Grid2, List, Typography} from "@mui/material";
import {RecipeTitleAndTagsCard} from "@/components/Recipe/RecipeTitleAndTagsCard";
import {PortionsCard} from "@/components/Recipe/PortionsCard";
import {AuthorCard} from "@/components/Recipe/AuthorCard";
import {ListOfIngredients} from "@/components/Recipe/Ingredients/ListOfIngredients";
import {ItemRecipeStep} from "@/components/Recipe/Steps/ItemRecipeStep";
import React, {useEffect, useState} from "react";
import {onAuthStateChanged} from "@firebase/auth";
import {authApp} from "@/lib/firebase/firebase-config";
import {updateRecipe, updateRecipeIngredients, updateRecipeSteps} from "@/lib/firebase/recipes";
import {ListOfSteps} from "@/components/Recipe/Steps/ListOfSteps";

interface RecipePageProps {
  recipe: IRecipe
  id: string
}

export function RecipePage(props:RecipePageProps){
  const [recipe, setRecipe] = useState<IRecipe>(props.recipe)
  const [ingredientList, setIngredientList] = useState<IRecipeIngredient[]>(props.recipe.ingredients_list);
  const [stepList, setStepList] = useState<IRecipeStep[]>(props.recipe.steps);
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = React.useState<{severity: 'success' | 'error', message?: string}>({severity: "success"});
  const [userUUID, setUserUUID] = useState<string>("")

  useEffect(()=>{
    onAuthStateChanged(authApp, (user) => {
      if (user !== null) {
        setUserUUID(user.email!)
      } else {
        setUserUUID("")
      }
    });
    updateRecipeProps(undefined, false)
  },[])
  
  function updateRecipeProps(newRecipe: IRecipe | undefined, saving: boolean){
    if(!newRecipe){
      setRecipe(recipe)
      setStepList(recipe.steps);
      setIngredientList(recipe.ingredients_list);
    } else {
      setRecipe(newRecipe)
      setStepList(newRecipe.steps);
      setIngredientList(newRecipe.ingredients_list);
      setMessage(saving ? {
        severity: "error",
        message: "Los cambios no pudieron ser actualizados, intentalo de nuevo"
      } :{
        severity: "success"
      })
    }
  }
  
  async function updateIngredients(ingredients: IRecipeIngredient[]) {
    setIngredientList(ingredients)
    const res = await updateRecipeIngredients(props.id, ingredients)
    updateRecipeProps(res, true)
  }
  async function updateSteps(steps: IRecipeStep[]) {
    setStepList(steps)
    const res = await updateRecipeSteps(props.id, steps)
    updateRecipeProps(res, true)
  }

  return <Grid2 container spacing={2} marginTop={2} marginBottom={10} columns={{xs: 6, sm: 6, md: 12, lg: 12, xl: 12}}
         justifyContent={"center"}>
    {message.message ? <Grid2 size={12}>
      <Alert severity={message.severity}>{message.message}</Alert>
    </Grid2> : <></>}
    <Grid2 size={6}>
      <RecipeTitleAndTagsCard recipe={recipe}/>
    </Grid2>
    <Grid2 size={3}>
      <PortionsCard color={"secondary"} type={'card'} portions={recipe.portions}/>
    </Grid2>
    <Grid2 size={3}>
      <AuthorCard color={"secondary"} creatorName={recipe.creator} type={"card"}/>
    </Grid2>
    <Grid2 size={12}>
      <Typography>
        <Typography color={"secondary"}>Notas de la receta:<br/></Typography>
        <Typography>{recipe.notes || 'Sin Notas'}</Typography>
      </Typography>
    </Grid2>
    <Grid2 size={6}>
      <ListOfIngredients
        ingredients={ingredientList}
        editing={userUUID !== ''}
        update={updateIngredients}
      />
    </Grid2>
    <Grid2 size={6}>
      <ListOfSteps
        steps={stepList}
        editing={userUUID !== ''}
        update={updateSteps}
      />
    </Grid2>
  </Grid2>
}