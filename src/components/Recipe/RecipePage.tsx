"use client"
import {IRecipe, IRecipeIngredient} from "@/util/models";
import {Grid2, List, Typography} from "@mui/material";
import {RecipeTitleAndTagsCard} from "@/components/Recipe/RecipeTitleAndTagsCard";
import {PortionsCard} from "@/components/Recipe/PortionsCard";
import {AuthorCard} from "@/components/Recipe/AuthorCard";
import {ListOfIngredients} from "@/components/Recipe/Ingredients/ListOfIngredients";
import {ItemRecipeStep} from "@/components/Recipe/Steps/ItemRecipeStep";
import React, {useEffect, useState} from "react";
import {onAuthStateChanged} from "@firebase/auth";
import {authApp} from "@/lib/firebase/firebase-config";

interface RecipePageProps {
  recipe: IRecipe
}

export function RecipePage(props:RecipePageProps){
  const [recipe, setRecipe] = useState<IRecipe>(props.recipe)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = React.useState<{severity: 'success' | 'error', message?: string}>({severity: "success"});
  const [userUUID, setUserUUID] = useState<string>("")

  useEffect(()=>{
    onAuthStateChanged(authApp, (user) => {
      if (user !== null) {
        setUserUUID(user.email!)
      } else {
        setMessage({severity: 'error', message: "Para guardar receta debe conectarse con su cuenta Google, haciendo click en el botón abajo, si ya se conectó refresque la pagina"})
        setUserUUID("")
      }
    });
  },[])

  function updateIngredients(ingredients: IRecipeIngredient[]) {
    const updatedRecipe = {...recipe, ingredients: ingredients};
    setRecipe(updatedRecipe);
  }

  return <Grid2 container spacing={2} marginTop={2} marginBottom={10} columns={{xs: 6, sm: 6, md: 12, lg: 12, xl: 12}}
         justifyContent={"center"}>
    <Grid2 size={6}>
      <RecipeTitleAndTagsCard recipe={recipe}/>
    </Grid2>
    <Grid2 size={3}>
      <PortionsCard color={"secondary"} type={'card'} portions={recipe.portions}/>
    </Grid2>
    <Grid2 size={3}>
      <AuthorCard color={"secondary"} creatorname={recipe.creator} type={"card"}/>
    </Grid2>
    <Grid2 size={12}>
      <Typography>
        <Typography color={"secondary"}>Notas de la receta:<br/></Typography>
        <Typography>{recipe.notes || 'Sin Notas'}</Typography>
      </Typography>
    </Grid2>
    <Grid2 size={6}>
      <Typography variant={"h6"} color={"primary"}>INGREDIENTES </Typography>
      <ListOfIngredients
        ingredients={recipe.ingredients_list}
        editing={{
          active: userUUID !== '',
          update: updateIngredients,
        }}
      />
    </Grid2>
    <Grid2 size={6}>
      <Typography variant={"h6"} color={"secondary"}>INSTRUCCIONES </Typography>
      <List>
        {recipe.steps.map((recipeStep, i) => {
          return <ItemRecipeStep step={recipeStep} index={i} key={`step-${i}`}/>
        })}
      </List>
    </Grid2>
  </Grid2>
}