"use client"
import {IRecipe, IRecipeIngredient} from "@/util/models";
import {Alert, Grid2, List, Typography} from "@mui/material";
import {RecipeTitleAndTagsCard} from "@/components/Recipe/RecipeTitleAndTagsCard";
import {PortionsCard} from "@/components/Recipe/PortionsCard";
import {AuthorCard} from "@/components/Recipe/AuthorCard";
import {ListOfIngredients} from "@/components/Recipe/Ingredients/ListOfIngredients";
import {ItemRecipeStep} from "@/components/Recipe/Steps/ItemRecipeStep";
import React, {useEffect, useState} from "react";
import {onAuthStateChanged} from "@firebase/auth";
import {authApp} from "@/lib/firebase/firebase-config";
import {updateRecipe, updateRecipeIngredients} from "@/lib/firebase/recipes";

interface RecipePageProps {
  recipe: IRecipe
  id: string
}

export function RecipePage(props:RecipePageProps){
  const [recipe, setRecipe] = useState<IRecipe>(props.recipe)
  const [ingredientList, setIngredientList] = useState<IRecipeIngredient[]>(props.recipe.ingredients_list);
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = React.useState<{severity: 'success' | 'error', message?: string}>({severity: "success"});
  const [userUUID, setUserUUID] = useState<string>("")

  useEffect(()=>{
    onAuthStateChanged(authApp, (user) => {
      if (user !== null) {
        setUserUUID(user.email!)
        setMessage({severity:"success"})
      } else {
        setMessage({severity: 'error', message: "Para guardar receta debe conectarse con su cuenta Google, haciendo click en el botón abajo, si ya se conectó refresque la pagina"})
        setUserUUID("")
      }
    });
  },[])

  async function saveRecipe(){
    const changed : IRecipe = {
      id: props.id,
      name: recipe.name,
      portions: recipe.portions,
      seasons: recipe.seasons,
      steps: recipe.steps,
      ingredients_list: ingredientList,
      creator: recipe.creator,
      family: recipe.family,
      notes: recipe.notes || '',
      editors: recipe.editors,
    }
    const loadedRecipe = await updateRecipe(changed)
    if(loadedRecipe){
      setRecipe(loadedRecipe)
      setMessage({severity: "success", message: "La lista de ingredientes actualizada con éxito!"})
    } else {
      setMessage({severity: "error", message: "La lista de ingredientes no pudo ser actualizada, intentalo de nuevo"})
    }
  }
  async function updateIngredients(ingredients: IRecipeIngredient[]) {
    setIngredientList(ingredients)
    await updateRecipeIngredients(props.id, ingredients)
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
      <Typography variant={"h6"} color={"primary"}>INGREDIENTES </Typography>
      <ListOfIngredients
        ingredients={recipe.ingredients_list}
        editing={userUUID !== ''}
        update={updateIngredients}
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