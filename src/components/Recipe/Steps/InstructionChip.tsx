import {Chip, ChipProps, Typography} from "@mui/material";
import {IRecipeStep} from "@/util/models";
import React from "react";
import {potTempToIcons} from "@/util/convertions";
import {potPrograms} from "@/util/constants";

interface InstructionChipProps extends ChipProps{
  step: IRecipeStep;
  type: 'robot' | 'machine'
  editing?: {
    active: boolean,
    updateStep: (step: IRecipeStep) => void,
  }
}

export function InstructionChip(props: InstructionChipProps) : React.ReactNode{
  const {
    sc_time,
    sc_temp_in_celcius,
    sc_speed,
    pot_temp,
    pot_time,
    pot_program
  } = props.step

  function renderRobot () : React.ReactNode{
    return <Typography variant={"caption"}>
      <Chip
        label={`🕑${sc_time}`}
        color={"info"}
        style={{marginRight: 5}}
      />
      <Chip
        label={`🔄${sc_speed}`}
        color={"info"}
        style={{marginRight: 5}}
      />
      <Chip
        label={`🌡️${sc_temp_in_celcius} °C`}
        color={"info"}
      />
    </Typography>
  }

  function renderMachine() : React.ReactNode {
    const potProgram= potPrograms.find((p)=> p.id == pot_program);
    return <Typography variant={"caption"}>
      <b>{`${potProgram?.name}: `}</b>
      <Chip
        label={`🕑${pot_time}`}
        color={"warning"}
        style={{marginRight: 5}}
      />
      <Chip
        label={`${potTempToIcons(pot_temp!)}`}
        color={"warning"}
      />
    </Typography>
  }

  switch (props.type) {
    case "machine":
      if (pot_time !== undefined && pot_program !== undefined && pot_temp !== undefined){
        return renderMachine()
      } else { return <></> }
    case "robot":
      if (sc_time !== undefined && sc_speed !== undefined && sc_temp_in_celcius !== undefined){
        return renderRobot()
      } else { return <></> }
  }
}