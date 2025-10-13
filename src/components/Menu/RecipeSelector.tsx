import React, {useEffect, useState} from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Checkbox,
  FormGroup,
  FormControlLabel,
  CircularProgress,
  Alert,
  InputAdornment,
  Divider
} from '@mui/material';
import {SearchRounded, CheckCircleRounded} from '@mui/icons-material';
import {IRecipe, IMenuRecipe} from '@/util/models';
import {TDaysMenu, TRecipeSection, TSeasons, menuDays, foodFamilies, seasons} from '@/util/constants';
import {getRecipes} from '@/lib/firebase/recipes';

interface RecipeSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (recipe: IRecipe, selectedDays: TDaysMenu[], section: TRecipeSection) => void;
  currentDay: TDaysMenu;
  currentSection: TRecipeSection;
  existingRecipes: IMenuRecipe[];
}

export function RecipeSelector({
  open,
  onClose,
  onSelect,
  currentDay,
  currentSection,
  existingRecipes
}: RecipeSelectorProps) {
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<IRecipe | null>(null);
  const [selectedDays, setSelectedDays] = useState<TDaysMenu[]>([currentDay]);

  useEffect(() => {
    if (open) {
      loadRecipes();
      setSelectedDays([currentDay]); // Reset to current day when opening
    }
  }, [open, currentDay]);

  async function loadRecipes() {
    setIsLoading(true);
    try {
      const response = await getRecipes({});
      setRecipes(response);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function filterRecipes(recipe: IRecipe): boolean {
    // Search filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      const matchesName = recipe.name.toLowerCase().includes(searchLower);
      const matchesIngredient = recipe.ingredients_list?.some(ing =>
        ing.ingredient.name.toLowerCase().includes(searchLower)
      );
      if (!matchesName && !matchesIngredient) return false;
    }

    // Family filter
    if (selectedFamily && recipe.family !== selectedFamily) {
      return false;
    }

    // Season filter
    if (selectedSeason && !recipe.seasons?.includes(selectedSeason as TSeasons)) {
      return false;
    }

    return true;
  }

  function handleDayToggle(day: TDaysMenu) {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  }

  function handleConfirm() {
    if (selectedRecipe && selectedDays.length > 0) {
      onSelect(selectedRecipe, selectedDays, currentSection);
      handleClose();
    }
  }

  function handleClose() {
    setSelectedRecipe(null);
    setSearchText('');
    setSelectedFamily('');
    setSelectedSeason('');
    onClose();
  }

  const filteredRecipes = recipes.filter(filterRecipes);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>
        Seleccionar Receta
        <Typography variant="body2" color="text.secondary">
          {currentSection} - {menuDays.find(d => d.id === currentDay)?.name}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {/* Search and Filters */}
        <Box mb={3}>
          <TextField
            placeholder="Buscar receta o ingrediente..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="small"
            fullWidth
            sx={{ mb: 2 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Family filter */}
          <Box mb={1}>
            <Typography variant="caption" color="text.secondary">
              Familia
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={0.5}>
              {foodFamilies.map((family) => (
                <Chip
                  key={family.id}
                  label={`${family.icon} ${family.name}`}
                  size="small"
                  onClick={() => setSelectedFamily(selectedFamily === family.id ? '' : family.id)}
                  color={selectedFamily === family.id ? 'secondary' : 'default'}
                />
              ))}
            </Box>
          </Box>

          {/* Season filter */}
          <Box>
            <Typography variant="caption" color="text.secondary">
              Temporada
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={0.5}>
              {seasons.map((season) => (
                <Chip
                  key={season.key}
                  label={season.name}
                  size="small"
                  onClick={() => setSelectedSeason(selectedSeason === season.key ? '' : season.key)}
                  color={selectedSeason === season.key ? season.color as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' : 'default'}
                />
              ))}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Recipe List */}
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : filteredRecipes.length === 0 ? (
          <Alert severity="info">
            No se encontraron recetas con los filtros seleccionados
          </Alert>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" mb={1}>
              {filteredRecipes.length} receta{filteredRecipes.length !== 1 ? 's' : ''} disponible{filteredRecipes.length !== 1 ? 's' : ''}
            </Typography>
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {filteredRecipes.map((recipe) => {
                const familyIcon = foodFamilies.find(f => f.id === recipe.family)?.icon || '🍽️';
                const isSelected = selectedRecipe?.id === recipe.id;

                return (
                  <ListItem key={recipe.id} disablePadding>
                    <ListItemButton
                      selected={isSelected}
                      onClick={() => setSelectedRecipe(recipe)}
                    >
                      <Box display="flex" alignItems="center" width="100%">
                        {isSelected && (
                          <CheckCircleRounded color="primary" sx={{ mr: 1 }} fontSize="small" />
                        )}
                        <Typography sx={{ fontSize: '1.2rem', mr: 1 }}>
                          {familyIcon}
                        </Typography>
                        <ListItemText
                          primary={recipe.name}
                          secondary={`${recipe.portions} porción${recipe.portions !== 1 ? 'es' : ''}`}
                        />
                      </Box>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </>
        )}

        {/* Day selection */}
        {selectedRecipe && (
          <Box mt={3}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Asignar a los siguientes días:
            </Typography>
            <FormGroup row>
              {menuDays.map((day) => (
                <FormControlLabel
                  key={day.id}
                  control={
                    <Checkbox
                      checked={selectedDays.includes(day.id as TDaysMenu)}
                      onChange={() => handleDayToggle(day.id as TDaysMenu)}
                      size="small"
                    />
                  }
                  label={<Typography variant="body2">{day.name}</Typography>}
                />
              ))}
            </FormGroup>
            {selectedDays.length === 0 && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                Debes seleccionar al menos un día
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!selectedRecipe || selectedDays.length === 0}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
