"use client"
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material";
import { ExpandMoreRounded } from "@mui/icons-material";
import { IngredientItem } from "@/components/Shopping/molecules/IngredientItem";
import { ShoppingAisle } from "@/components/Shopping/types";

interface AisleGroupProps {
  aisle: ShoppingAisle;
  onToggle: (id: string) => void;
}

export function AisleGroup({ aisle, onToggle }: AisleGroupProps) {
  const done = aisle.items.filter(i => i.checked).length;
  const total = aisle.items.length;
  const allDone = done === total;

  return (
    <Accordion
      defaultExpanded
      disableGutters
      elevation={0}
      square
      sx={{
        bgcolor: 'transparent',
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreRounded sx={{ fontSize: 20, color: 'text.disabled' }} />}
        sx={{
          px: 2,
          py: 0,
          minHeight: 44,
          '&.Mui-expanded': { minHeight: 44 },
          '& .MuiAccordionSummary-content': { my: 0, gap: 1.25, alignItems: 'center' },
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        <Typography component="span" sx={{ fontSize: '1.125rem' }}>{aisle.icon}</Typography>
        <Typography
          variant="overline"
          sx={{
            flex: 1,
            fontSize: '0.6875rem',
            letterSpacing: '1px',
            color: allDone ? 'primary.main' : 'text.secondary',
            lineHeight: 1,
          }}
        >
          {aisle.name}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: allDone ? 'primary.main' : 'text.disabled', mr: 0.5 }}
        >
          {done}/{total}
        </Typography>
      </AccordionSummary>

      <AccordionDetails sx={{ p: 0 }}>
        {aisle.items.map(item => (
          <IngredientItem key={item.id} item={item} onToggle={onToggle} />
        ))}
      </AccordionDetails>
    </Accordion>
  );
}
