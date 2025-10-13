"use client"
import React, {useEffect, useState} from 'react';
import {
  Typography,
  Container,
  Paper,
  Box,
  Button,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  RestaurantMenuRounded,
  AddCircleRounded
} from '@mui/icons-material';
import {IMenu} from '@/util/models';
import {getMenus, deleteMenu} from '@/lib/firebase/menus';
import {MenuCard} from '@/components/Menu/MenuCard';
import {MenuFilters} from '@/components/Menu/MenuFilters';
import {envVars} from '@/util/config';
import {TSeasons} from '@/util/constants';

export default function MenusPage() {
  const [menus, setMenus] = useState<IMenu[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(false);

  // Filter states
  const [searchText, setSearchText] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [showPublicOnly, setShowPublicOnly] = useState(false);

  // Load menus on mount and refresh
  useEffect(() => {
    loadMenus();
  }, [refresh, showPublicOnly, selectedSeason]);

  async function loadMenus() {
    setIsLoading(true);
    setError(null);
    try {
      const filters: {season?: TSeasons; publicOnly?: boolean} = {};

      if (selectedSeason) {
        filters.season = selectedSeason as TSeasons;
      }

      if (showPublicOnly) {
        filters.publicOnly = true;
      }

      const response = await getMenus(filters);
      setMenus(response);
      console.debug(`Found ${response.length} menus`);
    } catch (err) {
      console.error('Error loading menus:', err);
      setError('Error al cargar los menús');
    } finally {
      setIsLoading(false);
    }
  }

  // Client-side filtering for search text
  function filterBySearch(menu: IMenu): boolean {
    if (!searchText) return true;

    const searchLower = searchText.toLowerCase();
    const inNotes = menu.notes?.toLowerCase().includes(searchLower);
    const inId = menu.id?.toLowerCase().includes(searchLower);

    return inNotes || inId || false;
  }

  async function handleDelete(menuId: string | undefined) {
    if (!menuId) return;

    const confirmed = confirm('¿Estás seguro de que quieres eliminar este menú?');
    if (!confirmed) return;

    try {
      const result = await deleteMenu(menuId);
      console.log(result);
      setRefresh(!refresh); // Trigger reload
    } catch (err) {
      console.error('Error deleting menu:', err);
      alert('Error al eliminar el menú');
    }
  }

  const filteredMenus = menus.filter(filterBySearch);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 2, mb: 4 }}>
        {/* Header Section */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <RestaurantMenuRounded sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h3" component="h1" fontWeight="bold">
                  Mis Menús
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Planifica tus comidas semanales
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddCircleRounded />}
              href={`${envVars.baseURL}/menus/create`}
              sx={{
                bgcolor: 'white',
                color: '#667eea',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)'
                }
              }}
            >
              Crear Menú
            </Button>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {/* Filters Sidebar */}
          <Grid item xs={12} md={3}>
            <MenuFilters
              searchText={searchText}
              onSearchChange={setSearchText}
              selectedSeason={selectedSeason}
              onSeasonChange={setSelectedSeason}
              showPublicOnly={showPublicOnly}
              onPublicToggle={setShowPublicOnly}
            />
          </Grid>

          {/* Menu Cards Grid */}
          <Grid item xs={12} md={9}>
            {/* Loading State */}
            {isLoading && (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <CircularProgress />
              </Box>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredMenus.length === 0 && (
              <Paper
                elevation={2}
                sx={{
                  p: 6,
                  textAlign: 'center',
                  bgcolor: 'background.default'
                }}
              >
                <RestaurantMenuRounded sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No hay menús disponibles
                </Typography>
                <Typography variant="body2" color="text.disabled" mb={3}>
                  {menus.length === 0
                    ? 'Crea tu primer menú para comenzar a planificar tus comidas'
                    : 'No se encontraron menús con los filtros seleccionados'}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddCircleRounded />}
                  href={`${envVars.baseURL}/menus/create`}
                >
                  Crear Primer Menú
                </Button>
              </Paper>
            )}

            {/* Menu Cards */}
            {!isLoading && !error && filteredMenus.length > 0 && (
              <>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Mostrando {filteredMenus.length} menú{filteredMenus.length !== 1 ? 's' : ''}
                </Typography>
                <Grid container spacing={2}>
                  {filteredMenus.map((menu, index) => (
                    <Grid item xs={12} sm={6} md={4} key={menu.id || index}>
                      <MenuCard
                        menu={menu}
                        onDelete={() => handleDelete(menu.id)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
