"use client"
import React, {useEffect} from "react";
import {
  Button, Chip,
  CircularProgress,
  Grid2,InputAdornment,
  List,
 TextField,
  Typography
} from "@mui/material";
import {AddCircle, SearchRounded} from "@mui/icons-material";
import {IRecipe} from "@/util/models";
import {foodFamilies, seasons} from "@/util/constants";
import {getRecipes, IFilterRecipes} from "@/lib/firebase/recipes";
import {Base} from "@/components/Base";
import {AccordionRecipe} from "@/components/Recipe/AccordeonRecipe";

export default function Recipes() {
  const [recipes, setRecipes] = React.useState<IRecipe[]>([]);
  const [filterName, setFilterName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [filterSeason, setFilterSeason] = React.useState<string>("");
  const [filterFamily, setFilterFamily] = React.useState<string>("");
  const [refresh, setRefresh] = React.useState(false);

  useEffect(()=>{
    if (recipes.length == 0 && filterName == "" && filterSeason == "" && filterFamily == "") {
      loadRecipes()
    }
  },[recipes])

  useEffect(()=>{
    loadRecipes()
  },[refresh])

  function liveFilterPerNameOrIngredient(recipe: IRecipe) : boolean{
    const isPerName = recipe.name.toLowerCase().includes(filterName.toLowerCase())
    const ingredientNames : string[] = recipe.ingredients_list.map((ing)=> ing.ingredient.name)
    const inIngredients = ingredientNames.join(',').toLowerCase().includes(filterName.toLowerCase())
    return isPerName || inIngredients
  }

  async function loadRecipes() {
    const filters: IFilterRecipes = {}
    if (filterSeason !== ""){
      filters.season = filterSeason
    }
    if (filterFamily !== ""){
      filters.family = filterFamily
    }
    setIsLoading(true)
    const response = await getRecipes(filters)
    console.log('renderRecipes', response)
    if (filterName !== ""){
      response.filter((item)=>{
        return item.name.toLowerCase().includes(filterName.toLowerCase())
      })
    }
    setRecipes(response.filter((item)=>{
      return filterName !== "" ? liveFilterPerNameOrIngredient(item) : true
    }))
    setIsLoading(false)
  }

  function renderSeasonFilter(){
    return seasons.map((season, index) => {
      return <Chip
        size={"small"}
        style={{margin: 3}}
        label={season.name}
        key={`filter-${season.key}-${index}`}
        onClick={()=>{setFilterSeason(filterSeason === season.key ? "" : season.key)}}
        color={filterSeason === season.key ? "primary" : "default"}
      />
    })
  }

  function renderFoodFamilyFilter(){
    return foodFamilies.map((fam, index) => {
      return <Chip
        size={"small"}
        style={{margin: 3}}
        label={`${fam.icon} ${fam.name}`}
        key={`filter-${fam.id}-${index}`}
        onClick={()=>{setFilterFamily(filterFamily === fam.id ? "" : fam.id)}}
        color={filterFamily === fam.id ? "secondary" : "default"}
      />
    })
  }

  return (<Base>
    <Grid2 container spacing={1} padding={1} justifyContent={"space-between"}>
      <Grid2 size={4}>
        <Typography variant={"h3"}> Recetas </Typography>
      </Grid2>
      <Grid2 size={4}>
        <Button
          color={"secondary"}
          variant={"contained"}
          startIcon={<AddCircle/>}
          size={"small"}
          fullWidth
          href={'/recipes/create'}
        >Nueva receta</Button>
      </Grid2>
    </Grid2>
    <Grid2 container spacing={2} direction={"row"} columns={{ xs: 6, sm: 6, md: 12, lg:12, xl:12 }} paddingBottom={10}>
      <Grid2 size={{xs: 6, sm: 6, md: 2, lg:2, xl:2}}>
        <TextField
          placeholder={"Buscar por nombre o ingrediente"}
          value={filterName}
          onChange={({target})=>{setFilterName(target.value)}}
          size={"small"}
          fullWidth
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  {isLoading ? <CircularProgress/> :
                    <Button startIcon={<SearchRounded/>} onClick={()=>{loadRecipes()}}>Buscar</Button>
                  }
                </InputAdornment>
              ),
            },
          }}
        />
        <Grid2 container direction={"row"}>
          <Grid2>
            {renderSeasonFilter()}
            {renderFoodFamilyFilter()}
          </Grid2>
        </Grid2>

      </Grid2>
      <Grid2 size={{xs: 6, sm: 6, md: 10, lg:10, xl:10}}>
        <List key={'recipe-list'}>
          {recipes.map((r,index)=>{
            return <AccordionRecipe
              key={`recipe-${index}`}
              recipe={r}
              index={index}
              refreshAction={()=>{setRefresh(!refresh)}}
            />
          })}
        </List>
      </Grid2>
    </Grid2>
  </Base>);
}