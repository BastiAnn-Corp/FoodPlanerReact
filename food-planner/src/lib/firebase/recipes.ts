import {IRecipe, IRecipeIngredient, IRecipeStep} from "@/util/models";
import {addDoc, collection, FirestoreError, orderBy, query, Query, where} from "@firebase/firestore";
import {createDocOutput, getConvertedDocs} from "@/lib/firebase/firestore";
import {firestoreDB} from "@/lib/firebase/firebase-config";
import {TFoodFamily, TSeasons} from "@/util/constants";

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
    console.log('getRecipes',recipes);
    console.info('getRecipes',recipes.length);
    return recipes.map((doc)=>{
      return doc as IRecipe
    })
  } catch (error) {
    console.error('getRecipes', error);
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
    console.log('createRecipe', error);
    const err = error as FirestoreError;
    return {
      data: null,
      error: `${err.name}: ${err.message}`,
    }
  }
}

