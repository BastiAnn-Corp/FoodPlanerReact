import {Chip, Typography} from "@mui/material";

export function SeasonChip(
  {season, size = "small", type = "chip"}:
    {season: string, size?: "small"|"meidum", type?: "chip" | "text"}
) {
  if (season === 'winter'){
    return type==='chip' ?
      <Chip label={"Invierno"} color={'info'}/> :
      <Typography variant="caption" color="info">Invierno </Typography>
  } else if (season === 'summer'){
    return type==='chip' ?
      <Chip label={"Verano"} color={'error'}/> :
        <Typography variant="caption" color="error">Verano </Typography>
  } else if (season === 'spring'){
    return type==='chip' ?
      <Chip label={"Primavera"} color={'success'}/> :
        <Typography variant="caption" color="success">Primavera </Typography>
  } else if (season === 'autum'){
    return type==='chip' ?
      <Chip label={"Otoño"} color={'warning'}/> :
        <Typography variant="caption" color="warning">Otoño </Typography>
  }
}