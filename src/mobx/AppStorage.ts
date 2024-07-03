import { signInWithPopup, signOut } from "firebase/auth";
import { makeAutoObservable } from "mobx"
import { auth, db, googleProvider } from "../config/FirebaseConfig";
import { Timestamp, addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { format } from "date-fns";

type Tday = {
    id: string;
    date: Timestamp;
    reasons: string[];
    userId: string;
}

type Treason = {
    id: string;
    text: string;
    dayId: string;
    userId: string;
    date: Timestamp;

}

export default class AppStorage {

    constructor() {
        makeAutoObservable(this)
    }

    // SECTION - autoryzacja

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

    // SECTION = przechowywanie danych

    daysRef = collection(db, 'days')
    reasonsRef = collection(db, 'reasons')

    days = <Tday[]>[]

    currentDay: Tday | null = null
    currentDayReasons: Treason[] = []

    cdIndex = 0

    newReasonText = ''

    myDaysStat = 0
    myReasonsStat = 0

    // SECTION - pobieranie dni

    setDays = (data: Tday[]) => {
        this.cdIndex = 0
        this.days = data
        this.currentDay = data[0]
    }

    getDays = async () => {
        let myDaysRef = query(this.daysRef, where('userId', '==', `${auth!.currentUser!.uid}`))

        const data = await getDocs(myDaysRef)
        const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Tday))

        if (filteredData.length > 0) {

            filteredData.sort((a, b) => {
                const dateA = a.date;
                const dateB = b.date;

                if (dateA > dateB) return -1;
                if (dateA < dateB) return 1;

                return 0;
            })

            this.setDays(filteredData)

            console.log('Pobrano dni')
        } else {
            console.log('Brak dni')
        }
    }

    // SECTION - sprawdzanie czy trzeba dodać nowy dzień

    checkNewDay = async () => {

        if (this.currentDay == undefined) {
            await addDoc(this.daysRef, {
                date: new Date(),
                userId: auth!.currentUser!.uid
            })

            console.log("Uzupełniono nowy dzień")
            await this.getDays()
        }

        else if (!(format(new Date(this.currentDay!.date.seconds * 1000), 'dd.MM.yyy') == format(new Date(), 'dd.MM.yyy'))) {
            await addDoc(this.daysRef, {
                date: new Date(),
                userId: auth!.currentUser!.uid
            })

            console.log("Uzupełniono nowy dzień")
            await this.getDays()
        }

        console.log("Dzień ten sam")
    }

    // SECTION - pobieranie powodów dla obecnego dnia

    setCurrentDayReasons = (data: Treason[]) => {
        this.currentDayReasons = data
    }

    getCurrentDayReasons = async () => {
        let currentDayReasonsRef = query(this.reasonsRef, where('dayId', '==', `${this.currentDay!.id}`))

        const data = await getDocs(currentDayReasonsRef)
        const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Treason))

        filteredData.sort((a, b) => {
            const dateA = a.date;
            const dateB = b.date;

            if (dateA < dateB) return -1;
            if (dateA > dateB) return 1;

            return 0;
        })

        this.setCurrentDayReasons(filteredData)
        console.log("Pobrano powody dla dnia")
    }

    // SECTION - dodawanie nowego powodu

    setNewReasonText = (reason: string) => {
        this.newReasonText = reason
    }

    addNewReason = async () => {

        if (this.newReasonText != '') {
            await addDoc(this.reasonsRef, {
                dayId: this.currentDay!.id,
                text: this.newReasonText,
                userId: auth!.currentUser!.uid,
                date: new Date(),
            })

            this.setNewReasonText('')

            console.log("Dodano nowy powód")

            await this.getCurrentDayReasons()

        } else {
            console.log('Nie można dodać pustego')
        }

    }

    // SECTION - przewijanie dni

    prevDay = async () => {

        if (this.cdIndex < this.days.length - 1) {
            this.setCurrentDayReasons([])
            this.cdIndex += 1
            this.currentDay = this.days[this.cdIndex]
            await this.getCurrentDayReasons()
        }

    }

    nextDay = async () => {
        if (this.cdIndex > 0) {
            this.setCurrentDayReasons([])
            this.cdIndex -= 1
            this.currentDay = this.days[this.cdIndex]
            await this.getCurrentDayReasons()
        }
    }

    // SECTION - statystyki

    setMyDaysStat = (data: number) => {
        this.myDaysStat = data
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
    }

    getMyReasonsStat = async () => {
        let currentDayReasonsRef = query(this.reasonsRef, where('userId', '==', `${auth!.currentUser!.uid}`))

        const data = await getDocs(currentDayReasonsRef)
        const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Treason))

        this.setMyReasonsStat(filteredData.length)

        console.log("Obliczono stat powodów")
    }
}
