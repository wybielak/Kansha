import { signInWithPopup, signOut } from "firebase/auth";
import { makeAutoObservable } from "mobx"
import { auth, db, googleProvider } from "../config/FirebaseConfig";
import { Timestamp, addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
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

    myDaysStat = 0
    myReasonsStat = 0

    setDays = (data: Tday[]) => {
        this.days = data
        this.currentDay = data[0]
    }

    getDays = async () => {
        let myDaysRef = query(this.daysRef, where('userId', '==', `${auth!.currentUser!.uid}`))

        const data = await getDocs(myDaysRef)
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

        this.getMyDaysStat()
        this.getMyReasonsStat()
    }

    checkNewDay = async () => {
        if (!(format(new Date(this.currentDay!.date.seconds * 1000), 'dd.MM.yyy') == format(new Date(), 'dd.MM.yyy'))) {
            addDoc(this.daysRef, {
                date: new Date(),
                userId: auth!.currentUser!.uid,
                reasons: []
            })

            this.getDays()

            console.log("Uzupełniono nowy dzień")
        }

        console.log("Dzień ten sam")
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

    setMyDaysStat = (data: number) => {
        this.myDaysStat = data
        console.log(this.myDaysStat)
    }

    getMyDaysStat = async () => {
        let days_c = 0
        this.days.forEach(() => {
            days_c += 1
        })

        this.setMyDaysStat(days_c)

        console.log("Obliczono stat dni")
    }

    setMyReasonsStat = (data: number) => {
        this.myReasonsStat = data
        console.log(this.myReasonsStat)
    }

    getMyReasonsStat = async () => {
        let reasons_c = 0
        this.days.forEach((day) => {
            day.reasons.forEach(() => {
                reasons_c += 1
            })
        })

        this.setMyReasonsStat(reasons_c)

        console.log("Obliczono stat powodów")
    }
}
