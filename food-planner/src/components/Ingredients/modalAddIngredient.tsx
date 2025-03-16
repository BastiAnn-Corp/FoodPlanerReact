import { Divider, Grid2, Modal, Paper, Typography} from "@mui/material";
import React from "react";

interface ModalAddIngredientProps {
  isOpen: boolean;
  handleClose: () => void;
}

export function ModalAddIngredient({ isOpen, handleClose }: ModalAddIngredientProps) {
  return <Modal open={isOpen} onClose={handleClose}>
    <Paper style={{padding:5, maxWidth: 600}}>
      <Typography variant={"h6"}> Agregar nuevo ingrediente </Typography>
      <Divider/>
      <Grid2 container>
        <Grid2>
          <Typography></Typography>
        </Grid2>
      </Grid2>
    </Paper>
  </Modal>
}