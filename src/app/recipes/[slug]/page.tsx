
import {getRecipeById} from "@/lib/firebase/recipes";
import {Base} from "@/components/Base";
import {
  Button,
  ButtonGroup,
  Divider,
  Grid2,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography
} from "@mui/material";
import {ItemRecipeIngredient} from "@/components/Recipe/Ingredients/ItemRecipeIngredient";
import {ItemRecipeStep} from "@/components/Recipe/Steps/ItemRecipeStep";
import {IIngredient, IRecipeIngredient, IRecipeStep} from "@/util/models";
import {Delete} from "@mui/icons-material";
import React from "react";


export default async function RecipeDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const recipe = await getRecipeById(slug)

  function renderIngredient (ingredients: IRecipeIngredient, index: number) {
    const {ingredient, quantity_unit, quantity} = ingredients;
    return <ListItem
      key={`recipe-ingredient-${ingredient.name}-${index}`}
      divider
      secondaryAction={
        <IconButton edge="end">
          <Delete/>
        </IconButton>
      }
    >
      <ListItemText primary={`${ingredient.name} (${quantity} ${quantity_unit})`} />
    </ListItem>
  }

  return !recipe ? <Base>
      <Typography color={"error"}>Receta no existe</Typography>
  </Base> :
    <Base>
      <Typography variant={"h4"} color={"primary"} marginTop={2}>{recipe.name}</Typography>
      <Divider />
      <Grid2 container spacing={2} marginTop={2} columns={{ xs: 6, sm: 6, md: 12, lg:12, xl:12 }} justifyContent={"center"}>
        <Grid2 size={4}>
          <ButtonGroup variant={"contained"} size={"medium"}>
            <Button color={'inherit'} disabled size={"small"}>Esta receta rinde</Button>
            <Button >{recipe.portions} porciones</Button>
          </ButtonGroup>
        </Grid2>
        <Grid2 size={4}><ButtonGroup variant={"contained"} size={"medium"}>
          <Button color={"secondary"}>{recipe.creator || 'BastiAnn'} </Button>
          <Button color={'inherit'} disabled size={"small"}>publicó esta receta</Button>
        </ButtonGroup></Grid2>
        <Grid2 size={12}>
          <Typography>{recipe.notes || ''}</Typography>
        </Grid2>
        <Grid2 size={6}>
          <Typography variant={"h6"} color={"primary"}>Ingredientes: </Typography>
          <List>
            {recipe.ingredients_list.map((ingredient,i)=>{
              return renderIngredient(ingredient,i)
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
    </Base>

}