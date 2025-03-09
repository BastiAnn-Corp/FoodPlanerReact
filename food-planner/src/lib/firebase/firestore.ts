import {IIngredient} from "@/util/models";
import {collection, getDocs as firestoreDocs, Query, DocumentData, query, where} from "@firebase/firestore";
import {firestoreDB} from "@/lib/firebase/firebase-config";

export const collections = {
  ingedients: 'ingredients',
  menu: 'menu',
  recipe: 'recipe',
  shoppingAisle: 'shopping_aisle',
  shoppingCart: 'shopping_cart',
}

async function getDocs(path: string, queryFilters = (a: Query<DocumentData, DocumentData>): Query=>{return a}) : Promise<DocumentData[]> {
  const collectionRef = collection(firestoreDB, path)
  let q = query(collectionRef)
  q = queryFilters(q)
  const querySnapshot = await firestoreDocs(q);
  const data = querySnapshot.docs.map((doc:DocumentData) => ({
    ...doc.data(),
    id: doc.id,
  }));
  return data;
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
      q = query(q, where("name", 'in', name));
    }
    if(aisle){
      q = query(q, where("aisle", 'in', aisle));
    }
    return q;
  }
  const ingredients= await getDocs(collections.ingedients, filterIngredients)
  return ingredients as IIngredient[];
}