import {getRecipeById, getRecipes} from "@/lib/firebase/recipes";
import {Typography} from "@mui/material";
import {RecipePage} from "@/components/Recipe/RecipePage";

export async function generateStaticParams() {
  const recipes = await getRecipes({});
  return recipes.map((recipe) => ({
    slug: recipe.id,
  }));
}

export default async function Page(
  {params}: { params: Promise<{ slug: string }> }
) {
  const {slug} = await params
  const recipe = await getRecipeById(slug)

  return !recipe ?
    <Typography color={"error"}>Receta no existe</Typography>
    :
    <RecipePage recipe={recipe}/>
}