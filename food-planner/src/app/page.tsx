import React from "react";
import {Button, Container} from "@mui/material";
import {AutoStoriesRounded} from "@mui/icons-material";

export default function Home() {
  return (
    <Container maxWidth={"md"}>
      <Button
        startIcon={<AutoStoriesRounded/>}
        href={"/recipes"}
        size={"large"}
        variant={"contained"}
      >
        Lista de recetas
      </Button>
    </Container>
    );
}
