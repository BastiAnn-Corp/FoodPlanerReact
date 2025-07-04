import {Chip, ChipProps} from "@mui/material";
import {foodFamilies, TFoodFamily} from "@/util/constants";

interface FamilyChipProp extends ChipProps {
  family: TFoodFamily
  iconOnly?: boolean
}

export function FamilyChip (props: FamilyChipProp) {
  const fam = foodFamilies.find((o)=> o.id === props.family)

  return <Chip {...props}
    variant={"filled"}
    label={!props.iconOnly ? `${fam?.icon} ${fam?.name}` : `${fam?.icon} ${fam?.name}`}
  />;
}