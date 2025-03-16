import React from "react";
import {RecipeForm} from "@/components/recipeForm";
import {Base} from "@/components/Base";

export default function CreateRecipes() {
  return (
    <Base>
      <RecipeForm save={false}/>
    </Base>
    );
}
