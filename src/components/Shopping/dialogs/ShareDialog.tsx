"use client"
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { CheckRounded, CloseRounded, ContentCopyRounded } from "@mui/icons-material";
import { useState } from "react";

interface ShareDialogProps {
  onClose: () => void;
  shareUrl?: string;
}

export function ShareDialog({ onClose, shareUrl = 'https://opencook.app/s/abc123xyz' }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        <Typography variant="h6">Compartir lista</Typography>
        <IconButton onClick={onClose} aria-label="Cerrar" size="small" sx={{ color: 'text.secondary' }}>
          <CloseRounded />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <Box
          sx={{
            bgcolor: 'action.selected',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            px: 1.5,
            py: 1.25,
            fontFamily: 'monospace',
            fontSize: '0.8125rem',
            color: 'text.secondary',
            wordBreak: 'break-all',
            mb: 1,
          }}
        >
          {shareUrl}
        </Box>

        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', lineHeight: 1.4, mb: 2.25 }}>
          Cualquier persona con este enlace puede ver y marcar ingredientes, pero no puede editar la lista.
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={onClose} sx={{ textTransform: 'none' }}>
            Cerrar
          </Button>
          <Button
            variant="contained"
            onClick={handleCopy}
            startIcon={copied ? <CheckRounded sx={{ fontSize: 16 }} /> : <ContentCopyRounded sx={{ fontSize: 16 }} />}
            sx={{ textTransform: 'none' }}
          >
            {copied ? '¡Copiado!' : 'Copiar enlace'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
