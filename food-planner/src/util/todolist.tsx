import {
  AddCircle,
  DeleteRounded, FilterAltRounded, KeyRounded,
  ListAltRounded, LoginRounded, MenuBookRounded,
  UpdateRounded
} from "@mui/icons-material";
import {ReactElement} from "react";


export interface IToDo{
  title: string;
  detail?: string;
  done: boolean;
  icon?: ReactElement;
  releaseVersion: string;
}

export const listOfTodos : IToDo[] = [
  {
    title: 'Listar ingredientes',
    done: true,
    icon: <ListAltRounded/>,
    releaseVersion: 'v0.0.1',
  },
  {
    title: 'Listar recetas',
    done: true,
    icon: <ListAltRounded/>,
    releaseVersion: 'v0.0.3',
  },
  {
    title: 'Agregar ingredientes',
    detail: 'Agregar ingrediente a la lista, incluyendo qué tipo de ingrediente es',
    done: true,
    icon: <AddCircle/>,
    releaseVersion: 'v0.0.0',
  },
  {
    title: 'Crear recetas',
    detail: 'Agregar recetas, con porciones, categoria y estación',
    done: true,
    icon: <MenuBookRounded/>,
    releaseVersion: 'v0.0.2',
  },
  {
    title: 'Agregar filtro por categoria a lista de ingredientes',
    done: true,
    icon: <FilterAltRounded/>,
    releaseVersion: 'v0.0.1',
  },
  {
    title: 'Agregar filtro por categoría y estación a lista de recetas',
    done: true,
    icon: <FilterAltRounded/>,
    releaseVersion: 'v0.0.3',
  },
  {
    title: 'Eliminar receta',
    done: false,
    icon: <DeleteRounded/>,
    releaseVersion: 'v0.2.0',
  },
  {
    title: 'Actualizar ingredientes en receta',
    done: false,
    icon: <UpdateRounded/>,
    releaseVersion: 'v0.2.1',
  },
  {
    title: 'Actualizar intrucciones en receta',
    done: false,
    icon: <UpdateRounded/>,
    releaseVersion: 'v0.2.1',
  },
  {
    title: 'Actualizar detalles en receta',
    done: false,
    icon: <UpdateRounded/>,
    releaseVersion: 'v0.2.1',
  },
  {
    title: 'Eliminar ingrediente',
    done: false,
    icon: <DeleteRounded/>,
    releaseVersion: 'v0.3.0',
  },
  {
    title: 'Actualizar detalles ingrediente',
    done: false,
    icon: <UpdateRounded/>,
    releaseVersion: 'v0.3.1',
  },
  {
    title: 'Actualizar conversiones ingrediente',
    done: false,
    icon: <UpdateRounded/>,
    releaseVersion: 'v0.3.2',
  },
  {
    title: 'Crear login/logout',
    done: false,
    icon: <LoginRounded/>,
    releaseVersion: 'v0.4.0',
  },
  {
    title: 'Logica de permisos en formularios recetas',
    done: false,
    icon: <KeyRounded/>,
    releaseVersion: 'v0.4.1',
  },
  {
    title: 'Logica de permisos en formularios ingredientes',
    done: false,
    icon: <KeyRounded/>,
    releaseVersion: 'v0.4.2',
  },
  {
    title: 'Listar menús',
    done: false,
    icon: <ListAltRounded/>,
    releaseVersion: 'v1.0.0',
  },
]