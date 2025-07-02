"use client"
import "./globals.css";

import {AppRouterCacheProvider} from "@mui/material-nextjs/v13-appRouter";
import { StyledRoot } from './StyledRoot';
import { Base } from "@/components/Base";

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
        <StyledRoot>
          <Base>{children}</Base>
        </StyledRoot>
      </AppRouterCacheProvider>
      </body>
    </html>

  );
}
