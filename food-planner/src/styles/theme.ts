"use client"
import { Roboto } from 'next/font/google';
import {createTheme} from "@mui/material/styles";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
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
  },
});