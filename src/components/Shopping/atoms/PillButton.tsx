"use client"
import { Button, ButtonProps } from "@mui/material";
import React from "react";

export function PillButton({ children, sx, ...props }: ButtonProps) {
  return (
    <Button
      variant="outlined"
      size="small"
      sx={{
        borderRadius: '20px',
        textTransform: 'none',
        fontSize: '0.8125rem',
        color: 'text.primary',
        borderColor: 'divider',
        bgcolor: 'action.hover',
        minWidth: 0,
        px: 1.5,
        py: 0.625,
        gap: 0.5,
        '&:hover': { bgcolor: 'action.selected', borderColor: 'divider' },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
