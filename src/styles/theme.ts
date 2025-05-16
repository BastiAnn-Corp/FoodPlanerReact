"use client"
import {createTheme} from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      light: '#9ccc65',
      main: '#7cb342',
      dark: '#558b2f',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ffb300',
      main: '#ff8f00',
      dark: '#ff6f00',
      contrastText: '#fff',
    },
    success: {
      light: '#348C5D',
      main: '#1D7546',
      dark: '#07582D',
      contrastText: '#fff',
    },
    error: {
      light: '#C66549',
      main: '#A64529',
      dark: '#7D250B',
      contrastText: '#fff',
    },
    warning: {
      light: '#E1CD6F',
      main: '#B9A440',
      dark: '#937F1D',
      contrastText: '#fff',
    },
    info: {
      light: '#00BCD4',
      main: '#008395',
      dark: '#006775',
      contrastText: '#fff',
    }
  },
});