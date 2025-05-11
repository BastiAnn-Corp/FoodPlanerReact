import {TMeasureUnits} from "@/util/constants";
import {IConvertionIngredients, IRecipeStep} from "@/util/models";

interface IConvertionOnIngredient {
  measurementUnitInput: TMeasureUnits;
  quantityInput: number;
  ingredientConvertions: IConvertionIngredients[];
}
export function convertionsOnIngredient({
  measurementUnitInput = 'unidad',
  quantityInput = 1,
  ingredientConvertions = []
}:IConvertionOnIngredient): IConvertionIngredients[] {
  const convertions: IConvertionIngredients[] = [{
    quantity: quantityInput,
    unit: measurementUnitInput
  }]
  if (ingredientConvertions.length === 0){
    return convertions
  }
  const convertionBase = ingredientConvertions.find(
    (item)=> item.unit === measurementUnitInput
  );
  let convertionRate: number = 1
  if (convertionBase){
    convertionRate = convertionBase.quantity / quantityInput
  } else if (measurementUnitInput === "unidad") {
    convertionRate = quantityInput
  }

  const otherConvertions = ingredientConvertions.filter(
    (item)=> item.unit !== measurementUnitInput
  );
  if (otherConvertions.length > 0){
    otherConvertions.forEach(({quantity, unit})=> {
      convertions.push({
        unit: unit,
        quantity: quantity * convertionRate,
      })
    })
  }
  return convertions
}

export function potTempToIcons (temp: number){
  let text = ''
  if (temp === 1){
    text = '🔥◼️◼️'
  } else if (temp === 2){
    text = '🔥🔥️◼️'
  } else if (temp === 3){
    text = '🔥🔥️🔥️'
  }
  return text
}

export function potText (step: IRecipeStep):string {
  const {
    pot_program,
    pot_time,
    pot_temp,
  } = step
  if (pot_time !== undefined && pot_program !== undefined && pot_temp !== undefined){
    return `${pot_program}: 🕑${pot_time} / ${potTempToIcons(pot_temp)}`;
  } else {
    return ''
  }
}

export function robotCookText (step: IRecipeStep):string {
  const {
    sc_time,
    sc_speed,
    sc_temp_in_celcius,
  } = step
  if (sc_time !== undefined && sc_speed !== undefined && sc_temp_in_celcius !== undefined){
    return `🕑${sc_time} / 🔄${sc_speed} /🌡️${sc_temp_in_celcius} °C`;
  } else {
    return ''
  }
}