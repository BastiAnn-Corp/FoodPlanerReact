"use client"
import {IRecipeIngredient} from "@/util/models";
import {Button, ButtonGroup, Grid2, List, ListProps} from "@mui/material";
import {useEffect, useState} from "react";
import {ItemRecipeIngredient} from "../Steps/ItemRecipeIngredient";
import {AddIngredientCard} from "@/components/Recipe/Ingredients/AddIngredientCard";
import {CancelRounded, EditRounded, SaveRounded} from "@mui/icons-material";

interface ListOfIngredientsProps extends ListProps {
	ingredients: IRecipeIngredient[];
	editing?: {
		active: boolean,
		update: (ingredients: IRecipeIngredient[]) => void,
	}
}

export function ListOfIngredients(props: ListOfIngredientsProps) {
	const {
		ingredients
	} = props
	
	const [listOfIngredients, setListOfIngredients] = useState<IRecipeIngredient[]>(ingredients)
	const [activeEdit, setActiveEdit] = useState<boolean>(false)
	
	useEffect(() => {
		setListOfIngredients(ingredients)
	}, [ingredients]);
	
	const handleDeleteIngredient = (ingredient: IRecipeIngredient) => {
		const filtered = listOfIngredients.filter((i) => i.ingredient.id !== ingredient.ingredient.id)
		return setListOfIngredients(filtered)
	}
	
	const handleAddIngredient = (ingredient: IRecipeIngredient) => {
		const updatedList = listOfIngredients.concat([ingredient])
		setListOfIngredients(updatedList)
	}
	
	const handleUpdateIngredient = (ingredient: IRecipeIngredient) => {
		const updatedList = listOfIngredients.map((i) => {
			switch (i.ingredient.id) {
				case ingredient.ingredient.id:
					return ingredient
				default:
					return i
			}
		})
		setListOfIngredients(updatedList)
	}
	
	function reset() {
		setListOfIngredients(props.ingredients)
		setActiveEdit(false)
	}
	
	function saveChanges() {
		props.editing?.update(listOfIngredients)
		setActiveEdit(false)
	}
	
	return <Grid2 container spacing={1}>
		{props.editing?.active === true ? <Grid2 size={12}>{activeEdit ?
			<ButtonGroup
				fullWidth
				variant={"contained"}
				size={"large"}
			>
				<Button
					onClick={() => {
						saveChanges()
					}}
					color={"success"}
					startIcon={<SaveRounded/>}
				>Guardar</Button>
				<Button
					onClick={() => {
						reset()
					}}
					color={"inherit"}
					startIcon={<CancelRounded/>}
				>No guardar</Button>
			</ButtonGroup>
			:
			<Button
				onClick={() => {
					setActiveEdit(true)
				}}
				disabled={!props.editing?.active}
				variant={"contained"}
				color={"primary"}
				startIcon={<EditRounded/>}
				fullWidth
			>Cambiar ingredientes</Button>
		}
		</Grid2> : <></>}
		{activeEdit && props.editing?.active ?
			<Grid2 size={12}>
				<AddIngredientCard add={handleAddIngredient} listOfIngredients={listOfIngredients}/>
			</Grid2>
			
			: <></>
		}
		<Grid2 size={12}>
			<List {...props}>
				{
					listOfIngredients.map((ingredient, i) => {
						return <ItemRecipeIngredient
							ingredient={ingredient}
							key={`${props.key}-ingredient-${i}`}
							deleteIngredient={activeEdit ? handleDeleteIngredient : undefined}
							editing={activeEdit && props.editing?.active ? {
								active: activeEdit,
								update: handleUpdateIngredient
							} : undefined}
						/>
					})
				}
			</List>
		</Grid2>
	</Grid2>
}