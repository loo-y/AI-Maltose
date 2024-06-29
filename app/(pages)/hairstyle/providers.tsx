'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { type StoreApi, useStore } from 'zustand'

import { type HairStyleStore, createHairStyleStore, initHairStyleStore } from './stores'

export const HairStyleStoreContext = createContext<StoreApi<HairStyleStore> | null>(null)

export interface HairStyleStoreProviderProps {
    children: ReactNode
}

export const HairStyleStoreProvider = ({ children }: HairStyleStoreProviderProps) => {
    const storeRef = useRef<StoreApi<HairStyleStore>>()
    if (!storeRef.current) {
        storeRef.current = createHairStyleStore(initHairStyleStore())
    }
    return <HairStyleStoreContext.Provider value={storeRef.current}>{children}</HairStyleStoreContext.Provider>
}

export const useHairStyleStore = <T,>(selector: (store: HairStyleStore) => T): T => {
    const hairStyleStoreContext = useContext(HairStyleStoreContext)

    if (!hairStyleStoreContext) {
        throw new Error(`useHairStyleStore must be use within HairStyleStoreProvider`)
    }

    return useStore(hairStyleStoreContext, selector)
}
