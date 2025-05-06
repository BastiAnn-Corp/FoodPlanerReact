"use client"
import React, {useEffect, useState} from "react";
import {IIngredient,} from "@/util/models";
import {marketAisles, TAisle} from "@/util/constants";
import {getIngredients, IFilterIngredients} from "@/lib/firebase/ingredients";
import {
  Button,
  Chip,
  CircularProgress,
  Grid2,
  InputAdornment,
  List,
  TextField,
  Typography
} from "@mui/material";
import {AddCircle, SearchRounded} from "@mui/icons-material";
import {ItemIngredient} from "@/components/Ingredients/ItemIngredient";
import {Base} from "@/components/Base";
import {ModalAddIngredient} from "@/components/Ingredients/modalAddIngredient";

export default function Ingredients(){
  const [ingredients,setIngredients] = React.useState<IIngredient[]>([]);
  const [filterName, setFilterName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [filterAisle, setFilterAisle] = React.useState<TAisle | "">("");
  const [addIngredient, setAddIngredient] = useState<boolean>(false)
  useEffect(()=>{
    if (ingredients.length === 0 && filterName == "" && filterAisle.length == 0 && !addIngredient) {
      load()
    }
  },[ingredients, addIngredient])

  async function load() {
    const filters: IFilterIngredients = {}
    if (filterAisle !== ""){
      filters.aisles = [filterAisle]
    }
    setIsLoading(true)
    const response = await getIngredients(filters)
    console.log('renderItems', response)
    if (filterName !== ""){
      response.filter((item)=>{
        return item.name.toLowerCase().includes(filterName.toLowerCase())
      })
    }
    setIngredients(response)
    setIsLoading(false)
  }

  function renderAisleFilter(){
    return marketAisles.map((aisle, index) => {
      return <Chip
        size={"small"}
        style={{margin: 3}}
        label={aisle.name}
        key={`filter-${aisle.id}-${index}`}
        onClick={()=>{setFilterAisle(filterAisle === aisle.id ? "" : aisle.id as TAisle)}}
        color={filterAisle === aisle.id ? "primary" : "default"}
      />
    })
  }

  return (<Base>
    <Grid2 container spacing={1} justifyContent={"space-between"} >
      <Grid2 size={4}>
        <Typography variant={"h3"}> Ingredientes </Typography>
      </Grid2>
      <Grid2 size={4}>
        <Button
          color={"secondary"}
          variant={"contained"}
          startIcon={<AddCircle/>}
          size={"small"}
          onClick={()=>{setAddIngredient(true)}}
          fullWidth
        >Nuevo Ingrediente</Button>
      </Grid2>
      <ModalAddIngredient isOpen={addIngredient} handleClose={()=>{setAddIngredient(false)}}/>
    </Grid2>
    <Grid2 container spacing={2} direction={"row"} columns={{ xs: 6, sm: 6, md: 12, lg:12, xl:12 }} paddingBottom={10}>
      <Grid2 size={{xs: 6, sm: 6, md: 2, lg:2, xl:2}}>
        <TextField
          placeholder={"Buscar ingrediente por nombre"}
          value={filterName}
          onChange={({target})=>{setFilterName(target.value)}}
          size={"small"}
          fullWidth
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  {isLoading ? <CircularProgress/> :
                    <SearchRounded onClick={()=>{load()}}/>
                  }
                </InputAdornment>
              ),
            },
          }}
        />
        <Grid2 container direction={"row"}>
          <Grid2>
            {renderAisleFilter()}
          </Grid2>
        </Grid2>
      </Grid2>

      <Grid2 size={{xs: 6, sm: 6, md: 10, lg:10, xl:10}}>
        <List key={'recipe-list'}>
          {ingredients.map((i,index)=>{
            return <ItemIngredient ingredient={i} index={index} editable={true} key={`ingredient-${index}`}/>
          })}
        </List>
      </Grid2>
    </Grid2>
  </Base>);

}