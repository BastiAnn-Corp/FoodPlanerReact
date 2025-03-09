import React from "react";
import {RecipeForm} from "@/components/recipeForm";
import {Container} from "@mui/material";

export default function CreateRecipes() {
  return (
    <Container maxWidth={"md"}>
      <RecipeForm save={false}/>
    </Container>
    );
}
