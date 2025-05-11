"use client"
import {IntRange, IRecipeStep} from "@/util/models";
import {
  Button,
  Checkbox, FormControl,
  Grid2,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from "@mui/material";
import {useState} from "react";
import {potPrograms, TPotProgram} from "@/util/constants";

interface RecipeStepFormProps {
  saveStep: (step: IRecipeStep) => void;
}
export function RecipeStepForm({saveStep}:RecipeStepFormProps){
  const [showcookRobot, setShowcookRobot] = useState(false);
  const [showcookPot, setShowcookPot] = useState(false);

  const [instructions, setInstructions] = useState<string>("");
  const [robotTime, setRobotTime] = useState<string>('00:00');
  const [robotSpeed, setRobotSpeed] = useState<number>(0);
  const [robotTemp, setRobotTemp] = useState<number>(0);
  const [potTime, setPotTime] = useState<string>('00:00:00');
  const [potTemp, setPotTemp] = useState<1|2|3>(3);
  const [potProgram, setPotProgram] = useState<string|null>(null);

  const handleSave = () => {
    let step : IRecipeStep = {
      instructions,
    }
    if (showcookRobot){
      step = {
        ...step,
        sc_time:robotTime,
        sc_speed: robotSpeed as IntRange<0, 10>,
        sc_temp_in_celcius: robotTemp as IntRange<0, 120>,
      }
    }
    if (showcookPot) {
      step = {
        ...step,
        pot_time: potTime,
        pot_program:potProgram as TPotProgram,
        pot_temp: potTemp
      }
    }
    saveStep(step)
    setInstructions("")
    setRobotSpeed(0)
    setRobotTemp(0)
    setRobotTime("00:00")
    setPotProgram(null)
    setPotTemp(3)
    setPotTime("00:00:00")
    setShowcookPot(false)
    setShowcookRobot(false)
  }
  return <Paper elevation={2} style={{padding: 10, margin:5}}>
    <Grid2 container direction={"row"} spacing={2}>
    <Grid2 size={12}>
      <TextField size={"small"}
                 fullWidth
                 label={'Nueva instrucción...'}
                 multiline
                 minRows={3}
                 value={instructions}
                 onChange={(e)=>{setInstructions(e.target.value)}}
      />
    </Grid2>
    <Grid2 size={showcookRobot || showcookPot ? 12 : 6}>
      <Typography fontSize={"small"}>
      <Checkbox
        size={"small"}
        checked={showcookRobot}
        onClick={()=>{setShowcookRobot(!showcookRobot)}}
      />
        Robot de cocina
      </Typography>
      {showcookRobot ?
        <Grid2 container spacing={3} justifyContent={"space-between"} columns={{ xs: 4, sm: 4, md: 12, lg:12, xl:12 }}>
          <Grid2 size={4}>
            <TextField
              label={"🕑 Tiempo"}
              fullWidth
              size={"small"}
              value={robotTime}
              type={"string"}
              disabled={!showcookRobot}
              onChange={(e)=>{setRobotTime(e.target.value)}}
            />
          </Grid2>

          <Grid2 size={4}>
            <TextField
              label={"🔄 Velocidad"}
              size={"small"}
              fullWidth
              value={robotSpeed}
              disabled={!showcookRobot}
              type={"number"}
              onChange={(e)=>{
                setRobotSpeed(
                  Number(e.target.value) > -1 && Number(e.target.value) < 11 ?
                    Number(e.target.value) : 0
                )
              }}
            />
          </Grid2>

          <Grid2 size={4}>
            <TextField
              label={"️🌡️ Temperatura"}
              size={"small"}
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="end">°C</InputAdornment>,
                },
              }}
              fullWidth
              value={robotTemp}
              type={"number"}
              disabled={!showcookRobot}
              onChange={(e)=>{
                setRobotTemp(
                  Number(e.target.value) > -1 && Number(e.target.value) < 131 ?
                    Number(e.target.value) : 0
                )
              }}
            />
          </Grid2>

        </Grid2>
        : <></>}
    </Grid2>
    <Grid2 size={showcookRobot || showcookPot ? 12 : 6}>
      <Typography  fontSize={"small"}>
        <Checkbox
          size={"small"}
          checked={showcookPot}
          onClick={()=>{setShowcookPot(!showcookPot)}}
        />
        Otra máquina
      </Typography>
      {showcookPot ?
        <Grid2 container spacing={3} justifyContent={"space-between"} columns={{ xs: 4, sm: 4, md: 12, lg:12, xl:12 }}>
          <Grid2 size={4}>
            <FormControl fullWidth>
              <InputLabel id={"pot-program-select-label"}>Programa</InputLabel>
              <Select
                labelId="pot-program-select-label"
                label={"Programa"}
                fullWidth
                size={"small"}
                value={potProgram}
                disabled={!showcookPot}
                onChange={(e)=>{setPotProgram(e.target.value)}}
              >
                {potPrograms.map((item, i)=>{
                  return (<MenuItem value={item.id}
                                    key={`instriction-pot-program-${i}`}
                  >{item.name}</MenuItem>)
                })}
              </Select>
            </FormControl>

          </Grid2>
          <Grid2 size={4}>
            <TextField
              label={"🕑 Tiempo"}
              fullWidth
              size={"small"}
              value={potTime}
              type={"string"}
              disabled={!showcookPot}
              onChange={(e)=>{setPotTime(e.target.value)}}
            />
          </Grid2>

          <Grid2 size={4}>
            <FormControl fullWidth>
              <InputLabel id={"pot-temp-select-label"}>🌡️ Temperatura</InputLabel>
              <Select
                fullWidth
                labelId={"pot-temp-select-label"}
                label={"️🌡️ Temperatura"}
                size={"small"}
                value={potTemp}
                disabled={!showcookPot}
                onChange={(e)=>{setPotTemp(Number(e.target.value) as 1|2|3)}}
              >
                <MenuItem value={1}>🔥◼️◼️ Baja </MenuItem>
                <MenuItem value={2}>🔥🔥◼️ Media </MenuItem>
                <MenuItem value={3}>🔥🔥🔥 Alta </MenuItem>
              </Select>
            </FormControl>
          </Grid2>

        </Grid2>
        : <></>}
    </Grid2>
    <Grid2 size={12}>
      <Button
        fullWidth
        variant="contained"
        disabled={instructions.length === 0}
        onClick={()=>{handleSave()}}
      >
      Agregar instrucción
    </Button></Grid2>
  </Grid2></Paper>
}