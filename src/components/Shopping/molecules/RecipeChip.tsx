"use client"
import { Box, IconButton, Typography } from "@mui/material";
import { CloseRounded } from "@mui/icons-material";
import { useState } from "react";
import { ShoppingRecipe } from "@/components/Shopping/types";
import { RecipeIngModal } from "@/components/Shopping/dialogs/RecipeIngModal";

interface RecipeChipProps {
  recipe: ShoppingRecipe;
  onRemove: (id: string) => void;
  onPortionChange: (id: string, delta: number) => void;
}

export function RecipeChip({ recipe, onRemove, onPortionChange }: RecipeChipProps) {
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
          pr: 0.5,
          py: 0.75,
          whiteSpace: 'nowrap',
          flexShrink: 0,
          transition: 'box-shadow 0.15s',
          '&:hover': { boxShadow: '0 0 0 1px rgba(124,179,66,0.24)' },
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
            '&:hover': { textDecoration: 'underline', textUnderlineOffset: '2px' },
          }}
        >
          {recipe.name}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.125,
            bgcolor: 'rgba(255,255,255,0.07)',
            borderRadius: '12px',
            px: 0.25,
            py: 0.125,
          }}
        >
          <Box
            component="button"
            onClick={() => onPortionChange(recipe.id, -1)}
            sx={{
              width: 22,
              height: 22,
              border: 'none',
              bgcolor: 'transparent',
              color: 'primary.main',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              fontFamily: 'inherit',
              '&:hover': { bgcolor: 'rgba(124,179,66,0.12)' },
            }}
          >
            −
          </Box>
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 500,
              minWidth: 20,
              textAlign: 'center',
              color: 'text.primary',
            }}
          >
            ×{recipe.portions}
          </Typography>
          <Box
            component="button"
            onClick={() => onPortionChange(recipe.id, 1)}
            sx={{
              width: 22,
              height: 22,
              border: 'none',
              bgcolor: 'transparent',
              color: 'primary.main',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              fontFamily: 'inherit',
              '&:hover': { bgcolor: 'rgba(124,179,66,0.12)' },
            }}
          >
            +
          </Box>
        </Box>

        <IconButton
          size="small"
          onClick={() => onRemove(recipe.id)}
          aria-label={`Quitar ${recipe.name}`}
          sx={{
            width: 26,
            height: 26,
            color: 'text.disabled',
            '&:hover': { color: 'text.primary', bgcolor: 'rgba(255,255,255,0.08)' },
          }}
        >
          <CloseRounded sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      {modalOpen && (
        <RecipeIngModal recipe={recipe} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
