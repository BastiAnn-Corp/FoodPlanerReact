"use client"
import React, {useEffect, useState} from "react";
import {
  Accordion, AccordionDetails, AccordionSummary, Alert,
  Button, CircularProgress,
  Divider,
  Grid2, List,
  MenuItem, Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from "@mui/material";
import {foodFamilies, seasons, TFoodFamily, TSeasons} from "@/util/constants";
import {IIngredient, IRecipe, IRecipeIngredient, IRecipeStep} from "@/util/models";
import {AddCircle, AutoStoriesRounded, ShoppingCartRounded} from "@mui/icons-material";
import {getIngredients} from "@/lib/firebase/ingredients";
import {ModalAddIngredient} from "@/components/Ingredients/modalAddIngredient";
import {ItemRecipeStep} from "@/components/Recipe/Steps/ItemRecipeStep";
import {RecipeStepForm} from "@/components/Recipe/Steps/RecipeStepForm";
import {RecipeIngredientForm} from "@/components/Recipe/Ingredients/RecipeIngredientForm";
import {ItemRecipeIngredient} from "@/components/Recipe/Ingredients/ItemRecipeIngredient";
import {createRecipe, validateRecipeCreation} from "@/lib/firebase/recipes";

export function RecipeForm() {
  const [selectedSeasons, setSelectedSeasons] = React.useState<string[]>([]);
  const [recipeName, setRecipeName] = useState<string>("")
  const [recipeType, setRecipeType] = useState<string>("")
  const [recipePortions, setRecipePortions] = useState<number>(4)

  const [rawIngredients, setRawIngredients] = useState<IIngredient[]>([]);
  const [addRawIngredient, setAddRawIngredient] = useState<boolean>(false);

  const [listOfIngredients, setListOfIngredients] = useState<IRecipeIngredient[]>([])
  const [listOfSteps, setListOfSteps] = useState<IRecipeStep[]>([])

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = React.useState<{severity: 'success' | 'error', message?: string}>({severity: "success"});

  useEffect(()=>{
    loadRawIngredients()
  }, [addRawIngredient])

  useEffect(()=>{

  }, [listOfIngredients, message])

  async function loadRawIngredients (){
    const result = await getIngredients({})
    setRawIngredients(result)
  }

  const handleIngredients = (ing: IRecipeIngredient) => {
    const filtered = listOfIngredients.filter(
      ({ingredient}) => ingredient.name !== ing.ingredient.name)
    if (filtered.length === listOfIngredients.length) {
      filtered.push(ing)
    }
    setListOfIngredients(filtered);
  }

  const handleStep = (step: IRecipeStep) => {
    const filtered = listOfSteps.filter(
      (item) => item.instructions !== step.instructions)
    if (filtered.length === listOfSteps.length) {
      filtered.push(step)
    }
    setListOfSteps(filtered);
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

  async function handleCreateRecipe () {
    setIsLoading(true)
    const recipe:IRecipe = {
      name: recipeName,
      portions: recipePortions,
      seasons: selectedSeasons as TSeasons[],
      family:recipeType as TFoodFamily,
      ingredients_list: listOfIngredients,
      steps: listOfSteps,
    }
    if (validateRecipeCreation(recipe)){
      const {error} = await createRecipe(recipe)
      setMessage({
        severity: error ? "error" : "success",
        message: error ? error : `Nueva receta ${recipe.name} guardado!`
      })
    } else {
      setMessage({
        severity: "error",
        message: "Faltan campos por completar"
      })
    }
    setIsLoading(false)
  }

  return (<Grid2 spacing={1} direction={"row"} justifyContent={"space-around"} container columns={{ xs: 6, sm: 6, md: 12, lg:12, xl:12 }} paddingBottom={10}>
    <Grid2 size={12}>
      <Typography variant={"h3"} color={"primary"}>
        Nueva Receta
      </Typography>
    </Grid2>
    <ModalAddIngredient isOpen={addRawIngredient} handleClose={()=>{setAddRawIngredient(false); loadRawIngredients()}}/>
    <Grid2 size={6}>
      <Typography>Nombre de receta</Typography>
      <TextField
        type={"text"}
        variant={"outlined"}
        fullWidth
        value={recipeName}
        onChange={({target})=>{setRecipeName(target.value)}}
      />
    </Grid2>
    <Grid2 size={6}>
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
    <Grid2 size={{ xs: 6, sm: 6, md: 8, lg:8, xl:8 }}>
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
    <Grid2 size={{ xs: 6, sm: 6, md: 4, lg:4, xl:4 }}>
      <Typography>Porciones</Typography>
      <TextField
        fullWidth
        type={"number"}
        variant={"outlined"}
        value={recipePortions.toString()}
        onChange={(e)=>{
          setRecipePortions(Number(e.target.value))
        }}
      />
    </Grid2>
    <Grid2 size={6} container>
      <Accordion defaultExpanded>
        <AccordionSummary>
          <Typography color={"secondary"}><ShoppingCartRounded/> Lista de ingredientes </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper elevation={2}
                 style={{padding: 10, margin:5}}
          >
            <Typography variant={"caption"} color={"textDisabled"}>
              Tu ingrediente no esta en la lista? Agregalo aquí <AddCircle
              fontSize={"small"}
              onClick={()=>setAddRawIngredient(true)}
            />
            </Typography>
            <RecipeIngredientForm
              addIngredient={handleIngredients}
              ingredients={rawIngredients}
            />
          </Paper>
          <List>{
            listOfIngredients.map((ing,index)=>{
              return (<ItemRecipeIngredient
                key={`recipe-ingredient-${index}`}
                index={index}
                ingredient={ing}
                deleteIngredient={handleIngredients}
              />)
            })
          }</List>
        </AccordionDetails>
      </Accordion>


    </Grid2>
    <Grid2 size={6}>
      <Accordion defaultExpanded>
        <AccordionSummary>
          <Typography color={"primary"}><AutoStoriesRounded/> Instrucciones y pasos </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <RecipeStepForm saveStep={handleStep}/>
          {listOfSteps.map((item, index)=>{
            return <ItemRecipeStep
              key={`recipe-step-${index}`}
              step={item} index={index}
              deleteStep={handleStep}
            />
          })}
        </AccordionDetails>
      </Accordion>

    </Grid2>
    <Divider/>
 <Grid2 container size={12} spacing={2} direction={"row"}>
   {message.message ? <Grid2 size={12}>
     <Alert severity={message.severity}>{message.message}</Alert>
   </Grid2> : <></>}
   <Grid2 size={6}>
     <Button
       fullWidth
       size={"large"}
       variant={"contained"}
       color={"inherit"}
       disabled={isLoading}
       href={'/recipes'}
     >Volver</Button>
   </Grid2>
   <Grid2 size={6}>
     <Button
       fullWidth
       size={"large"}
       variant={"contained"}
       disabled={
         recipeName === "" || selectedSeasons.length === 0 ||
         recipeType === "" || listOfIngredients.length === 0 ||
         listOfSteps.length === 0 || isLoading
       }
       onClick={()=>{handleCreateRecipe()}}
     >{isLoading ? <CircularProgress/> : "Crear receta"}</Button>
   </Grid2>
 </Grid2>

  </Grid2>)
}