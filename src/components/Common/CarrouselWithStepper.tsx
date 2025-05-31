"use client"
import {Button, Grid2, MobileStepper, StepperProps, useTheme} from "@mui/material";
import React, {useState} from "react";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@mui/icons-material";

interface ComponentWithStepperProps extends StepperProps{
  paperContent: React.ReactNode[];
  elementsToShow: 1 | 2 | 4;
}

export function CarrouselWithStepper (props: ComponentWithStepperProps) {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const sizeOfItem = () => {
    switch (props.elementsToShow) {
      case 1:
        return { xs: 8, sm: 8, md: 12, lg:12, xl:12 }
      case 2:
        return { xs: 8, sm: 8, md: 5, lg:5, xl:5 }
      default:
        return 3
    }
  }

  function toShow(index:number){
    const n = index + props.elementsToShow
    if (n > props.paperContent.length){
      return props.paperContent.slice(index,props.paperContent.length)
    }
    return props.paperContent.slice(index,n)
  }

  return <Grid2 container direction={"row"} spacing={2} paddingTop={2} justifyContent={"space-evenly"} columns={{ xs: 8, sm: 8, md: 12, lg:12, xl:12 }}>
    {toShow(activeStep).map((paper, i)=>{
      return <Grid2 size={sizeOfItem()} key={`carrousel-element-${i}`}>
        {paper}
      </Grid2>
    })}
    <Grid2 size={{ xs: 8, sm: 8, md: 12, lg:12, xl:12 }}>
      <MobileStepper
        variant="dots"
        steps={props.paperContent.length}
        position={"static"}
        activeStep={activeStep}
        sx={{flexGrow: 1 }}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === props.paperContent.length-1}>
            Siguiente
            {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Anterior
          </Button>
        }
      />
    </Grid2>
  </Grid2>

}