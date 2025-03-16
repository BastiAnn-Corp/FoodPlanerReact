import {IRecipe} from "@/util/models";
import {query, Query, where} from "@firebase/firestore";
import {getConvertedDocs} from "@/lib/firebase/firestore";

const collName = 'recipe'
const converter : FirebaseFirestore.FirestoreDataConverter<IRecipe> =  {
  toFirestore: (data: IRecipe) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    snap.data() as IRecipe
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