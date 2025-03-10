import {IFoodFamily} from "@/util/models";

export const seasons = [
  {
    key: "summer",
    name: "Verano",
    color: "error"
  },
  {
    key: "winter",
    name: "Invierno",
    color: "info"
  },
  {
    key: "spring",
    name: "Primavera",
    color: "success"
  },
  {
    key: "autum",
    name: "Otoño",
    color: "warning"
  }
]

export const foodFamilies: IFoodFamily[] = [
  {
    name: "Sopas y Cremas",
    id: "starters",
    icon: "🥣"
  },
  {
    name: "Verduras",
    id: "veggies",
    icon: "🥗"
  },
  {
    name: "Carbohidratos",
    id: "carbs",
    icon: "🍚"
  },
  {
    name: "Pescados y Mariscos",
    id: "fish",
    icon: "🐟"
  },
  {
    name: "Aves",
    id: "birds",
    icon: "🐓",
  },
  {
    name: "Carnes",
    id: "meat",
    icon: "🐮"
  },
  {
    name: "Legumbres",
    id: "beans",
    icon: "🌱"
  },
  {
    name: "Postres",
    id: "desserts",
    icon: "🍓"
  },
  {
    name: "Otro",
    id: "others",
    icon: "🍽️"
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