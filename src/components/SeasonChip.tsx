import {Chip, ChipProps, ChipPropsSizeOverrides, Typography} from "@mui/material";
import {OverridableStringUnion} from "@mui/types";

interface SeasonChipProps extends ChipProps {
season: string,
  type?: "chip" | "text"
}
export function SeasonChip(
  props: SeasonChipProps
) {
  const {
  season, size, type = "chip"
  } = props
  if (season === 'winter'){
    return type==='chip' ?
      <Chip {...props} label={"Invierno"} color={'info'} size={size}/> :
      <Typography variant="caption" color="info">Invierno </Typography>
  } else if (season === 'summer'){
    return type==='chip' ?
      <Chip {...props}  label={"Verano"} color={'error'}  size={size}/> :
        <Typography variant="caption" color="error">Verano </Typography>
  } else if (season === 'spring'){
    return type==='chip' ?
      <Chip {...props}  label={"Primavera"} color={'success'} size={size}/> :
        <Typography variant="caption" color="success">Primavera </Typography>
  } else if (season === 'autum'){
    return type==='chip' ?
      <Chip {...props}  label={"Otoño"} color={'warning'} size={size}/> :
        <Typography variant="caption" color="warning">Otoño </Typography>
  }
}