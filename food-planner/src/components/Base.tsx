"use client"
import {AppBar, Box, Button, Container, CssBaseline, Toolbar, Typography} from "@mui/material";
import React from "react";


const pages = [
  {
    name: "Ingredientes",
    route: "/ingredients",
    icon: ""
  },
  {
    name: "Recetas",
    route: "/recipes",
    icon: ""
  },
  {
    name: "Menús",
    route: "/menus",
    icon: ""
  },
]

interface BaseProps {
  children?: React.ReactNode;
}
export function Base({children}: BaseProps) {

  return <React.Fragment>
    <CssBaseline />
    <AppBar>
      <Toolbar>
        <Button
          href={'/'}
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
    <Container maxWidth={"md"} style={{paddingTop: 5}}>
      {children}
    </Container>
  </React.Fragment>
}