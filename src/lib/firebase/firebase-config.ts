// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth} from "@firebase/auth";
import {envVars} from "@/util/config";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: envVars.apiKey,
  authDomain: "camino-del-nom.firebaseapp.com",
  projectId: "camino-del-nom",
  storageBucket: "camino-del-nom.firebasestorage.app",
  messagingSenderId: envVars.messagingSenderId,
  appId: envVars.appId,
  measurementId: envVars.measurementId,
};



// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestoreDB = getFirestore(app)
// Initialize Firebase Authentication and get a reference to the service
export const authApp = getAuth(app);