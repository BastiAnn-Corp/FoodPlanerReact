"use client"
import {measuerementUnits, TMeasureUnits} from "@/util/constants";
import React, {useEffect} from "react";
import {Button, Grid2, MenuItem, Select, TextField, Typography} from "@mui/material";
import {Save, SaveAltRounded} from "@mui/icons-material";

interface IngredientConvertionFormProps {
  addConvertion: (q:number,u:TMeasureUnits)=>void;
  index: number;
}

export function IngredientConvertionForm ({addConvertion, index}: IngredientConvertionFormProps){
  const [unit, setUnit] = React.useState<TMeasureUnits|"">("");
  const [quantity, setQuantity] = React.useState<number>(0);

  return (<Grid2 container
                 direction={"row"}
                 key={`convertion-${index}`}
                 spacing={2}
                 alignContent={"bottom"}
  >
    <Grid2 size={4}>
      <Typography variant={"caption"}>Cantidad por unidad</Typography>
      <TextField
        size={"small"}
        key={`convertion-quantity-${index}`}
        type={"number"}
        value={quantity}
        onChange={(e)=>{setQuantity(Number(e.target.value))}}
        fullWidth
      />
    </Grid2>
    <Grid2 size={4}>
      <Typography variant={"caption"}>Unidad de medida</Typography>
      <Select
        size={"small"}
        key={`convertion-unit-${index}`}
        onChange={(e)=>{setUnit(e.target.value as TMeasureUnits)}}
        fullWidth
        disabled={quantity===0}
      >{
        measuerementUnits.map(({id,name}, i)=>{
          return <MenuItem value={id} key={`unit-${id}-${index}-${i}`}>{name}</MenuItem>;
        })
      }</Select>
    </Grid2>
    <Grid2 size={4}>
      <Button
        size={"small"}
        startIcon={<Save/>}
        variant={"outlined"}
        color={"secondary"}
        disabled={unit === "" && quantity === 0}
        onClick={()=>{addConvertion(quantity,unit as TMeasureUnits)}}
      >Guardar conversion</Button>
    </Grid2>
  </Grid2> )
}