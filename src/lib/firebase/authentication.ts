import {GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, User} from "@firebase/auth";
import {authApp} from "@/lib/firebase/firebase-config";

export async function logOut(){
  signOut(authApp).then()
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(authApp, provider);
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
}

export async function getUserUUID(): Promise<User | null>{
  let userData: User | null = null;
  onAuthStateChanged(authApp, (user) => {
    if (user) {
      userData = user
    } else {
      console.log("user is logged out")
    }
  });
  return userData;
}