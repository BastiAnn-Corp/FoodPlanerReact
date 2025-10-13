import React from 'react';
import {
  Box,
  TextField,
  Chip,
  Typography,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Paper
} from '@mui/material';
import {SearchRounded, PublicRounded, LockRounded} from '@mui/icons-material';
import {seasons} from '@/util/constants';
import {TSeasons} from '@/util/constants';

interface MenuFiltersProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  selectedSeason: string;
  onSeasonChange: (season: string) => void;
  showPublicOnly: boolean;
  onPublicToggle: (value: boolean) => void;
}

export function MenuFilters({
  searchText,
  onSearchChange,
  selectedSeason,
  onSeasonChange,
  showPublicOnly,
  onPublicToggle
}: MenuFiltersProps) {
  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      {/* Search */}
      <TextField
        placeholder="Buscar por notas..."
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
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

      {/* Season filters */}
      <Box mb={2}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Temporada
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {seasons.map((season) => (
            <Chip
              key={season.key}
              label={season.name}
              onClick={() => onSeasonChange(selectedSeason === season.key ? '' : season.key)}
              color={selectedSeason === season.key ? season.color as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' : 'default'}
              size="small"
            />
          ))}
        </Box>
      </Box>

      {/* Public/Private toggle */}
      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Visibilidad
        </Typography>
        <ToggleButtonGroup
          value={showPublicOnly ? 'public' : 'all'}
          exclusive
          onChange={(e, value) => {
            if (value !== null) {
              onPublicToggle(value === 'public');
            }
          }}
          size="small"
          fullWidth
        >
          <ToggleButton value="all">
            <LockRounded sx={{ mr: 1, fontSize: '1rem' }} />
            Todos
          </ToggleButton>
          <ToggleButton value="public">
            <PublicRounded sx={{ mr: 1, fontSize: '1rem' }} />
            Públicos
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Paper>
  );
}
