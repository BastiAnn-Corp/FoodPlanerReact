import React from "react";
import {Button, Container, Grid2, Typography} from "@mui/material";
import {AddCircle} from "@mui/icons-material";

export default function Recipes() {

  return (<Container maxWidth={"md"}>
    <Grid2 container spacing={2} paddingTop={5} justifyContent={"space-between"}>
      <Grid2 size={4}>
        <Typography variant={"h3"}> Recipes! </Typography>
      </Grid2>
      <Grid2 size={4}>
        <Button
          color={"secondary"}
          variant={"contained"}
          startIcon={<AddCircle/>}
          size={"large"}
          fullWidth
          href={'/recipes/create'}
        >Agregar receta</Button>
      </Grid2>
    </Grid2>
  </Container>);
}