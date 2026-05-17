"use client"
import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, IconButton, Typography } from "@mui/material";
import { AddRounded, AssignmentRounded, CheckRounded, CloseRounded } from "@mui/icons-material";
import { SavedList } from "@/components/Shopping/types";

interface ListSwitcherModalProps {
  lists: SavedList[];
  currentId: string;
  onSelect: (list: SavedList) => void;
  onNewList?: () => void;
  onClose: () => void;
}

export function ListSwitcherModal({ lists, currentId, onSelect, onNewList, onClose }: ListSwitcherModalProps) {
  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          backgroundImage: 'none',
          borderRadius: { xs: '18px 18px 0 0', sm: '16px' },
          m: { xs: 0, sm: 2 },
          mt: { xs: 'auto', sm: 'auto' },
          width: '100%',
        },
      }}
      sx={{ alignItems: { xs: 'flex-end', sm: 'center' } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">Mis listas</Typography>
        <IconButton onClick={onClose} aria-label="Cerrar" size="small" sx={{ color: 'text.secondary' }}>
          <CloseRounded />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        {lists.map((list, i) => (
          <Box key={list.id}>
            <Box
              onClick={() => { onSelect(list); onClose(); }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                py: 1.5,
                cursor: 'pointer',
                borderRadius: 1,
                px: 0.5,
                mx: -0.5,
                transition: 'background 0.12s',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <AssignmentRounded sx={{ color: 'primary.main', fontSize: 22, flexShrink: 0 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={500}>{list.name}</Typography>
                <Typography variant="caption" color="text.secondary">{list.itemCount} recetas</Typography>
              </Box>
              {list.id === currentId && <CheckRounded sx={{ color: 'primary.main' }} />}
            </Box>
            {i < lists.length - 1 && <Divider />}
          </Box>
        ))}

        <Button
          fullWidth
          variant="outlined"
          startIcon={<AddRounded />}
          onClick={() => { onNewList?.(); onClose(); }}
          sx={{
            mt: 1.75,
            borderStyle: 'dashed',
            color: 'primary.main',
            borderColor: 'divider',
            textTransform: 'none',
            '&:hover': { bgcolor: 'rgba(124,179,66,0.08)', borderStyle: 'dashed' },
          }}
        >
          Nueva lista
        </Button>
      </DialogContent>
    </Dialog>
  );
}
