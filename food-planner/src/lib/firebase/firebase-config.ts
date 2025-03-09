// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "apiKey",
  authDomain: "camino-del-nom.firebaseapp.com",
  projectId: "camino-del-nom",
  storageBucket: "camino-del-nom.firebasestorage.app",
  messagingSenderId: process.env.MESSAGING_SENDER_ID || "messagingSenderId",
  appId: process.env.APP_ID || "appId",
  measurementId: process.env.MEASUREMENT_ID || "measurementId",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const firestoreDB = getFirestore(app)