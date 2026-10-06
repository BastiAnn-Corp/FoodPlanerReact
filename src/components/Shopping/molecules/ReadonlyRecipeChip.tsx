"use client"
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { RecipeIngredientDetail, ShoppingRecipe } from "@/components/Shopping/types";
import { RecipeIngModal } from "@/components/Shopping/dialogs/RecipeIngModal";

interface ReadonlyRecipeChipProps {
  recipe: ShoppingRecipe;
  ingredientDetails?: RecipeIngredientDetail[];
}

/** Inert recipe pill for the guest/read-only view — no stepper, no remove button. */
export function ReadonlyRecipeChip({ recipe, ingredientDetails = [] }: ReadonlyRecipeChipProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          bgcolor: 'rgba(124,179,66,0.12)',
          border: '1px solid rgba(124,179,66,0.24)',
          borderRadius: '24px',
          pl: 1.25,
          pr: 1.5,
          py: 0.75,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        <Typography component="span" sx={{ fontSize: '1rem' }}>{recipe.emoji}</Typography>

        <Typography
          component="button"
          onClick={() => setModalOpen(true)}
          sx={{
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: 'text.primary',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            p: 0,
            fontFamily: 'inherit',
            borderRadius: '3px',
            maxWidth: '120px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            '&:hover': { textDecoration: 'underline', textUnderlineOffset: '2px' },
          }}
        >
          {recipe.name}
        </Typography>

        <Typography
          sx={{
            fontSize: '0.75rem',
            fontWeight: 500,
            color: 'text.secondary',
          }}
        >
          ×{recipe.portions}
        </Typography>
      </Box>

      {modalOpen && (
        <RecipeIngModal recipe={recipe} ingredientDetails={ingredientDetails} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
