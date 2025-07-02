import {Card, CardContent, CardProps, Chip, Typography} from "@mui/material";
import {PeopleAltRounded} from "@mui/icons-material";
import React from "react";

interface PortionsCardProps extends CardProps{
  type: 'card' | 'chip'
  portions: number;
  color?: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
}

export function PortionsCard(props: PortionsCardProps){
  const {
    type,
    portions,
  } = props

  function renderCardContent(){
    return <Card {...props}>
      <CardContent>
        <Typography align={"center"}>
          <Typography variant={"h2"} color={props.color}>
            <PeopleAltRounded fontSize={"large"}/>
            {portions}
          </Typography><br/>
          <Typography variant={"caption"}>
            RACIONES
          </Typography>
        </Typography>
      </CardContent>
    </Card>
  }

  function renderChipContent(){
    return <Chip
      label={`${portions} raciones`}
      variant={"outlined"}
      color={props.color}
      icon={<PeopleAltRounded style={{marginLeft:8}}/>}
    />
  }

  switch(type){
    case 'chip':
      return renderChipContent()
    case "card":
      return renderCardContent()
  }
}