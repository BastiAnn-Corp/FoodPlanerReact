import {TAisle} from "@/util/constants";
import {IConvertionIngredients, IIngredient} from "@/util/models";
import {addDoc, collection, FirestoreError, orderBy, query, Query, where} from "@firebase/firestore";
import {firestoreDB} from "@/lib/firebase/firebase-config";
import {createDocOutput, getConvertedDocs} from "@/lib/firebase/firestore";

const collName = 'ingredients'
const converter : FirebaseFirestore.FirestoreDataConverter<IIngredient> =  {
  toFirestore: (data: IIngredient) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    snap.data() as IIngredient
}

export interface IFilterIngredients {
  name?: string;
  aisles?: TAisle[];
  limit?: number;
  page?: number;
}

export async function getIngredients({
 aisles, name,
}: IFilterIngredients) : Promise<IIngredient[]>{
  function filterIngredients (q: Query): Query {
    if(aisles && aisles.length > 0){
      q = query(q, where("aisles", 'array-contains-any', aisles));
    }
    if(name){
      q = query(q, where("name", '==', name.toLowerCase()));
    }
    q = query(q, orderBy("name"));
    return q;
  }
  const ingredients= await getConvertedDocs({
    coll : {collection: collName, converter},
    queryFilters : filterIngredients,
  })
  return ingredients as IIngredient[];
}

export interface ICreateIngredient{
  name: string;
  aisles: TAisle[];
  convertions: IConvertionIngredients[];
}


export async function createIngredient(args: ICreateIngredient): Promise<createDocOutput>{
  try {
    const {
      name,
      aisles,
      convertions
    } = args
    const ingredients = await getIngredients({name: name.toLowerCase()})
    const ingredientExists = ingredients.findIndex((item)=> item.name === name.toLowerCase())
    if (ingredientExists !== -1){
      return { data: ingredients[ingredientExists].id as string}
    }
    const data: IIngredient = {
      aisles,
      name: name.toLowerCase(),
      convertions
    }
    const docRef = await addDoc(
      collection(firestoreDB, collName),
      data
    )
    return {data: docRef.id};
  } catch (error) {
    console.log(error);
    const err = error as FirestoreError;
    return {
      data: null,
      error: `${err.name}: ${err.message}`,
    }
  }
}