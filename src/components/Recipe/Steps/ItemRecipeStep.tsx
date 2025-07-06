"use client"
import {IRecipeStep} from "@/util/models";
import {
	Button,
	ButtonGroup,
	Checkbox,
	IconButton,
	ListItem,
	ListItemIcon,
	ListItemProps,
	ListItemText,
	Paper
} from "@mui/material";
import {ArrowDownwardRounded, ArrowUpwardRounded, Delete} from "@mui/icons-material";
import React, {ReactNode, useEffect} from "react";
import {InstructionChip} from "@/components/Recipe/Steps/InstructionChip";

interface ItemRecipeStepProps extends ListItemProps {
	step: IRecipeStep;
	index: number;
	editing?: boolean,
	moveStep?: (index: number, movement: 1 | -1) => void
	deleteStep?: (index: number) => void;
}

export function ItemRecipeStep(props: ItemRecipeStepProps) {
	const {
		step,
		index,
	} = props
	
	useEffect(() => {
	
	}, [step, index]);
	
	function renderContent(): ReactNode {
		return <ListItem {...props}>
			<ListItemIcon>
				<Checkbox size={"small"}/>
			</ListItemIcon>
			<ListItemText>
				{`${index + 1}. ${step.instructions}`} <br/>
				<InstructionChip step={step} type={'machine'} key={`instruction-machine-${index}`}/>
				<InstructionChip step={step} type={'robot'} key={`instruction-robot-${index}`}/>
			</ListItemText>
		</ListItem>
	}
	
	function renderInput(): ReactNode {
		return <ListItem
			{...props}
			secondaryAction={props.deleteStep ?
				<IconButton edge={"start"} aria-label="delete" onClick={() => {
					props.deleteStep!(props.index)
				}}>
					<Delete/>
				</IconButton> : <></>
			}>
			<ListItemIcon>
				{props.editing === true ?
					<ButtonGroup size={"small"} variant={"text"} color={"inherit"}>
						<Button
							onClick={()=>{props.moveStep!(index, -1)}}
							disabled={!props.moveStep || index === 0}
						><ArrowUpwardRounded/></Button>
						<Button
							onClick={()=>{props.moveStep!(index, 1)}}
							disabled={!props.moveStep}
						><ArrowDownwardRounded/></Button>
					</ButtonGroup>
					:
					<Checkbox size={"small"}/>
				}
			</ListItemIcon>
			<ListItemText>
				{`${step.instructions}`} <br/>
				<InstructionChip step={step} type={'machine'} key={`instruction-machine-${index}`}/>
				<InstructionChip step={step} type={'robot'} key={`instruction-robot-${index}`}/>
			</ListItemText>
		</ListItem>
	}
	
	
	return (<Paper
		elevation={1}
		variant="outlined"
		style={{padding:1, marginTop: 3}}
	>
		{props.editing === true ? renderInput() : renderContent()}
	</Paper>)
}