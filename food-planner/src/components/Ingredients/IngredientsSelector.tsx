import {IIngredient} from "@/util/models";
import {Autocomplete, TextField} from "@mui/material";
import {useState} from "react";

interface IngredientsSelectorProps {
  ingredients: IIngredient[];
  selected: string | null
  select: (i: string | null) => void
}
export function IngredientsSelector({
  ingredients,
  select,
  selected
}:IngredientsSelectorProps) {
  const [filter,setFilter]= useState("")

  return (<Autocomplete
    fullWidth
    size={"small"}
    value={selected}
    onChange={(event, newValue) => {
      select(newValue);
    }}
    inputValue={filter}
    onInputChange={(event, newInputValue) => {
      setFilter(newInputValue);
    }}
    options={ingredients.map((i)=>{
      return i.name
    })}
    renderInput={(params) => <TextField {...params} label="Filtrar por nombre" />}
  />)
}