import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid
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
  // Find recipe for a specific day and section
  const getRecipeForSlot = (day: TDaysMenu, section: TRecipeSection): IMenuRecipe | undefined => {
    return recipes.find(r =>
      r.days?.includes(day) && r.section === section
    );
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Calendario Semanal
      </Typography>

      <Box sx={{ overflowX: 'auto' }}>
        <Grid container spacing={1} sx={{ minWidth: 800 }}>
          {/* Header row with days */}
          <Grid item xs={12}>
            <Grid container spacing={1}>
              {/* Empty cell for meal section labels */}
              <Grid item xs={12} sm={1.5}>
                <Box sx={{ height: 40 }} />
              </Grid>

              {/* Day headers */}
              {menuDays.map((day) => (
                <Grid item xs={12} sm={1.5} key={day.id}>
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
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Meal sections rows */}
          {recipeSections.map((section) => (
            <Grid item xs={12} key={section.id}>
              <Grid container spacing={1}>
                {/* Meal section label */}
                <Grid item xs={12} sm={1.5}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1,
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
                        writingMode: { xs: 'horizontal-tb', sm: 'vertical-rl' },
                        transform: { xs: 'none', sm: 'rotate(180deg)' },
                        textAlign: 'center'
                      }}
                    >
                      {section.name}
                    </Typography>
                  </Paper>
                </Grid>

                {/* Meal slots for each day */}
                {menuDays.map((day) => {
                  const recipe = getRecipeForSlot(day.id as TDaysMenu, section.id as TRecipeSection);

                  return (
                    <Grid item xs={12} sm={1.5} key={`${day.id}-${section.id}`}>
                      <MealSlot
                        recipe={recipe}
                        day={day.id as TDaysMenu}
                        section={section.id as TRecipeSection}
                        editable={editable}
                        menuPersons={menuPersons}
                        onClick={() => onSlotClick?.(day.id as TDaysMenu, section.id as TRecipeSection)}
                        onRemove={recipe ? () => onRecipeRemove?.(recipe, day.id as TDaysMenu, section.id as TRecipeSection) : undefined}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
}
