"use client"
import {Button, ButtonGroup, ButtonProps} from "@mui/material";
import { useState} from "react";
import {DeleteRounded} from "@mui/icons-material";

interface DeleteButtonProps extends ButtonProps {
  deleteAction: () => void;
  refresh: () => void;
}

export function DeleteButton(props: DeleteButtonProps) {
  const [firstChecked, setFirstChecked] = useState(false);

  return !firstChecked ? <Button {...props} startIcon={<DeleteRounded/>} onClick={() => setFirstChecked(!firstChecked)} color={'inherit'} fullWidth>Eliminar</Button>
    : <ButtonGroup size={props.size} variant={"contained"} fullWidth>
      <Button onClick={props.deleteAction} color={"error"}>Sí</Button>
      <Button onClick={() => setFirstChecked(false)} color={'inherit'}>No</Button>
    </ButtonGroup>
}