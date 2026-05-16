"use client"
import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import { AddCircleOutlineRounded } from "@mui/icons-material";
import { ShoppingRecipe } from "@/components/Shopping/types";
import { STUB_RECIPES } from "@/components/Shopping/stubs";
import { RecipeChip } from "@/components/Shopping/molecules/RecipeChip";

interface RecipeSelectorProps {
  selectedRecipes: ShoppingRecipe[];
  onAdd: (recipe: ShoppingRecipe) => void;
  onRemove: (id: string) => void;
  onPortionChange: (id: string, delta: number) => void;
}

export function RecipeSelector({ selectedRecipes, onAdd, onRemove, onPortionChange }: RecipeSelectorProps) {
  const available = STUB_RECIPES.filter(r => !selectedRecipes.find(s => s.id === r.id));

  return (
    <Box sx={{ px: 2, pt: 1.5, pb: 0.25, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Autocomplete
        options={available}
        getOptionLabel={r => r.name}
        value={null}
        onChange={(_, recipe) => {
          if (recipe) onAdd({ ...recipe, portions: recipe.basePortions });
        }}
        blurOnSelect
        clearOnBlur
        noOptionsText="No hay más recetas"
        renderInput={params => (
          <TextField
            {...params}
            placeholder="Añadir recetas..."
            size="small"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <AddCircleOutlineRounded sx={{ color: 'primary.main', fontSize: 20, mr: 0.5 }} />
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'action.hover',
                borderRadius: 2,
                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
              },
            }}
          />
        )}
        renderOption={(props, recipe) => (
          <Box component="li" {...props} sx={{ gap: 1.25, py: 1.25, px: 1.75 }}>
            <Typography component="span" sx={{ fontSize: '1.375rem' }}>{recipe.emoji}</Typography>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight={500}>{recipe.name}</Typography>
              <Typography variant="caption" color="text.secondary">{recipe.basePortions} porciones base</Typography>
            </Box>
          </Box>
        )}
      />

      {selectedRecipes.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            overflowX: 'auto',
            pt: 1.25,
            pb: 0.25,
            flexWrap: { xs: 'nowrap', md: 'wrap' },
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {selectedRecipes.map(r => (
            <RecipeChip
              key={r.id}
              recipe={r}
              onRemove={onRemove}
              onPortionChange={onPortionChange}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
