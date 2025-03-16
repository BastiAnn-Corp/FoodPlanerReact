import React from "react";
import {Button} from "@mui/material";
import {AutoStoriesRounded, ListAltRounded} from "@mui/icons-material";
import {Base} from "@/components/Base";

export default function Home() {
  return (
    <Base>

      <Button
        startIcon={<AutoStoriesRounded/>}
        href={"/recipes"}
        size={"large"}
        variant={"contained"}
        fullWidth
      >
        Lista de recetas
      </Button>
      <Button
        startIcon={<ListAltRounded/>}
        href={"/ingredients"}
        size={"large"}
        variant={"contained"}
        color={"secondary"}
        fullWidth
      >
        Lista de ingredientes
      </Button>
    </Base>
    );
}
