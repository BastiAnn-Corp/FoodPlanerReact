import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  Tooltip
} from '@mui/material';
import {
  EditRounded,
  DeleteRounded,
  VisibilityRounded,
  PublicRounded,
  LockRounded,
  PeopleRounded,
  RestaurantMenuRounded
} from '@mui/icons-material';
import {IMenu} from '@/util/models';
import {seasons} from '@/util/constants';
import {envVars} from '@/util/config';

interface MenuCardProps {
  menu: IMenu;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

export function MenuCard({menu, onEdit, onDelete, onView}: MenuCardProps) {
  const getSeasonColor = (seasonKey: string) => {
    const season = seasons.find(s => s.key === seasonKey);
    return season?.color || 'default';
  };

  const getSeasonName = (seasonKey: string) => {
    const season = seasons.find(s => s.key === seasonKey);
    return season?.name || seasonKey;
  };

  const recipeCount = menu.recipes?.length || 0;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Header with privacy indicator */}
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
            {menu.name || menu.id || 'Menú'}
          </Typography>
          <Tooltip title={menu.public ? 'Menú público' : 'Menú privado'}>
            {menu.public ? (
              <PublicRounded color="success" fontSize="small" />
            ) : (
              <LockRounded color="action" fontSize="small" />
            )}
          </Tooltip>
        </Box>

        {/* Persons */}
        <Box display="flex" alignItems="center" mb={1}>
          <PeopleRounded fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {menu.persons} {menu.persons === 1 ? 'persona' : 'personas'}
          </Typography>
        </Box>

        {/* Recipe count */}
        <Box display="flex" alignItems="center" mb={2}>
          <RestaurantMenuRounded fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {recipeCount} {recipeCount === 1 ? 'receta' : 'recetas'}
          </Typography>
        </Box>

        {/* Seasons */}
        <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
          {menu.seasons?.map((seasonKey, index) => (
            <Chip
              key={`${seasonKey}-${index}`}
              label={getSeasonName(seasonKey)}
              size="small"
              color={getSeasonColor(seasonKey) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
              sx={{ fontSize: '0.75rem' }}
            />
          ))}
        </Box>

        {/* Notes preview */}
        {menu.notes && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {menu.notes}
          </Typography>
        )}

        {/* Creator info */}
        {menu.creator && (
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ display: 'block', mt: 1 }}
          >
            Por: {menu.creator}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button
          size="small"
          startIcon={<VisibilityRounded />}
          onClick={onView}
          href={menu.id ? `${envVars.baseURL}/menus/${menu.id}` : undefined}
        >
          Ver
        </Button>
        <Box>
          {onEdit && menu.id && (
            <Tooltip title="Editar menú">
              <IconButton
                size="small"
                color="primary"
                component="a"
                href={`${envVars.baseURL}/menus/${menu.id}/edit`}
              >
                <EditRounded fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Eliminar menú">
              <IconButton
                size="small"
                color="error"
                onClick={onDelete}
              >
                <DeleteRounded fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardActions>
    </Card>
  );
}
