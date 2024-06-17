import { auth } from '../../../witan-dashboard/src/config/FirebaseConfig'
import { makeAutoObservable } from "mobx"

type Tday = {
    id: string;
    date: string;
    reasons: string[];
}

export default class AppStorage {

    constructor () {
        makeAutoObservable(this)
    }
}