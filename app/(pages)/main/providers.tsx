'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { type StoreApi, useStore } from 'zustand'

import { type MainStore, createMainStore, initMainStore } from './stores'

export const MainStoreContext = createContext<StoreApi<MainStore> | null>(null)

export interface CounterStoreProviderProps {
    children: ReactNode
}

export const MainStoreProvider = ({ children }: CounterStoreProviderProps) => {
    const storeRef = useRef<StoreApi<MainStore>>()
    if (!storeRef.current) {
        storeRef.current = createMainStore(initMainStore())
    }
    return <MainStoreContext.Provider value={storeRef.current}>{children}</MainStoreContext.Provider>
}

export const useMainStore = <T,>(selector: (store: MainStore) => T): T => {
    const mainStoreContext = useContext(MainStoreContext)

    if (!mainStoreContext) {
        throw new Error(`useMainStore must be use within MainStoreProvider`)
    }

    return useStore(mainStoreContext, selector)
}
