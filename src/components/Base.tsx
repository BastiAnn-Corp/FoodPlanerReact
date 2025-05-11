"use client"
import {
  AppBar,
  BottomNavigation, BottomNavigationAction,
  Box,
  Button,
  Container,
  CssBaseline,
  IconButton, Paper,
  Toolbar, useMediaQuery, useTheme
} from "@mui/material";
import React from "react";
import {MenuBookRounded,RestaurantMenuRounded, ShoppingCartRounded} from "@mui/icons-material";
import {baseURL} from "@/util/constants";


const pages = [
  {
    name: "Ingredientes",
    route: baseURL + "/ingredients",
    icon: ""
  },
  {
    name: "Recetas",
    route: baseURL + "/recipes",
    icon: ""
  },
  {
    name: "Menús",
    route: baseURL + "/menus",
    icon: ""
  },
]

interface BaseProps {
  children?: React.ReactNode;
}
export function Base({children}: BaseProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.up('sm'));
  return <React.Fragment>
    <CssBaseline />
    <AppBar color="primary" enableColorOnDark>
      <Toolbar variant="dense">
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <RestaurantMenuRounded />
        </IconButton>
        <Button
          href={baseURL}
          size={"large"}
          color={"inherit"}
          variant={"text"}
        >
          OpenCOOK
        </Button>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          {pages.map(({name,route}) => (
            <Button
              key={name}
              href={route}
              variant={"text"}
            >{name}</Button>
          ))}
        </Box>
      </Toolbar>
  </AppBar>
    <Toolbar />
    <Container>
      {children}
    </Container>
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={4}>
      <BottomNavigation showLabels>
        <BottomNavigationAction label="Ingredientes" icon={<ShoppingCartRounded color={"action"}/>} href={baseURL + '/ingredients'} />
        <BottomNavigationAction label="Recetas" icon={<MenuBookRounded color={"action"}/>} href={baseURL + '/recipes'}/>
        <BottomNavigationAction label="Menús" icon={<RestaurantMenuRounded />} disabled/>
      </BottomNavigation>
    </Paper>
  </React.Fragment>
}