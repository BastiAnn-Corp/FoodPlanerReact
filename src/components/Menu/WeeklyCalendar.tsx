import React from 'react';
import {
  Box,
  Paper,
  Typography
} from '@mui/material';
import {IMenuRecipe} from '@/util/models';
import {TDaysMenu, TRecipeSection, menuDays, recipeSections} from '@/util/constants';
import {MealSlot} from './MealSlot';

interface WeeklyCalendarProps {
  recipes: IMenuRecipe[];
  editable: boolean;
  menuPersons: number;
  onSlotClick?: (day: TDaysMenu, section: TRecipeSection) => void;
  onRecipeRemove?: (recipe: IMenuRecipe, day: TDaysMenu, section: TRecipeSection) => void;
}

export function WeeklyCalendar({
  recipes,
  editable,
  menuPersons,
  onSlotClick,
  onRecipeRemove
}: WeeklyCalendarProps) {
  // Find all recipes for a specific day and section
  const getRecipesForSlot = (day: TDaysMenu, section: TRecipeSection): IMenuRecipe[] => {
    return recipes.filter(r =>
      r.days?.includes(day) && r.section === section
    );
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Calendario Semanal
      </Typography>

      <Box sx={{ overflowX: 'auto', overflowY: 'visible', pb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, minWidth: 'fit-content' }}>
          {/* Header row with days */}
          <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
            {/* Empty cell for meal section labels */}
            <Box sx={{ width: 50, flexShrink: 0 }}>
              <Box sx={{ height: 40 }} />
            </Box>

            {/* Day headers */}
            {menuDays.map((day) => (
              <Box key={day.id} sx={{ flex: 1, minWidth: 150 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1,
                    textAlign: 'center',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold">
                    {day.name}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Meal sections rows */}
        {recipeSections.map((section) => (
          <Box key={section.id} sx={{ display: 'flex', gap: 1, mt: 1 }}>
            {/* Meal section label */}
            <Box sx={{ width: 50, flexShrink: 0 }}>
              <Paper
                elevation={0}
                sx={{
                  px: 0.5,
                  py: 1,
                  bgcolor: 'secondary.main',
                  color: 'secondary.contrastText',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 80
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight="medium"
                  sx={{
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                    textAlign: 'center',
                    fontSize: '0.75rem'
                  }}
                >
                  {section.name}
                </Typography>
              </Paper>
            </Box>

            {/* Meal slots for each day */}
            {menuDays.map((day) => {
              const slotRecipes = getRecipesForSlot(day.id as TDaysMenu, section.id as TRecipeSection);

              return (
                <Box key={`${day.id}-${section.id}`} sx={{ flex: 1, minWidth: 150 }}>
                  <MealSlot
                    recipes={slotRecipes}
                    day={day.id as TDaysMenu}
                    section={section.id as TRecipeSection}
                    editable={editable}
                    menuPersons={menuPersons}
                    onClick={() => onSlotClick?.(day.id as TDaysMenu, section.id as TRecipeSection)}
                    onRemove={(recipe) => onRecipeRemove?.(recipe, day.id as TDaysMenu, section.id as TRecipeSection)}
                  />
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
