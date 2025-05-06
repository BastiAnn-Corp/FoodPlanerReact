import {IToDo, listOfTodos} from "@/util/todolist";

export interface IReleases{
  version: string;
  title: string;
  changes: IToDo[];
  show: boolean
}

function fetchChanges(releaseVersion: string){
  return listOfTodos.filter((item)=> item?.releaseVersion?.includes(releaseVersion));
}

export const releases : IReleases[] = [
  {
    version: 'v0.0',
    title: 'Crear y listar Recetas e Ingredientes',
    changes: fetchChanges('v0.0'),
    show: true
  },
  {
    version: 'v0.2',
    title: 'Actualizar y eliminar recetas',
    changes: fetchChanges('v0.2'),
    show: false
  },
  {
    version: 'v0.3',
    title: 'Actualizar y eliminar ingredientes',
    changes: fetchChanges('v0.3'),
    show: false
  },
  {
    version: 'v0.4',
    title: 'Agregar cuentas con permiso de edición',
    changes: fetchChanges('v0.4'),
    show: false
  },
  {
    version: 'v1.0',
    title: 'Creación de menús',
    changes: fetchChanges('v1.0'),
    show: false
  },
  {
    version: 'v1.1',
    title: 'Recetas: Paginación y filtro por nombre',
    changes: fetchChanges('v1.1'),
    show: false
  },
  {
    version: 'v1.2',
    title: 'Ingredientes: Paginación y filtro por nombre',
    changes: fetchChanges('v1.2'),
    show: false
  },
  {
    version: 'v1.3',
    title: 'Armar carrito desde el menú',
    changes: fetchChanges('v1.3'),
    show: false
  },
  {
    version: 'v1.4',
    title: 'Ordenar carrito por tipo de ingrediente',
    changes: fetchChanges('v1.4'),
    show: false
  },
  {
    version: 'v2.0',
    title: 'Menús: ajustes por porciones',
    changes: fetchChanges('v2.0'),
    show: false
  },
  {
    version: 'v2.1',
    title: 'Carrito: ajustes por porciones',
    changes: fetchChanges('v2.1'),
    show: false
  },
  {
    version: 'v2.2',
    title: 'Ingredientes: Agregar conversiones para el carrito',
    changes: fetchChanges('v2.2'),
    show: false
  },
  {
    version: 'v2.3',
    title: 'Carrito: guardar, editar y exportar',
    changes: fetchChanges('v2.3'),
    show: false
  },
]
