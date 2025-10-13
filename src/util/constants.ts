import {ICategory} from "@/util/models";
export type TSeasons = "summer" | "winter" | "spring" | "autum"
export type TFoodFamily = "starters" | "veggies" | "carbs" |
  "fish" | "birds" | "meat" | "beans" | "desserts" | "bakery" |
  "others"
export type TPotProgram = 'asar' | 'vaporera' | 'airfryer' | 'sofrito' | 'sopa' | 'hervir' | 'coxionlenta' | 'liquadora' | 'procesadora' | 'amasadora'
export type TAisle = "lacteos-y-quesos"| "frutas-y-verduras" | "carniceria" | "fiambreria-y-encurtidos" | "pescaderia" |
  "bebidas-aguas-y-jugos" | "congelados" | "despensa" | "snack-dulces" | "panaderia-y-pasteleria" |
  "snack salados" | "botilleria" | "none"

export type TMeasureUnits = "unidad" | "grs" | "ml" | "kg" | "lt" | "cdta" | "cda" | "tz" | "-"
export type TDaysMenu = "lunes" | "martes" | "miercoles" | "jueves" | "viernes" | "sabado" | "domingo"
export type TRecipeSection = "colacion" | "desayuno" | "almuerzo" | "once" | "cena"

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

export const foodFamilies: ICategory[] = [
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
    name: "Pastelería",
    id: "bakery",
    icon: "🍰"
  },
  {
    name: "Otro",
    id: "others",
    icon: "🍽️"
  },
]

export const potPrograms: ICategory[] = [
  {
    name: 'Asar',
    id: 'asar'
  },{
    name: 'Vaporera',
    id: 'vaporera'
  },{
    name: 'Freidora de Aire',
    id: 'airfryer'
  }, {
    name: 'Sopa',
    id: 'sopa'
  },{
    name: 'Hervir',
    id: 'hervir'
  },{
    name: 'Cocción Lenta',
    id: 'coxionlenta'
  },{
    name: 'Liquadora',
    id:  'liquadora',
  },{
    name: 'Procesadora',
    id: 'procesadora'
  },{
    name: 'Amasadora',
    id: 'amasadora'
  }
]

export const marketAisles: ICategory[] = [
  {
    name: "Lácteos y Quesos",
    id: "lacteos-y-quesos",
    icon: "🧀",
  },
  {
    name: "Frutas y Verduras",
    id: "frutas-y-verduras",
    icon: "🥕",
  },
  {
    name: "Carnicería",
    id: "carniceria",
    icon: "🥩",
  },
  {
    name: "Fiambreria y Encurtidos",
    id: "fiambreria-y-encurtidos",
    icon: "🍖",
  },
  {
    name: "Pescaderia",
    id: "pescaderia",
    icon: "🐟",
  },
  {
    name: "Bebidas, Aguas y Jugos",
    id: "bebidas-aguas-y-jugos",
    icon: "🧃",
  },
  {
    name:"Congelados",
    id:"congelados",
    icon:"❄️",
  },
  {
    name:"Despensa",
    id:"despensa",
    icon:"🥫",
  },
  {
    name:"Aliño",
    id:"alino",
    icon:"🌿",
  },
  {
    name:"Panaderia y Pasteleria",
    id:"panaderia-y-pasteleria",
    icon:"🍞",
  },
  {
    name:"Snack Dulces",
    id:"snack-dulces",
    icon:"🍫",
  },
  {
    name:"Snack Salados",
    id:"snack salados",
    icon:"🍟",
  },
  {
    name:"Botilleria",
    id:"botilleria",
    icon:"🍾",
  },
  {
    name:"Sin categoría",
    id:"none",
    icon:"🛒",
  },
]

export const measuerementUnits: ICategory[] = [
  {
    name: "Unidad",
    id: "unidad",
  },
  {
    name: "Gramos",
    id: "grs",
  },
  {
    name: "Mililitro",
    id: "ml",
  },
  {
    name: "Kilogramo",
    id: "kg",
  },
  {
    name: "Litro",
    id: "lt",
  },
  {
    name: "Cucharadita",
    id: "cdta",
  },
  {
    name: "Cucharada",
    id: "cda"
  },
  {
    name: "Taza",
    id: "tz"
  },
  {
    name: "a gusto",
    id: "-"
  }
]

export const creatorEmails = ['andrea.benavidesj@gmail.com']
export const menuDays: ICategory[] = [
  {
    id: 'lunes',
    name: 'Lunes',
  },{
    id: 'martes',
    name: 'Martes',
  },{
    id: 'miercoles',
    name: 'Miercoles',
  },{
    id: 'jueves',
    name: 'Jueves',
  },{
    id: 'viernes',
    name: 'Viernes',
  },{
    id: 'sabado',
    name: 'Sabado',
  },{
    id: 'domingo',
    name: 'Domingo',
  },
]

export const recipeSections: ICategory[] = [
  {id:'desayuno', name:'Desayuno'},
  {id:'colacion', name:'Colación'},
  {id:'almuerzo', name:'Almuerzo'},
  {id:'once', name:'Once'},
  {id:'cena', name:'Cena'},
]
