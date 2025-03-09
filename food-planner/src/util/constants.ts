import {IFoodFamily} from "@/util/models";

export const seasons = [
  {
    key: "summer",
    name: "Verano",
  },
  {
    key: "winter",
    name: "Invierno",
  },
  {
    key: "spring",
    name: "Primavera",
  },
  {
    key: "autum",
    name: "Otoño",
  }
]

export const foodFamilies: IFoodFamily[] = [
  {
    name: "Sopas y Cremas",
    id: "starters",
  },
  {
    name: "Verduras",
    id: "veggies",
  },
  {
    name: "Carbohidratos",
    id: "carbs",
  },
  {
    name: "Proteinas",
    id: "proteins",
    subcategories: [
      {
        name: "Pescados y Mariscos",
        id: "fish",
      },
      {
        name: "Aves",
        id: "birds",
      },
      {
        name: "Carnes",
        id: "meat",
      },
      {
        name: "Beans",
        id: "beans",
      },
    ]
  },
  {
    name: "Postres",
    id: "desserts",
  },
  {
    name: "Otro",
    id: "others",
  },
]

export const potPrograms: IFoodFamily[] = [
  {
    name: 'Asar',
    id: 'asar'
  },{
    name: 'Vaporera',
    id: 'vaporera'
  },{
    name: 'Freidora de Aire',
    id: 'airfryer'
  },{
    name: 'Sofrito',
    id: 'sofrito'
  }
]