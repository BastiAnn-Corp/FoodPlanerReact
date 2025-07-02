
import {getRecipeById} from "@/lib/firebase/recipes";
import {
  Divider,
  Grid2,
  List,
  Typography
} from "@mui/material";
import {ItemRecipeStep} from "@/components/Recipe/Steps/ItemRecipeStep";
import React from "react";
import {ItemRecipeIngredient} from "@/components/Recipe/Steps/ItemRecipeIngredient";
import {AuthorCard} from "@/components/Recipe/AuthorCard";
import {PortionsCard} from "@/components/Recipe/PortionsCard";
import {RecipeTitleAndTagsCard} from "@/components/Recipe/RecipeTitleAndTagsCard";
export default async function Page(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const recipe = await getRecipeById(slug)

  return !recipe ?
    <Typography color={"error"}>Receta no existe</Typography>
   :
    <Grid2 container spacing={2} marginTop={2} columns={{ xs: 6, sm: 6, md: 12, lg:12, xl:12 }} justifyContent={"center"}>
      <Grid2 size={6}>
        <RecipeTitleAndTagsCard recipe={recipe} />
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
        <Typography variant={"h6"} color={"primary"}>Ingredientes: </Typography>
        <List>
          {recipe.ingredients_list.map((ingredient,i)=>{
            return <ItemRecipeIngredient ingredient={ingredient} key={`ingredient-${i}`}/>
          })}
        </List>
      </Grid2>
      <Grid2 size={6}>
        <List>
          {recipe.steps.map((recipeStep,i)=>{
            return <ItemRecipeStep step={recipeStep} index={i} key={`step-${i}`}/>
          })}
        </List>
      </Grid2>
    </Grid2>
}

function generateStaticParams() {}