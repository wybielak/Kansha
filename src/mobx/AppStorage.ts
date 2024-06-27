import { signInWithPopup, signOut } from "firebase/auth";
import { makeAutoObservable } from "mobx"
import { auth, googleProvider } from "../config/FirebaseConfig";

type Tday = {
    id: string;
    date: string;
    reasons: string[];
}

export default class AppStorage {

    constructor() {
        makeAutoObservable(this)
    }

    signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider)
            console.log("Zalogowano")
        } catch (err) {
            console.error(err)
        }
    }

    logOut = async () => {
        try {
            await signOut(auth)
            console.log("Wylogowano")
        } catch (err) {
            console.log(err)
        }
    }
}