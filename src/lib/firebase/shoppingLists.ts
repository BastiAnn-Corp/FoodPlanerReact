/**
 * shoppingLists.ts
 *
 * Firestore CRUD operations for the shopping list feature.
 * Uses @firebase/firestore (client SDK only — no firebase-admin).
 *
 * Collections:
 *   shopping_lists/{listId}         — private, owner-only read/write
 *   shared_list_views/{shareToken}  — public read, auth write; token IS the doc ID
 */

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  writeBatch,
  serverTimestamp,
  Timestamp,
} from "@firebase/firestore";
import { firestoreDB } from "@/lib/firebase/firebase-config";
import {
  IShoppingList,
  IShoppingListRecipe,
  ISharedListView,
} from "@/util/models";

const LISTS_COLL = "shopping_lists";
const SHARED_COLL = "shared_list_views";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function docToList(id: string, data: Record<string, unknown>): IShoppingList {
  return { ...(data as IShoppingList), id };
}

function docToSharedView(data: Record<string, unknown>): ISharedListView {
  return data as ISharedListView;
}

// ---------------------------------------------------------------------------
// Read operations
// ---------------------------------------------------------------------------

/** Load the most recently updated list for a user. Returns null if none exist. */
export async function getMostRecentList(uid: string): Promise<IShoppingList | null> {
  const q = query(
    collection(firestoreDB, LISTS_COLL),
    where("ownerUid", "==", uid),
    orderBy("updatedAt", "desc"),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return docToList(d.id, d.data() as Record<string, unknown>);
}

/** Load all lists for a user (for the list switcher). */
export async function getUserLists(uid: string): Promise<IShoppingList[]> {
  const q = query(
    collection(firestoreDB, LISTS_COLL),
    where("ownerUid", "==", uid),
    orderBy("updatedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => docToList(d.id, d.data() as Record<string, unknown>));
}

/** Load a single list by its document ID. */
export async function getListById(listId: string): Promise<IShoppingList | null> {
  const snap = await getDoc(doc(firestoreDB, LISTS_COLL, listId));
  if (!snap.exists()) return null;
  return docToList(snap.id, snap.data() as Record<string, unknown>);
}

/** Load a shared list view by share token. Returns null if token not found. */
export async function getSharedList(shareToken: string): Promise<ISharedListView | null> {
  const snap = await getDoc(doc(firestoreDB, SHARED_COLL, shareToken));
  if (!snap.exists()) return null;
  return docToSharedView(snap.data() as Record<string, unknown>);
}

// ---------------------------------------------------------------------------
// Write operations
// ---------------------------------------------------------------------------

/** Create a new empty shopping list and return its document ID. */
export async function createList(uid: string, name: string): Promise<string> {
  const ref = await addDoc(collection(firestoreDB, LISTS_COLL), {
    ownerUid: uid,
    name,
    recipes: [],
    checkedIngredientIds: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/**
 * Save (full overwrite) the current state of a shopping list.
 * - If listId is provided → setDoc (full overwrite on existing doc)
 * - If listId is undefined → addDoc (creates new document)
 * Returns the document ID (new or existing).
 *
 * Also syncs the shared_list_views document if shareToken is present (UC-13b).
 */
export async function saveList(
  payload: Omit<IShoppingList, "id" | "createdAt" | "updatedAt">,
  listId?: string,
  createdAt?: Timestamp
): Promise<string> {
  const data = {
    ...payload,
    updatedAt: serverTimestamp(),
    createdAt: createdAt ?? serverTimestamp(),
  };

  let id: string;

  if (listId) {
    await setDoc(doc(firestoreDB, LISTS_COLL, listId), data);
    id = listId;
  } else {
    const ref = await addDoc(collection(firestoreDB, LISTS_COLL), data);
    id = ref.id;
  }

  // Auto-sync shared view (UC-13b) if this list is shared
  if (payload.shareToken) {
    await syncSharedView(payload.shareToken, {
      name: payload.name,
      recipes: payload.recipes,
    });
  }

  return id;
}

/**
 * Persist only the checked-item state.
 * Called immediately on every check/uncheck (no debounce).
 */
export async function updateChecked(
  listId: string,
  checkedIngredientIds: string[]
): Promise<void> {
  await updateDoc(doc(firestoreDB, LISTS_COLL, listId), {
    checkedIngredientIds,
    updatedAt: serverTimestamp(),
  });
}

/** Rename a list. */
export async function renameList(listId: string, name: string): Promise<void> {
  await updateDoc(doc(firestoreDB, LISTS_COLL, listId), {
    name,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a list document and optionally its associated shared view.
 * Uses a batch so both deletes are atomic.
 */
export async function deleteList(listId: string, shareToken?: string): Promise<void> {
  const batch = writeBatch(firestoreDB);
  batch.delete(doc(firestoreDB, LISTS_COLL, listId));
  if (shareToken) {
    batch.delete(doc(firestoreDB, SHARED_COLL, shareToken));
  }
  await batch.commit();
}

// ---------------------------------------------------------------------------
// Share operations
// ---------------------------------------------------------------------------

/**
 * Generate a share token and atomically write:
 *   - shopping_lists/{listId}          → { shareToken }
 *   - shared_list_views/{shareToken}   → full public snapshot
 *
 * Returns the generated share token.
 */
export async function shareList(
  list: IShoppingList,
  ownerDisplayName: string
): Promise<string> {
  const token = crypto.randomUUID();
  const batch = writeBatch(firestoreDB);

  // Update the private list to record the token
  batch.update(doc(firestoreDB, LISTS_COLL, list.id!), {
    shareToken: token,
    updatedAt: serverTimestamp(),
  });

  // Create the public shared view (token IS the document ID)
  batch.set(doc(firestoreDB, SHARED_COLL, token), {
    ownerUid: list.ownerUid,
    ownerDisplayName,
    listId: list.id,
    name: list.name,
    recipes: list.recipes,
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
  return token;
}

/**
 * Sync the public shared view when the owner saves their list (UC-13b).
 * Called automatically by saveList when shareToken is present.
 */
export async function syncSharedView(
  shareToken: string,
  patch: { name: string; recipes: IShoppingListRecipe[] }
): Promise<void> {
  await updateDoc(doc(firestoreDB, SHARED_COLL, shareToken), {
    name: patch.name,
    recipes: patch.recipes,
    updatedAt: serverTimestamp(),
  });
}
