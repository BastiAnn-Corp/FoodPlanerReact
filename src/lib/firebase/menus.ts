import {IMenu, IMenuRecipe} from "@/util/models";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  FirestoreError,
  getDoc,
  orderBy,
  query,
  Query,
  updateDoc,
  where
} from "@firebase/firestore";
import {createDocOutput, getConvertedDocs} from "@/lib/firebase/firestore";
import {firestoreDB} from "@/lib/firebase/firebase-config";
import {TSeasons} from "@/util/constants";

const collName = 'menu'
const converter: FirebaseFirestore.FirestoreDataConverter<IMenu> = {
  toFirestore: (data: IMenu) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    snap.data() as IMenu
}

export interface IFilterMenus {
  id?: string;
  season?: TSeasons;
  persons?: number;
  creator?: string;
  publicOnly?: boolean;
  limit?: number;
  page?: number;
}

/**
 * Get all menus with optional filters
 */
export async function getMenus({
  id,
  season,
  persons,
  creator,
  publicOnly
}: IFilterMenus): Promise<IMenu[]> {
  try {
    function filterMenus(q: Query): Query {
      if (id) {
        q = query(q, where("id", '==', id));
      }
      if (season) {
        q = query(q, where("seasons", 'array-contains', season));
      }
      if (persons) {
        q = query(q, where("persons", '==', persons));
      }
      if (creator) {
        q = query(q, where("creator", '==', creator));
      }
      if (publicOnly) {
        q = query(q, where("public", '==', true));
      }
      // Order by creation would be ideal but we don't have that field
      // For now, no ordering
      return q;
    }

    const menus = await getConvertedDocs({
      coll: {collection: collName, converter},
      queryFilters: filterMenus
    })

    return menus.map((doc) => {
      return doc as IMenu
    })
  } catch (error) {
    console.error('Error getting menus:', error)
    return []
  }
}

/**
 * Get a single menu by ID
 */
export async function getMenuById(id: string): Promise<IMenu | undefined> {
  try {
    const docRef = doc(firestoreDB, collName, id)
    const snap = await getDoc(docRef)
    if (snap.exists()) {
      return snap.data() as IMenu;
    }
    return undefined
  } catch (error) {
    console.error('Error getting menu by ID:', error)
    return undefined
  }
}

export interface ICreateMenuInput {
  name?: string;
  persons: number;
  seasons: TSeasons[];
  creator: string;
  editors: string[];
  notes: string;
  public: boolean;
  recipes: IMenuRecipe[];
}

/**
 * Validate menu creation data
 */
export function validateMenuCreation(args: ICreateMenuInput): boolean {
  if (
    args.persons <= 0 ||
    args.seasons.length === 0 ||
    !args.creator
  ) {
    return false
  }
  return true
}

/**
 * Create a new menu
 */
export async function createMenu(args: ICreateMenuInput): Promise<createDocOutput> {
  try {
    if (!validateMenuCreation(args)) {
      return {
        data: null,
        error: 'Invalid menu data: persons must be > 0, at least one season required, and creator must be set'
      }
    }

    const data: IMenu = {
      name: args.name || '',
      persons: args.persons,
      seasons: args.seasons,
      creator: args.creator,
      editors: args.editors || [],
      notes: args.notes || '',
      public: args.public || false,
      recipes: args.recipes || []
    }

    const docRef = await addDoc(
      collection(firestoreDB, collName),
      data
    )

    return {data: docRef.id};
  } catch (error) {
    const err = error as FirestoreError;
    return {
      data: null,
      error: `${err.name}: ${err.message}`,
    }
  }
}

/**
 * Update an existing menu
 */
export async function updateMenu(menu: IMenu): Promise<IMenu | undefined> {
  try {
    if (!menu.id) {
      console.error('Menu ID is required for update')
      return undefined
    }

    const docRef = doc(firestoreDB, collName, menu.id);
    await updateDoc(docRef, {...menu})
    return getMenuById(menu.id)
  } catch (error) {
    const err = error as FirestoreError;
    console.error(`Error updating menu: ${err.name}: ${err.message}`);
    return undefined
  }
}

/**
 * Delete a menu
 */
export async function deleteMenu(documentId: string): Promise<string> {
  try {
    const docRef = doc(firestoreDB, collName, documentId);
    await deleteDoc(docRef)
    return `Menu eliminado`
  } catch (error) {
    const err = error as FirestoreError;
    return `Error: ${err.name}: ${err.message}`
  }
}

/**
 * Add a recipe to a menu
 */
export async function addRecipeToMenu(
  menuId: string,
  recipe: IMenuRecipe
): Promise<IMenu | undefined> {
  try {
    const menu = await getMenuById(menuId);
    if (!menu) {
      console.error('Menu not found')
      return undefined
    }

    const updatedRecipes = [...menu.recipes, recipe];
    menu.recipes = updatedRecipes;

    return updateMenu(menu);
  } catch (error) {
    console.error('Error adding recipe to menu:', error)
    return undefined
  }
}

/**
 * Remove a recipe from a menu by recipe ID
 */
export async function removeRecipeFromMenu(
  menuId: string,
  recipeId: string
): Promise<IMenu | undefined> {
  try {
    const menu = await getMenuById(menuId);
    if (!menu) {
      console.error('Menu not found')
      return undefined
    }

    const updatedRecipes = menu.recipes.filter(r => r.id !== recipeId);
    menu.recipes = updatedRecipes;

    return updateMenu(menu);
  } catch (error) {
    console.error('Error removing recipe from menu:', error)
    return undefined
  }
}

/**
 * Update recipes in a menu
 */
export async function updateMenuRecipes(
  menuId: string,
  recipes: IMenuRecipe[]
): Promise<IMenu | undefined> {
  try {
    const docRef = doc(firestoreDB, collName, menuId);
    await updateDoc(docRef, {recipes: recipes})
    return getMenuById(menuId)
  } catch (error) {
    const err = error as FirestoreError;
    console.error(`Error updating menu recipes: ${err.name}: ${err.message}`);
    return undefined
  }
}
