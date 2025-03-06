import {createTheme} from "@mui/material";

export const darkTheme = createTheme({
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