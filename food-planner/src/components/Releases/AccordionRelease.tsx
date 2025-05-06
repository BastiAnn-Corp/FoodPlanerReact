import {IReleases, releases} from "@/util/releases";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Chip,
  Grid2, IconButton,
  List,
  ListItem, ListItemAvatar, ListItemText,
  Typography
} from "@mui/material";
import {CheckCircle, KeyboardArrowDownRounded} from "@mui/icons-material";
import {IToDo} from "@/util/todolist";
import React from "react";

export function AccordionRelease(){
  const doneReleases = releases.filter(release => release.show)
  const todoReleases = releases.filter(release => !release.show).slice(0,5)

  function releaseAccordion (release: IReleases, done: boolean, index: number){
    const key = `${done ? 'done' : 'future'}-release-accordion-${index}`
    return <Accordion key={key}>
      <AccordionSummary
        expandIcon={<KeyboardArrowDownRounded />}
        id={`summary-${key}`}
      >
        <Typography variant={"h6"}>
          <Chip size={"medium"} color={done ? "success" : "default"} label={release.version.toUpperCase()}/>
          {` ${release.title}`}
        </Typography>
      </AccordionSummary>
      <AccordionDetails id={`details-${key}`}>
        <List dense>
          {release.changes.map((item, index)=>{
            return changeListItem(item,index)
          })}
        </List>
      </AccordionDetails>
    </Accordion>
  }

  function changeListItem(change: IToDo, index:number){
    const { icon, title, done, releaseVersion} = change
    return <ListItem
      secondaryAction={
        <IconButton edge="end">
          {done ? <CheckCircle color={"success"}/> : <></>}
        </IconButton>
      }
    >
      <ListItemAvatar>
        <Avatar
          key={`change-${releaseVersion}-${index}`}
          sx={{height: 40, width: 40}}
          variant={"square"}
        >{icon}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
      />
    </ListItem>
  }

  return <Grid2 container direction={"row"} spacing={2} paddingBottom={10} columns={{ xs: 6, sm: 6, md: 12, lg:12, xl:12 }}>
    <Grid2 size={6}>
      <Typography variant={"h4"} color={"primary"}>Cosas que funcionan</Typography>
      {doneReleases.map((release, index)=>{
        return releaseAccordion(release, true, index)
      })}
    </Grid2>
    <Grid2 size={6}>
      <Typography variant={"h4"} color={"textDisabled"}>Pal futuro</Typography>
      {todoReleases.map((release, index)=>{
        return releaseAccordion(release, false, index)
      })}
    </Grid2>
  </Grid2>
}