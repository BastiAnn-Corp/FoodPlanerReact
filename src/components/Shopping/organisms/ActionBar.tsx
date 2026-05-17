"use client"
import { Box, Button, Tooltip } from "@mui/material";
import { ContentCopyRounded, IosShareRounded, SaveRounded, SortRounded } from "@mui/icons-material";
import { SortMode } from "@/components/Shopping/types";

interface ActionBarProps {
  sortMode: SortMode;
  onSortChange: (mode: SortMode) => void;
  canShare: boolean;
  onShare: () => void;
  onCopy: () => void;
  canSave?: boolean;
  onSave?: () => void;
  sticky?: boolean;
}

export function ActionBar({ sortMode, onSortChange, canShare, onShare, onCopy, canSave, onSave, sticky = true }: ActionBarProps) {
  return (
    <Box
      sx={{
        position: sticky ? 'sticky' : 'static',
        top: sticky ? { xs: '56px', sm: '64px' } : undefined,
        zIndex: sticky ? 50 : undefined,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        px: 1.25,
        py: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
      }}
    >
      <Button
        variant="outlined"
        size="small"
        startIcon={<SortRounded sx={{ fontSize: 16 }} />}
        onClick={() => onSortChange(sortMode === 'aisle' ? 'alpha' : 'aisle')}
        sx={{
          textTransform: 'none',
          fontSize: '0.8125rem',
          borderColor: 'divider',
          color: 'text.primary',
          bgcolor: 'action.hover',
          '&:hover': { bgcolor: 'action.selected', borderColor: 'divider' },
        }}
      >
        {sortMode === 'aisle' ? 'Por pasillo' : 'Alfabético'}
      </Button>

      <Box sx={{ ml: 'auto', display: 'flex', gap: 0.25, alignItems: 'center' }}>
        {canSave && (
          <Button
            size="small"
            variant="contained"
            startIcon={<SaveRounded sx={{ fontSize: 16 }} />}
            onClick={onSave}
            sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 600 }}
          >
            Guardar
          </Button>
        )}
        <Button
          size="small"
          startIcon={<ContentCopyRounded sx={{ fontSize: 16 }} />}
          onClick={onCopy}
          sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 500, color: 'text.secondary' }}
        >
          Copiar
        </Button>

        <Tooltip
          title={canShare ? '' : 'Inicia sesión para compartir'}
          placement="bottom-end"
        >
          <span>
            <Button
              size="small"
              startIcon={<IosShareRounded sx={{ fontSize: 16 }} />}
              onClick={canShare ? onShare : undefined}
              disabled={!canShare}
              sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 500, color: 'text.secondary' }}
            >
              Compartir
            </Button>
          </span>
        </Tooltip>
      </Box>

    </Box>
  );
}
