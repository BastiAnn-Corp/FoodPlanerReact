import {TAisle} from "@/util/constants";
import {IIngredient} from "@/util/models";
import {addDoc, collection, query, Query, where} from "@firebase/firestore";
import {firestoreDB} from "@/lib/firebase/firebase-config";
import {getConvertedDocs} from "@/lib/firebase/firestore";

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
  quantity: number;
  quantityUnit: string;
}

export async function createIngredient(args: ICreateIngredient){
  try {
    const {
      name,
      quantity,
      aisles,
      quantityUnit,
    } = args
    const ingredients = await getIngredients({name: name.toLowerCase()})
    const ingredientExists = ingredients.findIndex((item)=> item.name === name.toLowerCase())
    if (ingredientExists !== -1){
      return ingredients[ingredientExists].id
    }
    const data: IIngredient = {
      aisles,
      name: name.toLowerCase(),
      convertions: [
        {
          quantity,
          unit: quantityUnit.toLowerCase(),
        }
      ]
    }
    const docRef = await addDoc(
      collection(firestoreDB, collName),
      data
    )
    return docRef.id;
  } catch (error) {
    console.log(error);
    return null
  }
}