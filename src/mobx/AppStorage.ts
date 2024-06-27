import { signInWithPopup, signOut } from "firebase/auth";
import { makeAutoObservable } from "mobx"
import { auth, db, googleProvider } from "../config/FirebaseConfig";
import { Timestamp, collection, getDocs } from "firebase/firestore";

type Tday = {
    id: string;
    date: Timestamp;
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

    daysRef = collection(db, 'days')

    days = <Tday[]>[]

    currentDay: Tday | null = null

    cdIndex = 0

    setDays = (data: Tday[]) => {
        this.days = data
        this.currentDay = data[0]
    }

    getDays = async () => {
        const data = await getDocs(this.daysRef)
        const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Tday))

        filteredData.sort((a, b) => {
            const dateA = a.date;
            const dateB = b.date;

            if (dateA > dateB) return -1;
            if (dateA < dateB) return 1;

            return 0;
        })

        this.setDays(filteredData)
        console.log('Pobrano dni')
    }

    prevDay = () => {
        if (this.cdIndex < this.days.length - 1) {
            this.cdIndex += 1
        }
        this.currentDay = this.days[this.cdIndex]
    }

    nextDay = () => {
        if (this.cdIndex > 0) {
            this.cdIndex -= 1
        }
        this.currentDay = this.days[this.cdIndex]
    }
}
