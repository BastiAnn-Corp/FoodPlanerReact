"use client"
import { Box, Typography } from "@mui/material";
import { RecipeIngredientDetail, ShoppingRecipe } from "@/components/Shopping/types";
import { ReadonlyRecipeChip } from "@/components/Shopping/molecules/ReadonlyRecipeChip";

interface ReadonlyRecipesProps {
  recipes: ShoppingRecipe[];
  getIngredientDetails?: (recipeId: string) => RecipeIngredientDetail[];
}

/** Guest-view list of the recipes that make up a shared list — view-only, no edit affordances. */
export function ReadonlyRecipes({ recipes, getIngredientDetails }: ReadonlyRecipesProps) {
  if (recipes.length === 0) return null;

  return (
    <Box sx={{ px: 2, pt: 1.25, pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Typography
        sx={{
          fontSize: '0.6875rem',
          fontWeight: 600,
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}
      >
        Recetas en esta lista · {recipes.length}
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, pt: 1, flexWrap: 'wrap' }}>
        {recipes.map(r => (
          <ReadonlyRecipeChip
            key={r.id}
            recipe={r}
            ingredientDetails={getIngredientDetails?.(r.id) ?? []}
          />
        ))}
      </Box>
    </Box>
  );
}
