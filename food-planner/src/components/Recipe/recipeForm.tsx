"use client"
import React, {useEffect, useState} from "react";
import {Button, Divider, Grid2, MenuItem, Select, SelectChangeEvent, TextField, Typography} from "@mui/material";
import {foodFamilies, seasons} from "@/util/constants";
import {IIngredient, IRecipeIngredient, IRecipeStep} from "@/util/models";
import {RecipeIngredients} from "@/components/Recipe/RecipeIngredients";
import { AutoStoriesRounded, ShoppingCartRounded} from "@mui/icons-material";
import {getIngredients} from "@/lib/firebase/ingredients";

export function RecipeForm() {
  const [selectedSeasons, setSelectedSeasons] = React.useState<string[]>([]);
  const [recipeName, setRecipeName] = useState<string>("")
  const [recipeType, setRecipeType] = useState<string>("")
  const [recipePortions, setRecipePortions] = useState<number>(4)

  const [rawIngredients, setRawIngredients] = useState<IIngredient[]>([]);
  const [listOfIngredients, setListOfIngredients] = useState<IRecipeIngredient[]>([])
  const [showIgredients, setShowIgredients] = useState(false)
  const [listOfSteps, setListOfSteps] = useState<IRecipeStep[]>([])
  const [showSteps, setShowSteps] = useState(false)

  useEffect(()=>{
    loadRawIngredients().then()
  }, [])

  async function loadRawIngredients (){
    const result = await getIngredients({})
    setRawIngredients(result)
  }

  const handleType = (event: SelectChangeEvent<string>) => {
    const {
      target: { value },
    } = event;
    setRecipeType(value);
  };

  const handleSeason = (event: SelectChangeEvent<typeof selectedSeasons>) => {
    const {
      target: { value },
    } = event;
    setSelectedSeasons(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (<Grid2 spacing={4} direction={"column"} padding={5} container>
    <Typography variant={"h3"} color={"primary"}>
      Nueva Receta
    </Typography>
    <Grid2>
      <Typography>Nombre de receta</Typography>
      <TextField
        type={"text"}
        variant={"outlined"}
        fullWidth
        value={recipeName}
        onChange={({target})=>{setRecipeName(target.value)}}
      />
    </Grid2>
    <Grid2>
      <Typography>Estaciones</Typography>
      <Select variant={"outlined"}
              fullWidth
              multiple
              value={selectedSeasons}
              onChange={handleSeason}
      >
        {seasons.map(({key, name}) => (
          <MenuItem key={key} value={key}>{name}</MenuItem>
        ))}
      </Select>
    </Grid2>
    <Grid2>
      <Typography>Tipo de receta</Typography>
      <Select variant={"outlined"} fullWidth
              value={recipeType}
              onChange={handleType}
      >
        {foodFamilies.map(({id,name}) => (
          <MenuItem key={id} value={id}>{name}</MenuItem>
        ))}
      </Select>
    </Grid2>
    <Grid2>
      <Typography>Porciones</Typography>
      <TextField
        type={"number"}
        variant={"outlined"}
        value={recipePortions.toString()}
        onChange={(e)=>{
          setRecipePortions(Number(e.target.value))
        }}
      />
    </Grid2>
    <Divider/>
    <Grid2 container spacing={2}>
      <Grid2 size={6}>
        <Button
          color={"secondary"}
          variant={"outlined"}
          fullWidth
          onClick={()=>setShowIgredients(!showIgredients)}
          startIcon={<ShoppingCartRounded/>}
        >Listar ingredientes</Button>
      </Grid2>
      <Grid2 size={6}>
        <Button
          fullWidth
          color={"secondary"}
          variant={"outlined"}
          startIcon={<AutoStoriesRounded/>}
        >Instrucciones y pasos</Button>
      </Grid2>
    </Grid2>
    {showIgredients ? (<Grid2>
      <Typography variant={"h4"}>Lista de ingredientes</Typography>
      <RecipeIngredients
        ingredients={listOfIngredients}
        editable={true}
        saveIngredients={setListOfIngredients}
       baseIngredients={rawIngredients}/>
    </Grid2>) : (<></>)}
    <Divider/>
    <Grid2 size={12}>
      <Button
        fullWidth
        size={"large"}
        variant={"contained"}
      >Guardar receta</Button>
    </Grid2>
  </Grid2>)
}