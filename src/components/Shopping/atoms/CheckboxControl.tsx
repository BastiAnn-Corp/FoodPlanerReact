"use client"
import { Box, ButtonBase } from "@mui/material";
import { CheckRounded } from "@mui/icons-material";

interface CheckboxControlProps {
  checked: boolean;
  onChange: () => void;
  ariaLabel?: string;
}

export function CheckboxControl({ checked, onChange, ariaLabel }: CheckboxControlProps) {
  return (
    <ButtonBase
      onClick={onChange}
      aria-label={ariaLabel}
      sx={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        flexShrink: 0,
        '&:hover': { bgcolor: 'rgba(124,179,66,0.08)' },
      }}
    >
      <Box
        sx={{
          width: 20,
          height: 20,
          borderRadius: '3px',
          border: 2,
          borderColor: checked ? 'primary.main' : 'text.disabled',
          bgcolor: checked ? 'primary.main' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.18s, border-color 0.18s',
        }}
      >
        {checked && <CheckRounded sx={{ fontSize: 13, color: '#fff' }} />}
      </Box>
    </ButtonBase>
  );
}
