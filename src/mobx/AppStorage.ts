import { signInWithPopup, signOut } from "firebase/auth";
import { makeAutoObservable } from "mobx"
import { auth, db, googleProvider } from "../config/FirebaseConfig";
import { Timestamp, addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { format } from "date-fns";

type Tday = {
    id: string;
    date: Timestamp;
    reasons: string[];
    userId: string;
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

    newReason = ''

    setDays = (data: Tday[]) => {
        this.days = data
        this.currentDay = data[0]
    }

    getDays = async () => {
        const data = await getDocs(this.daysRef)
        const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Tday))

        const filteredData2 = filteredData.filter((day) => {
            if (day.userId == auth?.currentUser?.uid) {
                return day
            }
        })

        filteredData2.sort((a, b) => {
            const dateA = a.date;
            const dateB = b.date;

            if (dateA > dateB) return -1;
            if (dateA < dateB) return 1;

            return 0;
        })

        this.setDays(filteredData2)
        console.log('Pobrano dni')
    }

    checkNewDay = async () => {
        if (!(format(new Date(this.currentDay!.date.seconds * 1000), 'dd.MM.yyy') == format(new Date(), 'dd.MM.yyy'))) {
            addDoc(this.daysRef, {
                date: new Date(),
                userId: auth!.currentUser!.uid,
                reasons: []
            })

            this.getDays()
        }
    }

    setNewReason = (reason: string) => {
        this.newReason = reason
    }

    addNewReason = async () => {

        if (this.newReason != '') {
            updateDoc(doc(db, 'days', this.currentDay!.id), {
                reasons: [...this.currentDay!.reasons, this.newReason]
            })

            this.setNewReason('')

            console.log("Dodano nowy powód")

            this.getDays()
            
        } else {
            console.log('nie można dodać pustego')
        }


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
