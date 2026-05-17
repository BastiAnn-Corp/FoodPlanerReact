"use client"
import { Box, Divider, Dialog, DialogTitle, DialogContent, IconButton, Typography } from "@mui/material";
import { CloseRounded } from "@mui/icons-material";
import { RecipeIngredientDetail, ShoppingRecipe } from "@/components/Shopping/types";

interface RecipeIngModalProps {
  recipe: ShoppingRecipe;
  ingredientDetails: RecipeIngredientDetail[];
  onClose: () => void;
}

export function RecipeIngModal({ recipe, ingredientDetails, onClose }: RecipeIngModalProps) {
  const ingredients = ingredientDetails;

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          backgroundImage: 'none',
          borderRadius: { xs: '18px 18px 0 0', sm: '16px' },
          m: { xs: 0, sm: 2 },
          mt: { xs: 'auto', sm: 'auto' },
          width: '100%',
        },
      }}
      sx={{ alignItems: { xs: 'flex-end', sm: 'center' } }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          pb: 1,
        }}
      >
        <Typography component="span" sx={{ fontSize: '1.625rem' }}>{recipe.emoji}</Typography>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" component="div" sx={{ lineHeight: 1.2 }}>
            {recipe.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ×{recipe.portions} porciones
          </Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="Cerrar" size="small" sx={{ color: 'text.secondary' }}>
          <CloseRounded />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <Typography
          variant="overline"
          sx={{ fontSize: '0.6875rem', letterSpacing: '0.8px', color: 'text.secondary', display: 'block', mb: 1 }}
        >
          Ingredientes
        </Typography>

        {ingredients.map((ing, i) => (
          <Box key={i}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1.125,
              }}
            >
              <Box>
                <Typography variant="body2" color="text.primary">{ing.name}</Typography>
                <Typography variant="caption" color="text.disabled">{ing.aisle}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {ing.qty}
              </Typography>
            </Box>
            {i < ingredients.length - 1 && <Divider />}
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
}
