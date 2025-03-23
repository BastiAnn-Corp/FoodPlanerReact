"use client"
import {
  Alert,
  Button, Card, CardActions, CardContent,
  Chip, CircularProgress, Container,
  Grid2, MenuItem, Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from "@mui/material";
import React, {useEffect} from "react";
import {IConvertionIngredients} from "@/util/models";
import {marketAisles, TAisle, TMeasureUnits} from "@/util/constants";
import {IngredientConvertionForm} from "@/components/Ingredients/ingredientConvertionForm";
import {createIngredient} from "@/lib/firebase/ingredients";

interface ModalAddIngredientProps {
  isOpen: boolean;
  handleClose: () => void;
}

export function ModalAddIngredient({ isOpen, handleClose }: ModalAddIngredientProps) {
  const [name, setName] = React.useState<string>("");
  const [aisles, setAisles] = React.useState<TAisle[]>([]);
  const [convertions, setConvertions] = React.useState<IConvertionIngredients[]>([]);
  const [message, setMessage] = React.useState<{severity: 'success' | 'error', message?: string}>({severity: "success"});
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(()=>{},[aisles, convertions, message])

  useEffect(()=>{
    setName("")
    setAisles([])
    setConvertions([])
    setMessage({severity: "success"})
  },[isOpen])

  async function create () {
    setIsLoading(true);
    setMessage({severity: "success"});
    const {error} = await createIngredient({
      name,
      aisles,
      convertions
    })
    setMessage({
      severity: error ? "error" : "success",
      message: error ? error : "Ingrediente guardado!"
    })
    setIsLoading(false);
  }
  const handleAisles = (event: SelectChangeEvent<typeof aisles>) => {
    const {
      target: { value },
    } = event;
    setAisles(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const addConvertion = (q: number, u: TMeasureUnits) => {
    const filteredMeasures = convertions.filter(({unit})=> unit !== u)
    filteredMeasures.push({
      unit: u, quantity: q
    })
    setConvertions(filteredMeasures)
  }

  return <Modal open={isOpen} onClose={handleClose}>
    <Container maxWidth={"sm"} style={{paddingTop:5}}>
      <Card >
        <CardContent>
          <Typography variant={"h4"} color={"primary"}> Agregar nuevo ingrediente </Typography>
          <Grid2 container direction={"row"} spacing={2}>
            <Grid2 size={12}>
              <Typography>Nombre Ingrediente</Typography>
              <TextField
                type={"text"}
                value={name}
                size={"small"}
                onChange={(e)=>{setName(e.target.value)}}
                fullWidth
              />
            </Grid2>
            <Grid2 size={12}>
              <Typography>Pasillo</Typography>
              <Select
                variant={"outlined"}
                multiple
                fullWidth
                value={aisles}
                onChange={handleAisles}
              >{
                marketAisles.map(({id,name,icon}, index)=>{
                  return <MenuItem
                    value={id as TAisle}
                    key={`aisle-${id}-${index}`}
                  >
                    {`${icon} ${name}`}
                  </MenuItem>;
                })
              }</Select>
            </Grid2>
            <Grid2 size={12}>
              <Typography>Converciones de unidad</Typography>
              {convertions.length > 0 ? convertions.map(({unit, quantity})=> {
                return <Chip
                  key={unit}
                  variant={"outlined"}
                  size={"small"}
                  label={`${quantity} ${unit}`}
                  style={{marginRight:5}}
                />
              }) : <></>}
            </Grid2>
            <Grid2 size={12}>
                <IngredientConvertionForm addConvertion={addConvertion} index={convertions.length}/>
            </Grid2>
          </Grid2>
          {message.message ? <Grid2 size={12}>
            <Alert severity={message.severity}>{message.message}</Alert>
          </Grid2> : <></>}
        </CardContent>
        <CardActions>
          <Button fullWidth
                  variant={"contained"}
                  color={"inherit"}
                  onClick={handleClose}>
          Atrás
        </Button>
          <Button
            fullWidth
            variant={"contained"}
            disabled={isLoading || (name === "" && aisles.length === 0 && convertions.length === 0)}
            onClick={()=>{create()}}
          >
            {isLoading ? <CircularProgress/> : "Guardar"}
          </Button>
        </CardActions>
      </Card>
    </Container>

  </Modal>
}