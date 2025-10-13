import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Tooltip,
  Stack
} from '@mui/material';
import {
  AddCircleOutlineRounded,
  CloseRounded,
  WarningRounded
} from '@mui/icons-material';
import {IMenuRecipe} from '@/util/models';
import {TDaysMenu, TRecipeSection, foodFamilies} from '@/util/constants';

interface MealSlotProps {
  recipes?: IMenuRecipe[];  // Changed to array
  day: TDaysMenu;
  section: TRecipeSection;
  editable: boolean;
  menuPersons: number;
  onClick?: () => void;
  onRemove?: (recipe: IMenuRecipe) => void;
}

export function MealSlot({
  recipes = [],
  day,
  section,
  editable,
  menuPersons,
  onClick,
  onRemove
}: MealSlotProps) {
  const getFamilyIcon = (familyId: string) => {
    const family = foodFamilies.find(f => f.id === familyId);
    return family?.icon || '🍽️';
  };

  // Empty slot
  if (!recipes || recipes.length === 0) {
    return (
      <Card
        sx={{
          minHeight: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          border: '2px dashed',
          borderColor: 'divider',
          cursor: editable ? 'pointer' : 'default',
          transition: 'all 0.2s',
          '&:hover': editable ? {
            borderColor: 'primary.main',
            bgcolor: 'action.hover'
          } : {}
        }}
        onClick={editable ? onClick : undefined}
      >
        <CardContent>
          {editable ? (
            <Box display="flex" flexDirection="column" alignItems="center">
              <AddCircleOutlineRounded color="action" />
              <Typography variant="caption" color="text.secondary" mt={0.5}>
                Agregar
              </Typography>
            </Box>
          ) : (
            <Typography variant="caption" color="text.disabled">
              Sin asignar
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  }

  // Filled slot with one or more recipes
  return (
    <Card
      sx={{
        minHeight: 80,
        position: 'relative',
        cursor: editable ? 'pointer' : 'default',
        transition: 'all 0.2s',
        '&:hover': {
          transform: editable ? 'translateY(-2px)' : 'none',
          boxShadow: editable ? 2 : 1
        }
      }}
    >
      <CardContent sx={{ px: 1, py: 1, '&:last-child': { pb: 1 } }}>
        <Stack spacing={1}>
          {recipes.map((recipe, index) => {
            const hasPortionMismatch = recipe.portions !== menuPersons;

            return (
              <Box
                key={`${recipe.id}-${index}`}
                sx={{
                  position: 'relative',
                  pl: editable ? 1.5 : 0,
                  pr: editable ? 0.5 : 0,
                  borderLeft: recipes.length > 1 ? '2px solid' : 'none',
                  borderColor: 'divider',
                  pb: index < recipes.length - 1 ? 1 : 0,
                }}
                onClick={editable ? onClick : undefined}
              >
                {editable && onRemove && (
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      zIndex: 1,
                      bgcolor: 'background.paper',
                      width: 20,
                      height: 20,
                      '&:hover': {
                        bgcolor: 'error.light',
                        color: 'error.contrastText'
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(recipe);
                    }}
                  >
                    <CloseRounded sx={{ fontSize: 14 }} />
                  </IconButton>
                )}

                <Box display="flex" alignItems="start" gap={0.5}>
                  <Typography sx={{ fontSize: '1.2rem' }}>
                    {getFamilyIcon(recipe.family)}
                  </Typography>
                  <Box flexGrow={1}>
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        fontSize: recipes.length > 1 ? '0.75rem' : '0.875rem'
                      }}
                    >
                      {recipe.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: recipes.length > 1 ? '0.65rem' : '0.75rem' }}
                    >
                      {recipe.portions} porción{recipe.portions !== 1 ? 'es' : ''}
                    </Typography>

                    {hasPortionMismatch && (
                      <Tooltip title={`Esta receta es para ${recipe.portions} ${recipe.portions === 1 ? 'persona' : 'personas'}, tu menú es para ${menuPersons}`}>
                        <Chip
                          icon={<WarningRounded />}
                          label="Ajustar"
                          size="small"
                          color="warning"
                          sx={{
                            mt: 0.5,
                            fontSize: '0.6rem',
                            height: 16,
                            '& .MuiChip-icon': { fontSize: 12 }
                          }}
                        />
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Stack>

        {/* Add more recipes button */}
        {editable && recipes.length > 0 && (
          <Box
            sx={{
              mt: 1,
              pt: 1,
              borderTop: '1px dashed',
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Chip
              icon={<AddCircleOutlineRounded />}
              label="Agregar más"
              size="small"
              variant="outlined"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
              sx={{ fontSize: '0.7rem', height: 20 }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
