import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Tooltip
} from '@mui/material';
import {
  AddCircleOutlineRounded,
  CloseRounded,
  WarningRounded
} from '@mui/icons-material';
import {IMenuRecipe} from '@/util/models';
import {TDaysMenu, TRecipeSection, foodFamilies} from '@/util/constants';

interface MealSlotProps {
  recipe?: IMenuRecipe;
  day: TDaysMenu;
  section: TRecipeSection;
  editable: boolean;
  menuPersons: number;
  onClick?: () => void;
  onRemove?: () => void;
}

export function MealSlot({
  recipe,
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

  const hasPortionMismatch = recipe && recipe.portions !== menuPersons;

  // Empty slot
  if (!recipe) {
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

  // Filled slot
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
      onClick={editable ? onClick : undefined}
    >
      {editable && onRemove && (
        <IconButton
          size="small"
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            zIndex: 1,
            bgcolor: 'background.paper',
            '&:hover': {
              bgcolor: 'error.light',
              color: 'error.contrastText'
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <CloseRounded fontSize="small" />
        </IconButton>
      )}

      <CardContent sx={{ pb: 1, '&:last-child': { pb: 1 } }}>
        <Box display="flex" alignItems="start" gap={1}>
          <Typography sx={{ fontSize: '1.5rem' }}>
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
              }}
            >
              {recipe.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {recipe.portions} porción{recipe.portions !== 1 ? 'es' : ''}
            </Typography>
          </Box>
        </Box>

        {hasPortionMismatch && (
          <Tooltip title={`Esta receta es para ${recipe.portions} ${recipe.portions === 1 ? 'persona' : 'personas'}, tu menú es para ${menuPersons}`}>
            <Chip
              icon={<WarningRounded />}
              label="Ajustar porciones"
              size="small"
              color="warning"
              sx={{ mt: 1, fontSize: '0.65rem', height: 20 }}
            />
          </Tooltip>
        )}
      </CardContent>
    </Card>
  );
}
