"use client"
import "./globals.css";

import {AppRouterCacheProvider} from "@mui/material-nextjs/v13-appRouter";
import { StyledRoot } from './StyledRoot';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
      <AppRouterCacheProvider>
        <StyledRoot>{children}</StyledRoot>
      </AppRouterCacheProvider>
      </body>
    </html>

  );
}
