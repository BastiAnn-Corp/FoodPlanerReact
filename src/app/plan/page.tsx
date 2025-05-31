import React from "react";
import {Base} from "@/components/Base";
import {AccordionRelease} from "@/components/Releases/AccordionRelease";
import {Grid2, Paper, Typography} from "@mui/material";

export default function Home() {

  return (
    <Base>
      <Grid2 container direction={"row"} marginBottom={5} justifyContent={"center"}>
        <Grid2 size={8}>
          <Paper elevation={2} style={{padding:10}}>
            <Typography variant={"h4"} color={"secondary"}>
              Sobre nosotros y esta App
            </Typography>
            <Typography variant={"caption"}>
              Somos Bastian y Andrea, un par de computines ociosos💻 y con demasiado tiempo sentados. La rutina nos atrapó fácilmente, pero hace más de una año decidimos tomar nuestra salud en nuestras manos 🤝! <br/>
              Entendiendo por experiencia que la alimentación influye en TANTOS ambitos de nuestra vida , desde las calorias para reducir las grasitas 💪, alimentos desinflamatorios 🐟 y la variedad de nutrientes que nos dan más animo
              🙌 y mejores defensas para el día a día 🩺; es que decidimos organizar nuestros almuerzos de la semana 👨‍🍳. Bien cuadrados para algunas cosas 🤓, juntamos recetas variadas, las clasificamos segun proteinas,
              acompañamientos y entradas, y empezamos a armar listas de compra 🛒 con los ingredientes para las recetas que elegimos para esa semana.<br/>
              Como te podrás imaginar... bien manual el asunto 📝, luego de darnos cuenta del impacto positivo de este nuevo hábito decidimos armar esta sitio 👩‍💻, no solo para hacernos la vida más fácil, sino tambien para compartirlo con nuestras amistades y ahora tu!💖
            </Typography>

            <Typography color={"primary"}><br/>Aquí encontrarás tips de uso del sitio y que se puede y podrá hacer en este sitio!💖 Juega a gusto, agrega recetas y compartelas con tus más cercanos 💏</Typography>
          </Paper>
        </Grid2>
      </Grid2>

      <AccordionRelease/>
    </Base>
    );
}
