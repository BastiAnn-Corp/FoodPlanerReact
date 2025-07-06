"use client"
import {Button, ButtonGroup, Divider, Grid2, List, ListProps, Typography} from "@mui/material";
import {IRecipeStep} from "@/util/models";
import {ItemRecipeStep} from "@/components/Recipe/Steps/ItemRecipeStep";
import React, {useEffect, useState} from "react";
import {CancelRounded, EditRounded, SaveRounded} from "@mui/icons-material";
import {RecipeStepForm} from "@/components/Recipe/Steps/RecipeStepForm";

interface ListOfStepsProps extends ListProps {
	steps: IRecipeStep[]
	editing?: boolean
	update?: (steps: IRecipeStep[]) => void
}

export function ListOfSteps(props: ListOfStepsProps) {
	const [listOfSteps, setListOfSteps] = useState<IRecipeStep[]>(props.steps)
	const [activeEdit, setActiveEdit] = useState<boolean>(false)
	
	useEffect(() => {
		setListOfSteps(props.steps)
	}, [props.steps])
	
	function handleDelete(index: number) {
		const filtered = listOfSteps.filter((s, i) => i !== index)
		setListOfSteps(filtered)
	}
	
	function handleAdd(step: IRecipeStep) {
		const updatedList = listOfSteps.concat([step])
		setListOfSteps(updatedList)
	}
	
	function handleMove(index: number, movement: 1 | -1) {
		const maxIndex = listOfSteps.length -1
		const prevIndex = index === 0 ? index : index - 1
		const nextIndex = index === maxIndex ? index : index + 1
		const prevChunk = listOfSteps.filter((s,i)=> i < prevIndex)
		const nextChunk = listOfSteps.filter((s,i)=> i > nextIndex)
		const prevStep = listOfSteps[prevIndex]
		const nextStep = listOfSteps[nextIndex]
		const movableStep = listOfSteps[index]
		console.log('Movement of step:', {
			movement,
			index,
			maxIndex,
			prevIndex,
			nextIndex,
			prev: prevStep.instructions,
			step: movableStep.instructions,
			next: nextStep.instructions,
			prevChunk,
			nextChunk,
		})
		switch (movement) {
			case 1:
				if (index === maxIndex) {
					setListOfSteps(listOfSteps)
				} else {
					const middleChunk = [prevStep, nextStep, movableStep]
					const reordered = prevChunk.concat(middleChunk).concat(nextChunk)
					setListOfSteps(reordered)
				}
				break;
			case -1:
				if (index === 0) {
					setListOfSteps(listOfSteps)
				} else {
					const middleChunk = [movableStep, prevStep, nextStep]
					const reordered = prevChunk.concat(middleChunk).concat(nextChunk)
					setListOfSteps(reordered)
				}
				break;
		}
		console.log('Result list:', listOfSteps.map((s)=>{return s.instructions}))
	}
	
	function reset() {
		setListOfSteps(props.steps)
		setActiveEdit(false)
	}
	
	function saveChanges() {
		props.update!(listOfSteps)
		setActiveEdit(false)
	}
	
	return <Grid2 container>
		<Grid2 container direction={"row"} size={12} justifyContent={"space-between"}>
			<Grid2 size={6}>
				<Typography variant={"h6"} color={"secondary"}>INSTRUCCIONES</Typography>
			</Grid2>
			<Grid2 size={"auto"}>{props.editing === true ? activeEdit ?
				<ButtonGroup
					variant={"contained"}
				>
					<Button
						onClick={() => {
							saveChanges()
						}}
						color={"secondary"}
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
					color={"secondary"}
					startIcon={<EditRounded/>}
				>Editar</Button>
			: <></>}</Grid2>
			<Grid2 size={12}>
				<Divider color={"#ff8f00"} />
			</Grid2>
		</Grid2>
		
		<Grid2 size={12}>
			<List {...props}>
				{listOfSteps.map((recipeStep, i) => {
					return <ItemRecipeStep
						step={recipeStep}
						index={i}
						key={`${props.key}-step-${i}`}
						editing={props.editing === true && activeEdit}
						moveStep={i === listOfSteps.length -1 || i === 0 ? undefined : handleMove}
						deleteStep={handleDelete}
					/>
				})}
			</List>
		</Grid2>
		{activeEdit && props.editing ?
			<Grid2 size={12}>
				<RecipeStepForm saveStep={handleAdd}/>
			</Grid2>
			: <></>
		}
	</Grid2>
}