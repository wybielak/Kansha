import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'
//import { getStorage } from 'firebase/storage'
//import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAhal--JCENDl5FStK1ig1_Cv_IFBJLHa4",
  authDomain: "kansha-72cc0.firebaseapp.com",
  projectId: "kansha-72cc0",
  storageBucket: "kansha-72cc0.appspot.com",
  messagingSenderId: "463759792025",
  appId: "1:463759792025:web:713ca415e9f27ad0aee508",
  measurementId: "G-GMELEMV84W"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

export const db = getFirestore(app)
//export const storage = getStorage(app)
//const analytics = getAnalytics(app);