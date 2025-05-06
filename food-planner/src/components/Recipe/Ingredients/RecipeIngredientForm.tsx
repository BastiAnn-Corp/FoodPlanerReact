import {IIngredient, IRecipeIngredient} from "@/util/models";
import {Button, Grid2, MenuItem, Paper, Select, TextField, Typography} from "@mui/material";
import {IngredientsSelector} from "@/components/Ingredients/IngredientsSelector";
import {useState} from "react";
import {measuerementUnits, TMeasureUnits} from "@/util/constants";

interface RecipeIngredientFormProps {
  ingredients: IIngredient[];
  addIngredient: (ingredient: IRecipeIngredient)=> void
}
export function RecipeIngredientForm(props:RecipeIngredientFormProps) {
  const [ingredient, setIngredient] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState<TMeasureUnits | null>('unidad');

  function handleSave() {
    const found = props.ingredients.find((i)=> i.name === ingredient)
    if (found && quantity > 0 && unit !== null){
     const recipeIngredient: IRecipeIngredient = {
       ingredient: {...found, convertions:[]},
       quantity,
       quantity_unit: unit
     }
     props.addIngredient(recipeIngredient);
     setIngredient(null);
     setUnit('unidad');
     setQuantity(0);
    }
  }

  function convertionsAvailable (ingredientName: string | null) : string[] {
    if (ingredientName === null){ return [] }
    const found = props.ingredients.find((i)=> i.name === ingredientName)
    if (!found){ return [] }
    return found.convertions.map(({unit})=> unit).flat()
  }

  return (
    <Grid2 container direction={"row"} spacing={2}>
    <Grid2 size={12}>
      <Typography variant={"caption"}>Elije ingrediente para la receta:</Typography>
      <IngredientsSelector
        ingredients={props.ingredients}
        selected={ingredient}
        select={setIngredient}
      />
    </Grid2>
    <Grid2 size={6}>
      <Typography variant={"caption"}>Cantidad</Typography>
      <TextField
        fullWidth
        size={"small"}
        value={quantity}
        type={"number"}
        onChange={(e)=>{setQuantity(Number(e.target.value))}}
        disabled={ingredient === null}
      />
    </Grid2>
    <Grid2 size={6}>
      <Typography variant={"caption"}>Medida</Typography>
    <Select
      fullWidth
      size={"small"}
       value={unit}
       onChange={(e)=>{setUnit(e.target.value as TMeasureUnits)}}
       disabled={ingredient === null}
    >
      {measuerementUnits.map((item, index)=>{
        return <MenuItem
          key={`recipe-ingredient-unit-${item.id}-${index}`}
          value={item.id}
          color={convertionsAvailable(ingredient).includes(item.id) ? "primary" : 'inherit'}
        >{item.name}</MenuItem>
      })}
    </Select>
    </Grid2>
    <Grid2 size={12}>
  <Button
    fullWidth
    size={"small"}
    variant={"contained"}
    color={"secondary"}
    onClick={()=>{handleSave()}}
    disabled={quantity === 0}
  >Agregar ingrediente a la lista</Button>
    </Grid2>
    </Grid2>)
}