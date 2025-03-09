"use client"
import { ThemeProvider } from '@mui/material/styles';
import {theme} from "@/styles/theme";


export function StyledRoot({
                             children,
                           }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}