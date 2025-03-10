import {IIngredient, IRecipe} from "@/util/models";
import {
  collection,
  getDocs as firestoreDocs,
  Query,
  DocumentData,
  query,
  where,
  addDoc
} from "@firebase/firestore";
import {firestoreDB} from "@/lib/firebase/firebase-config";
import {docToRecipe} from "@/lib/docsToModel";

export const collections = {
  ingedients: 'ingredients',
  menu: 'menu',
  recipe: 'recipe',
  shoppingAisle: 'shopping_aisle',
  shoppingCart: 'shopping_cart',
}

async function getDocs(path: string, queryFilters = (a: Query<DocumentData, DocumentData>): Query=>{return a}) : Promise<DocumentData[]> {
  try {
    const collectionRef = collection(firestoreDB, path)
    let q = query(collectionRef)
    q = queryFilters(q)
    const querySnapshot = await firestoreDocs(q);
    const data = querySnapshot.docs.map((doc:DocumentData) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return data;
  } catch (error) {
    console.log(error)
    return []
  }

}

interface IFilterIngredients {
  name?: string;
  aisle?: string;
  limit?: number;
  page?: number;
}

export async function getIngredients({
  name,
  aisle,
}: IFilterIngredients) : Promise<IIngredient[]>{
  function filterIngredients (q: Query): Query {
    if(name){
      q = query(q, where("name", 'in', name.toLowerCase()));
    }
    if(aisle){
      q = query(q, where("aisle", 'in', aisle.toLowerCase()));
    }
    return q;
  }
  const ingredients= await getDocs(collections.ingedients, filterIngredients)
  return ingredients as IIngredient[];
}

export interface ICreateIngredient{
  name: string;
  aisle: string;
  quantity: number;
  quantityUnit: string;
}

export async function createIngredient(args: ICreateIngredient){
  try {
    const {
      name,
      quantity,
      aisle,
      quantityUnit,
    } = args
    const ingredients = await getIngredients({name: name.toLowerCase()})
    const ingredientExists = ingredients.findIndex((item)=> item.name === name.toLowerCase())
    if (ingredientExists !== -1){
      return ingredients[ingredientExists].id
    }
    const data: IIngredient = {
      aisle,
      name,
      convertions: [
        {
          quantity,
          unit: quantityUnit,
        }
      ]
    }
    const docRef = await addDoc(collection(firestoreDB, collections.ingedients), data)
    return docRef.id;
  } catch (error) {
    console.log(error);
    return null
  }
}

export interface IFilterRecipes {
  name?: string;
  season?: string;
  family?: string;
  limit?: number;
  page?: number;
}

export async function getRecipes({name, season, family} : IFilterRecipes) : Promise<IRecipe[]> {
  try{
    function filterRecipes (q:Query) : Query {
      if(name){
        q = query(q, where("name", 'in', name.toLowerCase()));
      }
      if(season){
        q = query(q, where("seasons", 'array-contains', season.toLowerCase()));
      }
      if(family){
        q = query(q, where("family", '==', family.toLowerCase()));
      }
      return q;
    }
    const recipes = await getDocs(collections.recipe, filterRecipes)
    console.log('getRecipes',recipes);
    console.info('getRecipes',recipes.length);
    return recipes.map((doc)=>{
      return docToRecipe(doc)
    })
  } catch (error) {
    console.error('getRecipes', error);
    return []
  }
}