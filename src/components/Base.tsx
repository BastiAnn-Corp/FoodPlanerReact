"use client"
import {
  AppBar,
  BottomNavigation, BottomNavigationAction,
  Container,
  CssBaseline,
  IconButton, Menu, MenuItem, Paper,
  Toolbar, Typography, useMediaQuery, useTheme
} from "@mui/material";
import React, {useState} from "react";
import {
  Apple, AssignmentRounded,
  MenuBookRounded,
  MenuRounded,
  RestaurantMenuRounded,
  ShoppingCartRounded
} from "@mui/icons-material";

import {UserNameButton} from "@/components/Auth/UserNameButton";
import Link from "next/link";
import {envVars} from "@/util/config";


const pages = [
  {
    name: "Recetas",
    route: "/recipes",
    icon: <MenuBookRounded/>,
    enabled: true,
    inBottomBar: true,
  },
  {
    name: "Menús",
    route: "/menus",
    icon: <RestaurantMenuRounded/>,
    enabled: false,
    inBottomBar: true,
  },{
    name: "Ingredientes",
    route: "/ingredients",
    icon: <Apple/>,
    enabled: false,
    inBottomBar: false,
  },
  {
    name: "Mi lista",
    route: "/shopping",
    icon: <ShoppingCartRounded/>,
    enabled: false,
    inBottomBar: false,
  },
  {
    name: "Sobre la app",
    route: "/plan",
    icon: <AssignmentRounded/>,
    enabled: true,
    inBottomBar: false,
  },
]

interface BaseProps {
  children?: React.ReactNode;
}
export function Base({children}: BaseProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true)
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false)
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.up('sm'));
  return <React.Fragment>
    <CssBaseline />
    <AppBar color="primary" enableColorOnDark>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <MenuRounded />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          {pages.map(({name,icon,route,enabled}) => {
            return <MenuItem
              key={`top-menu-${name.toLowerCase()}`}
              disabled={!enabled}
            ><Link href={route}>{icon} {` ${name}`}</Link></MenuItem>
          })}
        </Menu>
        <Typography component="div" sx={{ flexGrow: 1 }}>
          <RestaurantMenuRounded/> OpenCOOK
        </Typography>
        <UserNameButton variant={"contained"} color={"warning"}/>
      </Toolbar>
    </AppBar>
    <Toolbar />
    <Container>
      {children}
    </Container>
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={6}>
      <BottomNavigation showLabels>
        {pages.filter(({enabled, inBottomBar})=> enabled && inBottomBar).map(({name,icon,route})=>{
          return <BottomNavigationAction
            key={`bottom-menu-${name.toLowerCase()}`}
            label={name}
            icon={icon}
            href={envVars.baseURL + route}/>
        })}
      </BottomNavigation>
    </Paper>
  </React.Fragment>
}