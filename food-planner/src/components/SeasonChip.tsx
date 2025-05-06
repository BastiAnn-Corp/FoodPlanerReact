import {Chip, ChipPropsSizeOverrides, Typography} from "@mui/material";
import {OverridableStringUnion} from "@mui/types";

interface SeasonChipProps {
season: string,
  size?: OverridableStringUnion<'small' | 'medium', ChipPropsSizeOverrides>;
  type?: "chip" | "text"
}
export function SeasonChip(
  {season, size = "small", type = "chip"}: SeasonChipProps

) {
  if (season === 'winter'){
    return type==='chip' ?
      <Chip label={"Invierno"} color={'info'} size={size}/> :
      <Typography variant="caption" color="info">Invierno </Typography>
  } else if (season === 'summer'){
    return type==='chip' ?
      <Chip label={"Verano"} color={'error'}  size={size}/> :
        <Typography variant="caption" color="error">Verano </Typography>
  } else if (season === 'spring'){
    return type==='chip' ?
      <Chip label={"Primavera"} color={'success'} size={size}/> :
        <Typography variant="caption" color="success">Primavera </Typography>
  } else if (season === 'autum'){
    return type==='chip' ?
      <Chip label={"Otoño"} color={'warning'} size={size}/> :
        <Typography variant="caption" color="warning">Otoño </Typography>
  }
}