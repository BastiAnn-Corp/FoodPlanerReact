import {Card, CardContent, CardProps, Chip, ChipProps, Typography} from "@mui/material";
import {BookmarkAddedRounded, EditRounded} from "@mui/icons-material";
import React from "react";

interface AuthorCardProps extends CardProps{
  type: 'card' | 'chip'
  creatorName: string | undefined;
  color?: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
}

export function AuthorCard(props: AuthorCardProps){
  const {
    type,
    creatorName,
  } = props

  function renderCardContent(){
    return <Card {...props}>
      <CardContent>
        <Typography align={"center"}>
          <Typography variant={"h2"} color={props.color}>
            <EditRounded fontSize={"large"}/>
          </Typography><br/>
          <Typography variant={"caption"}>
            Publicado por {creatorName || 'BastiAnn'}
          </Typography>
        </Typography>
      </CardContent>
    </Card>
  }

  function renderChipContent(){
    return <Chip
      label={creatorName || 'BastiAnn'}
      variant={"outlined"}
      icon={<EditRounded style={{marginLeft:8}}/>}
      color={props.color}
    />
  }

  switch(type){
    case 'chip':
      return renderChipContent()
    case "card":
      return renderCardContent()
  }
}