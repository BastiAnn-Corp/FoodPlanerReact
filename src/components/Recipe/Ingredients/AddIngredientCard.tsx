"use client"
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid2, MenuItem, Select,
  TextField,
  Typography
} from "@mui/material";
import {IIngredient, IRecipeIngredient} from "@/util/models";
import {getIngredients} from "@/lib/firebase/ingredients";
import React, {useEffect, useState} from "react";
import {measuerementUnits, TMeasureUnits} from "@/util/constants";
import {AddCircle} from "@mui/icons-material";
import {ModalAddIngredient} from "@/components/Ingredients/modalAddIngredient";
import {IngredientsSelector} from "@/components/Ingredients/IngredientsSelector";

interface AddIngredientCardProps {
  add: (ingredient: IRecipeIngredient) => void;
  listOfIngredients: IRecipeIngredient[];
}

export function AddIngredientCard(props: AddIngredientCardProps) {
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState<TMeasureUnits | null>('unidad');

  const [rawIngredients, setRawIngredients] = useState<IIngredient[]>([]);
  const [addRawIngredient, setAddRawIngredient] = useState<boolean>(false);

  useEffect(() => {
    loadRawIngredients()
  }, []);

  async function loadRawIngredients (){
    const result = await getIngredients({})
    setRawIngredients(result)
  }

  function handleSave() {
    const found = rawIngredients.find((i)=> i.name === selectedIngredient)
    if (found && quantity > 0 && unit !== null) {
      const recipeIngredient: IRecipeIngredient = {
        ingredient: {
          id: found.id,
          name: found.name,
          aisles: found.aisles,
          convertions: [],
        },
        quantity,
        quantity_unit: unit
      }
      props.add(recipeIngredient)
    }
  }

  return <Card>
    <CardContent>
      <Grid2 container direction={"row"} spacing={1}>
        <Grid2 size={12}>
          <IngredientsSelector
            ingredients={rawIngredients}
            selected={selectedIngredient}
            select={setSelectedIngredient}
          />
        </Grid2>
        <Grid2 size={6}>
          <Typography variant={"caption"}>Cantidad</Typography><br/>
          <TextField
            fullWidth
            size={"small"}
            value={quantity}
            type={"number"}
            onChange={(e)=>{setQuantity(Number(e.target.value))}}
            disabled={selectedIngredient === null}
          />
        </Grid2>
        <Grid2 size={6}>
          <Typography variant={"caption"}>Medida</Typography><br/>
          <Select
            fullWidth
            size={"small"}
            value={unit}
            onChange={(e)=>{setUnit(e.target.value as TMeasureUnits)}}
            disabled={selectedIngredient === null}
          >
            {measuerementUnits.map((item, index)=>{
              return <MenuItem
                key={`recipe-ingredient-unit-${item.id}-${index}`}
                value={item.id}
              >{item.name + ` (${item.id})`}</MenuItem>
            })}
          </Select>
        </Grid2>
      </Grid2><br/>
      <Divider/>
      <ModalAddIngredient isOpen={addRawIngredient} handleClose={()=>{setAddRawIngredient(false); loadRawIngredients()}}/>
      <Typography variant="caption">Tu ingrediente no esta en la lista? Agregalo aquí <AddCircle
        fontSize={"small"}
        onClick={()=>setAddRawIngredient(true)}
      /></Typography>
    </CardContent>
    <CardActions >
      <Button
        color={"secondary"}

        disabled={quantity === 0 && unit===null && selectedIngredient===null}
        onClick={()=>{handleSave()}}
      >Agregar ingrediente a la lista</Button>
    </CardActions>
  </Card>
}