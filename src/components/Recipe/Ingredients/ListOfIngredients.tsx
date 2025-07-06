"use client"
import {IRecipeIngredient} from "@/util/models";
import {Button, ButtonGroup, Divider, Grid2, List, ListProps, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {ItemRecipeIngredient} from "../Steps/ItemRecipeIngredient";
import {AddIngredientCard} from "@/components/Recipe/Ingredients/AddIngredientCard";
import {CancelRounded, EditRounded, SaveRounded} from "@mui/icons-material";

interface ListOfIngredientsProps extends ListProps {
	ingredients: IRecipeIngredient[];
	editing?: boolean;
	update?: (ingredients: IRecipeIngredient[]) => void;
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
		props.update!(listOfIngredients)
		setActiveEdit(false)
	}
	
	return <Grid2 container spacing={1}>
		
		<Grid2 container direction={"row"} size={12} justifyContent={"space-between"}>
			<Grid2 size={6}>
				<Typography variant={"h6"} color={"primary"}>INGREDIENTES</Typography>
			</Grid2>
			<Grid2 size={"auto"}>{props.editing === true ? activeEdit ?
					<ButtonGroup
						variant={"contained"}
					>
						<Button
							onClick={() => {
								saveChanges()
							}}
							color={"primary"}
						><SaveRounded/></Button>
						<Button
							onClick={() => {
								reset()
							}}
							color={"inherit"}
						><CancelRounded/></Button>
					</ButtonGroup>
					:
					<Button
						onClick={() => {
							setActiveEdit(true)
						}}
						disabled={!props.editing}
						variant={"contained"}
						color={"primary"}
						startIcon={<EditRounded/>}
					>Editar</Button>
				: <></>}</Grid2>
			<Grid2 size={12}>
				<Divider color={"#7cb342"} />
			</Grid2>
		</Grid2>

		{activeEdit && props.editing ?
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
							editing={activeEdit && props.editing}
							update={handleUpdateIngredient}
						/>
					})
				}
			</List>
		</Grid2>
	</Grid2>
}