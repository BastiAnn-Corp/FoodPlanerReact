import {Card, CardContent, CardProps, Chip, Divider, Typography} from "@mui/material";
import {IRecipe} from "@/util/models";
import {SeasonChip} from "@/components/SeasonChip";
import {BookmarkAddedRounded, BookRounded} from "@mui/icons-material";
import {FamilyChip} from "@/components/Common/FamilyChip";

interface RecipeTitleAndTagsCardProps extends CardProps{
  recipe: IRecipe;
  color?: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
}

export function RecipeTitleAndTagsCard(props: RecipeTitleAndTagsCardProps){
  const {
    name,
    family,
    seasons,
  } = props.recipe

  return <Card {...props}>
    <CardContent {...props}>
      <Typography variant={"h4"} color={props.color} align={"center"}>
        {name}
      </Typography>
      <Divider/><br/>
        <FamilyChip family={family}/>
        {seasons.map((s,i)=>{
          return <SeasonChip key={`${props.key}-${i}`} season={s} type={"chip"} style={{marginLeft:5}}/>
        })}
    </CardContent>
  </Card>
}