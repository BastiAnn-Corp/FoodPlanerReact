import {Button, Chip, Paper, Snackbar, Typography} from "@mui/material";
import {potText, robotCookText} from "@/util/convertions";
import {Google} from "@mui/icons-material";

export const tipsOfUsage = [
  <Paper key='tip-of-robot' elevation={3} style={{padding:10}}>
    <Typography color={"info"} align={"center"} variant={"h6"}>
      <b>Instrucciones para robot de cocina</b>
      <br/>
      <Chip
        color={"info"}
        size={"medium"}
        label={robotCookText({
          sc_time: '05:30',
          sc_speed: 3,
          sc_temp_in_celcius: 80,
          instructions: ""
        })}
      />
      <br/>
    </Typography>

    <Typography><br/>
      En las instrucciones de receta encontrarás el elemento de arriba que puedes leer de la siguiente forma:<br/>
      - 🕑 tiempo en minutos y segundos (ej: 5 minutos y 30 segundos)<br/>
      - 🔄 Velocidad de aspas, tambien sirve para una licuadora! va de 0 a 10, donde 10 es el TURBO<br/>
      - 🌡️ Temperatura en grados celcius, va desde 0 hasta 130
    </Typography>
  </Paper>,
  <Paper key='tip-of-mahcines' elevation={3} style={{padding:10}}>
    <Typography color={"warning"} align={"center"} variant={"h6"}>
      <b>Instrucciones con máquinas de cocina</b>
      <br/>
      <Chip
        color={"warning"}
        size={"medium"}
        label={potText({
          pot_program: "airfryer",
          pot_time: "00:15:00",
          pot_temp: 2,
          instructions: ""
        })}
      />
      <br/>
    </Typography>

    <Typography><br/>
      En las instrucciones de receta encontrarás el elemento de arriba que puedes leer de la siguiente forma:<br/>
      - Tipo de máquina para: asar, vapor, airfryer, sofrito, sopa, hervir o coccion lenta<br/>
      - 🕑 Tiempo, ej: 0hrs, 15 minutos, 0 segundos<br/>
      - Temperatura en 3 niveles: Bajo 🔥◼️◼️, Medio 🔥🔥️◼️ y Alto 🔥🔥️🔥️
    </Typography>
  </Paper>
  ,
  <Paper key='tip-of-login' elevation={3} style={{padding:10}}>
    <Typography color={"primary"} align={"center"} variant={"h6"}>
      <b>Inciar sesión con</b>
      <br/>
      tu Cuenta Google
      <br/>
      <Button color={"warning"} variant={"contained"}
        startIcon={<Google/>}
      >
        Conectarse
      </Button>
    </Typography>

    <Typography><br/>
      Para ver recetas y menús publicos no es necesario iniciar sesión, pero para crear recetas, menús y carritos si será necesario que entres con tu cuenta gmail
    </Typography>
  </Paper>
]