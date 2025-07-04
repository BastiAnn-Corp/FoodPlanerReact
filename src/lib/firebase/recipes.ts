import {IRecipe, IRecipeIngredient, IRecipeStep} from "@/util/models";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  FirestoreError,
  getDoc,
  orderBy,
  query,
  Query, updateDoc,
  where
} from "@firebase/firestore";
import {createDocOutput, getConvertedDocs} from "@/lib/firebase/firestore";
import {firestoreDB} from "@/lib/firebase/firebase-config";
import {TFoodFamily, TSeasons} from "@/util/constants";
import {error} from "next/dist/build/output/log";

const collName = 'recipe'
const converter : FirebaseFirestore.FirestoreDataConverter<IRecipe> =  {
  toFirestore: (data: IRecipe) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    snap.data() as IRecipe
}

export interface IFilterRecipes {
  id?: string;
  name?: string;
  season?: string;
  family?: string;
  limit?: number;
  page?: number;
}

export async function getAllRecipesIds() {
  try {
    const recipes = await getConvertedDocs({
      coll : {collection: collName, converter}})
    return recipes.map((doc)=>{
      const recipe = doc.data() as IRecipe
      return {
        params: {
          id: recipe.id,
        },
      };
    })
  } catch (error) {
    return []
  }
}

export async function getRecipeById(id: string): Promise<IRecipe|undefined> {
  try {
    const docRef = doc(firestoreDB, collName, id)
    const snap = await getDoc(docRef)
    console.debug(snap.data())
    return snap.data() as IRecipe;
  } catch (error) {
    return undefined
  }
}

export async function getRecipes({id, name, season, family} : IFilterRecipes) : Promise<IRecipe[]> {
  try{
    function filterRecipes (q:Query) : Query {
      if(name){
        q = query(q, where("id", '==', id));
      }
      if(season){
        q = query(q, where("seasons", 'array-contains', season.toLowerCase()));
      }
      if(family){
        q = query(q, where("family", '==', family.toLowerCase()));
      }
      q = query(q, orderBy("name"));
      return q;
    }
    const recipes = await getConvertedDocs({
      coll : {collection: collName, converter}, queryFilters : filterRecipes})
    return recipes.map((doc)=>{
      return doc as IRecipe
    })
  } catch (error) {
    return []
  }
}


export interface ICreateRecipeInput {
  name: string;
  portions: number;
  seasons: TSeasons[];
  family: TFoodFamily;
  ingredients_list: Array<IRecipeIngredient>;
  steps: Array<IRecipeStep>;
  notes: string;
  creator: string;
  editors: string[];
}

export function validateRecipeCreation(args: ICreateRecipeInput) : boolean {
  if(
    args.name.length === 0 || args.portions === 0 || args.seasons.length === 0
    || args.ingredients_list.length === 0 || args.steps.length === 0
  ){
    return false
  } else {
    return true
  }
}

export async function createRecipe(args: ICreateRecipeInput): Promise<createDocOutput> {
  try {
    const data : IRecipe = args
    const docRef = await addDoc(
      collection(firestoreDB, collName),
      data
    )
    return {data: docRef.id};
  } catch(error) {
    const err = error as FirestoreError;
    return {
      data: null,
      error: `${err.name}: ${err.message}`,
    }
  }
}

export async function deleteRecipe(documentId:string): Promise<string> {
  try {
    const docRef = doc(firestoreDB, collName, documentId);
    await deleteDoc(docRef)
    return `Receta eliminada`
  } catch (error) {
    const err = error as FirestoreError;
    return `Error: ${err.name}: ${err.message}`
  }
}

export async function updateRecipe(recipe:IRecipe): Promise<IRecipe | undefined> {
  try {
    const docRef = doc(firestoreDB, collName, recipe.id!);
    const result = await updateDoc(docRef, recipe)
    return getRecipeById(recipe.id!)
  } catch (error) {
    const err = error as FirestoreError;
    console.error(`Error: ${err.name}: ${err.message}`);
    return undefined
  }
}

export async function updateRecipeIngredients(docId: string, ingredients:IRecipeIngredient[]): Promise<IRecipe | undefined> {
  try {
    console.debug(`Updating recipe ${docId}:`, ingredients)
    const docRef = doc(firestoreDB, collName, docId);
    await updateDoc(docRef, {ingredients_list: ingredients}).then((res)=>{
      console.debug('Receta actualizada', res)
    }).catch((e)=>{
      console.error(`Error: ${e.name}: ${e.message}`);
      return undefined
    })
    return getRecipeById(docId)
  } catch (error) {
    const err = error as FirestoreError;
    console.error(`Error: ${err.name}: ${err.message}`);
    return undefined
  }
}