"use client"
import { Box, Typography } from "@mui/material";
import { CheckboxControl } from "@/components/Shopping/atoms/CheckboxControl";
import { ShoppingIngredient } from "@/components/Shopping/types";

interface IngredientItemProps {
  item: ShoppingIngredient;
  onToggle: (id: string) => void;
}

export function IngredientItem({ item, onToggle }: IngredientItemProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        pl: 0.75,
        pr: 2,
        py: 0.5,
        borderTop: '1px solid',
        borderColor: 'divider',
        opacity: item.checked ? 0.38 : 1,
        transition: 'opacity 0.25s',
      }}
    >
      <CheckboxControl
        checked={item.checked}
        onChange={() => onToggle(item.id)}
        ariaLabel={`Marcar ${item.name}`}
      />
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="body1"
          sx={{
            textDecoration: item.checked ? 'line-through' : 'none',
            color: item.checked ? 'text.secondary' : 'text.primary',
          }}
        >
          {item.name}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.125, display: 'block' }}>
          {item.qty}
        </Typography>
      </Box>
    </Box>
  );
}
