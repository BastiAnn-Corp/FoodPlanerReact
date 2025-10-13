"use client"
import React from 'react';
import { 
  Typography, 
  Container, 
  Paper, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  RestaurantMenuRounded,
  CalendarTodayRounded,
  ShoppingCartRounded,
  ShareRounded,
  PublicRounded,
  AutoAwesomeRounded
} from '@mui/icons-material';

export default function MenusPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 2, mb: 4 }}>
        {/* Header Section */}
        <Paper elevation={3} sx={{ p: 4, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Box display="flex" alignItems="center" mb={2}>
            <RestaurantMenuRounded sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h3" component="h1" fontWeight="bold">
              Mis Menús
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Planifica tus comidas semanales asignando recetas a días y horarios
          </Typography>
        </Paper>

        {/* Under Construction Notice */}
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderLeft: '4px solid #ff9800' }}>
          <Typography variant="h5" gutterBottom color="warning.main" fontWeight="bold">
            🚧 Funcionalidad en Desarrollo
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Esta sección está siendo desarrollada como parte de la versión 1.0.0. 
            ¡Muy pronto podrás crear y gestionar tus menús semanales!
          </Typography>
        </Paper>

        {/* Feature Preview Grid */}
        <Grid container spacing={3}>
          {/* Menu Planning Feature */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <CalendarTodayRounded color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" color="primary">
                    Planificación Semanal
                  </Typography>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <AutoAwesomeRounded fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Calendario semanal" 
                      secondary="Organiza comidas por día de la semana"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AutoAwesomeRounded fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Asignación de recetas" 
                      secondary="Desayuno, Almuerzo, Cena para cada día"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AutoAwesomeRounded fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Cálculo de porciones" 
                      secondary="Ajusta automáticamente según personas"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Menu Management Feature */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <RestaurantMenuRounded color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="h6" color="secondary">
                    Gestión de Menús
                  </Typography>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <AutoAwesomeRounded fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Múltiples menús" 
                      secondary="Crea diferentes planificaciones"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AutoAwesomeRounded fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Filtros por estación" 
                      secondary="Menús de verano, invierno, etc."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AutoAwesomeRounded fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Notas personalizadas" 
                      secondary="Agrega comentarios a tus menús"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Sharing Feature */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <ShareRounded color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6" color="success.main">
                    Compartir Menús
                  </Typography>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <AutoAwesomeRounded fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Comparte con familia" 
                      secondary="Invita colaboradores a editar"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AutoAwesomeRounded fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Enlaces de solo lectura" 
                      secondary="Comparte menús sin permisos de edición"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AutoAwesomeRounded fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Control de privacidad" 
                      secondary="Menús públicos o privados"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Public Menus Feature */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <PublicRounded color="info" sx={{ mr: 1 }} />
                  <Typography variant="h6" color="info.main">
                    Menús Públicos
                  </Typography>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <AutoAwesomeRounded fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Explora menús de la comunidad" 
                      secondary="Descubre nuevas ideas de planificación"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AutoAwesomeRounded fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Usa como plantilla" 
                      secondary="Copia menús públicos y personalízalos"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AutoAwesomeRounded fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Comparte tus creaciones" 
                      secondary="Haz públicos tus mejores menús"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Call to Action */}
        <Paper elevation={2} sx={{ p: 3, mt: 4, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6" gutterBottom>
            ¿Quieres ser notificado cuando esté listo?
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Mientras tanto, puedes seguir creando recetas increíbles que podrás usar en tus futuros menús.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            href="/recipes"
            startIcon={<RestaurantMenuRounded />}
          >
            Explorar Recetas
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
