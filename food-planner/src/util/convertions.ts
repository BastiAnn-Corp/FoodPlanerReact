import {TMeasureUnits} from "@/util/constants";
import {IConvertionIngredients, IRecipeIngredient} from "@/util/models";

interface IConvertions {
  measurementUnitInput: TMeasureUnits;
  measurementUnitOutput: TMeasureUnits;
  ratioInputToOutput: number;
}

const convertions: IConvertions[] = [
  {
    measurementUnitInput: "grs",
    measurementUnitOutput: "kg",
    ratioInputToOutput: 1000,
  },
  {
    measurementUnitInput: "kg",
    measurementUnitOutput: "grs",
    ratioInputToOutput: 0.001,
  },
  {
    measurementUnitInput: "ml",
    measurementUnitOutput: "lt",
    ratioInputToOutput: 1000,
  },
  {
    measurementUnitInput: "lt",
    measurementUnitOutput: "ml",
    ratioInputToOutput: 0.001,
  },
]
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
  let convertions: IConvertionIngredients[] = [{
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
