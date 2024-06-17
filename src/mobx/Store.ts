import { createContext, useContext } from "react";
import AppStorage from "./AppStorage";


export const Store = {
    appStorage: new AppStorage()
}

export const StoreContext = createContext(Store)

export function useStore() {
    return useContext(StoreContext)
}