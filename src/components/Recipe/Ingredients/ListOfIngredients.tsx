"use client"
import { IIngredient, IRecipeIngredient } from "@/util/models";
import { List, ListProps } from "@mui/material";
import { useState } from "react";
import { ItemRecipeIngredient } from "../Steps/ItemRecipeIngredient";
import { getIngredients } from "@/lib/firebase/ingredients";

interface ListOfIngredientsProps extends ListProps{
    ingredients: IRecipeIngredient[];
    editing?: {
        active: boolean,
        update: (ingredient: IRecipeIngredient) => void,
    }
}

export function ListOfIngredients(props: ListOfIngredientsProps) {
    const {
        ingredients,
        editing
    } = props

    const [rawIngredients, setRawIngredients] = useState<IIngredient[]>([]);
    const [addRawIngredient, setAddRawIngredient] = useState<boolean>(false);

    const [listOfIngredients, setListOfIngredients] = useState<IRecipeIngredient[]>(ingredients)

    const handleIngredients = (ing: IRecipeIngredient) => {
        const filtered = listOfIngredients.filter(
            ({ingredient}) => ingredient.name !== ing.ingredient.name)
            if (filtered.length === listOfIngredients.length) {
                filtered.push(ing)
            }
        setListOfIngredients(filtered);
    }

    async function loadRawIngredients (){
        const result = await getIngredients({})
        setRawIngredients(result)
      }
    
    const handleDeleteIngredient = (ingredient: IRecipeIngredient) => {
        const filtered = listOfIngredients.filter((i)=> i.ingredient.id !== ingredient.ingredient.id)
        return setListOfIngredients(filtered)
    }

    const handleAddIngredient = (ingredient: IRecipeIngredient) => {
        
    }

    const handleUpdateIngredient = (ingredient: IRecipeIngredient) => {
        const found = listOfIngredients.find((i)=> i.ingredient.id === ingredient.ingredient.id)
        if (found){

        }
    }

    return <List {...props}>
        {
            listOfIngredients.map((ingredient,i)=>{
                return <ItemRecipeIngredient 
                ingredient={ingredient} 
                key={`${props.key}-ingredient-${i}`}
                deleteIngredient={handleDeleteIngredient}
                />
            })
        }
    </List>
}