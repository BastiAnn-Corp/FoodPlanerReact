"use client"
import React, {useState} from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  FormControlLabel,
  Checkbox,
  Alert,
  Divider
} from '@mui/material';
import {
  SaveRounded,
  CancelRounded,
  RestaurantMenuRounded
} from '@mui/icons-material';
import {useRouter} from 'next/navigation';
import {IMenuRecipe, IRecipe} from '@/util/models';
import {TSeasons, TDaysMenu, TRecipeSection, seasons} from '@/util/constants';
import {createMenu} from '@/lib/firebase/menus';
import {WeeklyCalendar} from '@/components/Menu/WeeklyCalendar';
import {RecipeSelector} from '@/components/Menu/RecipeSelector';
import {envVars} from '@/util/config';

export default function CreateMenuPage() {
  const router = useRouter();

  // Form state
  const [persons, setPersons] = useState<number>(2);
  const [selectedSeasons, setSelectedSeasons] = useState<TSeasons[]>([]);
  const [notes, setNotes] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [menuRecipes, setMenuRecipes] = useState<IMenuRecipe[]>([]);

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [currentSlot, setCurrentSlot] = useState<{day: TDaysMenu; section: TRecipeSection} | null>(null);

  // Validation
  const isValid = persons > 0 && selectedSeasons.length > 0;

  function handleSeasonToggle(season: TSeasons) {
    setSelectedSeasons(prev =>
      prev.includes(season)
        ? prev.filter(s => s !== season)
        : [...prev, season]
    );
  }

  function handleSlotClick(day: TDaysMenu, section: TRecipeSection) {
    setCurrentSlot({day, section});
    setSelectorOpen(true);
  }

  function handleRecipeSelect(recipe: IRecipe, selectedDays: TDaysMenu[], section: TRecipeSection) {
    // Remove existing recipes for the same days and section
    const filtered = menuRecipes.filter(r =>
      !(selectedDays.some(day => r.days?.includes(day)) && r.section === section)
    );

    // Add new recipe
    const newMenuRecipe: IMenuRecipe = {
      name: recipe.name,
      id: recipe.id!,
      family: recipe.family,
      portions: recipe.portions,
      days: selectedDays,
      section: section
    };

    setMenuRecipes([...filtered, newMenuRecipe]);
    setSelectorOpen(false);
  }

  function handleRecipeRemove(recipe: IMenuRecipe, day: TDaysMenu, section: TRecipeSection) {
    setMenuRecipes(prev => {
      return prev.map(r => {
        if (r.id === recipe.id && r.section === section) {
          // Remove this day from the recipe
          const updatedDays = r.days?.filter(d => d !== day) || [];
          if (updatedDays.length === 0) {
            // If no days left, remove the recipe entirely
            return null;
          }
          return {...r, days: updatedDays};
        }
        return r;
      }).filter((r): r is IMenuRecipe => r !== null);
    });
  }

  async function handleSave() {
    if (!isValid) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // TODO: Get actual user email from auth
      const creator = 'andrea.benavidesj@gmail.com';

      const result = await createMenu({
        persons,
        seasons: selectedSeasons,
        creator,
        editors: [],
        notes,
        public: isPublic,
        recipes: menuRecipes
      });

      if (result.error) {
        setError(result.error);
      } else {
        // Navigate to menu detail or list
        router.push(`${envVars.baseURL}/menus`);
      }
    } catch (err) {
      console.error('Error creating menu:', err);
      setError('Error al crear el menú');
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    router.push(`${envVars.baseURL}/menus`);
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 2, mb: 4 }}>
        {/* Header */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <Box display="flex" alignItems="center">
            <RestaurantMenuRounded sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Crear Nuevo Menú
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Planifica tus comidas semanales
              </Typography>
            </Box>
          </Box>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Basic Info Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Información Básica
          </Typography>

          <Box display="flex" flexDirection="column" gap={2}>
            {/* Persons */}
            <TextField
              label="Número de personas"
              type="number"
              value={persons}
              onChange={(e) => setPersons(Math.max(1, parseInt(e.target.value) || 1))}
              size="small"
              required
              slotProps={{
                htmlInput: { min: 1, max: 50 }
              }}
              helperText="¿Para cuántas personas planificas este menú?"
            />

            {/* Seasons */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Temporadas <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {seasons.map((season) => (
                  <Chip
                    key={season.key}
                    label={season.name}
                    onClick={() => handleSeasonToggle(season.key as TSeasons)}
                    color={selectedSeasons.includes(season.key as TSeasons) ? season.color as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' : 'default'}
                  />
                ))}
              </Box>
              {selectedSeasons.length === 0 && (
                <Typography variant="caption" color="error">
                  Selecciona al menos una temporada
                </Typography>
              )}
            </Box>

            {/* Notes */}
            <TextField
              label="Notas"
              multiline
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              size="small"
              placeholder="Añade notas o comentarios sobre este menú..."
              helperText="Opcional: información adicional sobre el menú"
            />

            {/* Public checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
              }
              label={
                <Box>
                  <Typography variant="body2">Hacer este menú público</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Otros usuarios podrán ver y copiar este menú
                  </Typography>
                </Box>
              }
            />
          </Box>
        </Paper>

        {/* Weekly Calendar */}
        <WeeklyCalendar
          recipes={menuRecipes}
          editable={true}
          menuPersons={persons}
          onSlotClick={handleSlotClick}
          onRecipeRemove={handleRecipeRemove}
        />

        {/* Action Buttons */}
        <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
          <Button
            variant="outlined"
            startIcon={<CancelRounded />}
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveRounded />}
            onClick={handleSave}
            disabled={!isValid || isSaving}
          >
            {isSaving ? 'Guardando...' : 'Crear Menú'}
          </Button>
        </Box>
      </Box>

      {/* Recipe Selector Modal */}
      {currentSlot && (
        <RecipeSelector
          open={selectorOpen}
          onClose={() => setSelectorOpen(false)}
          onSelect={handleRecipeSelect}
          currentDay={currentSlot.day}
          currentSection={currentSlot.section}
          existingRecipes={menuRecipes}
        />
      )}
    </Container>
  );
}
