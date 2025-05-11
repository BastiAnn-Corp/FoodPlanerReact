import {IIngredient, IMenu, IRecipe, IShoppingCart} from "@/util/models";
import {
  collection,
  getDocs as firestoreDocs,
  Query,
  DocumentData,
  query,
} from "@firebase/firestore";
import {firestoreDB} from "@/lib/firebase/firebase-config";

interface pollItem {
collection: string;
converter:  FirebaseFirestore.FirestoreDataConverter<DocumentData>;
}

export const poll = {
  ingredients: {
    collection: 'ingredients',
    converter: {
      toFirestore: (data: IIngredient) => data,
      fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
        snap.data() as IIngredient
    }
  },
  menu: {
    collection: 'menu',
    converter: {
      toFirestore: (data: IMenu) => data,
      fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
        snap.data() as IMenu
    }
  },
  recipe: {
  collection: 'recipe',
    converter: {
    toFirestore: (data: IRecipe) => data,
      fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
      snap.data() as IRecipe
    }
  },
  shoppingCart:  {
    collection: 'shopping_cart',
    converter: {
      toFirestore: (data: IShoppingCart) => data,
      fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
        snap.data() as IShoppingCart
    }
  },
}

interface InputGetDocs {
  coll: pollItem;
  queryFilters?: (a: Query<DocumentData, DocumentData>) => Query;
}


export interface createDocOutput {
  data: string | null,
  error?: string
}


export async function getConvertedDocs({
  coll,
  queryFilters=(a: Query<DocumentData, DocumentData>): Query=>{return a}
}: InputGetDocs) : Promise<DocumentData[]> {
  try {
    const {collection : path, converter} = coll
    // @ts-ignore
    const collectionRef = collection(firestoreDB, path).withConverter(converter)
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

