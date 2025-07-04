import {Button, Card, CardContent, CardProps, Chip, Typography} from "@mui/material";
import {EditRounded} from "@mui/icons-material";
import React from "react";

interface AuthorCardProps extends CardProps {
  type: 'card' | 'chip'
  creatorName: string | undefined;
  color?: "inherit" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
}

export function AuthorCard(props: AuthorCardProps) {
  const {
    type,
    creatorName,
  } = props

  function renderCardContent() {
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

  function renderChipContent() {
    return <Button variant={"outlined"}
      startIcon={<EditRounded/>}
      style={{borderRadius: 18}}
                   size={"small"}
      color={props.color}
    >{creatorName ? creatorName : 'BastiAnn'}</Button>
  }

  switch (type) {
    case 'chip':
      return renderChipContent()
    case "card":
      return renderCardContent()
  }
}