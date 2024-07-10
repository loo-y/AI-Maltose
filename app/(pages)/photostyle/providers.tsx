'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { type StoreApi, useStore } from 'zustand'

import { type PhotoStyleStore, createPhotoStyleStore, initPhotoStyleStore } from './stores'

export const PhotoStyleStoreContext = createContext<StoreApi<PhotoStyleStore> | null>(null)

export interface PhotoStyleStoreProviderProps {
    children: ReactNode
}

export const PhotoStyleStoreProvider = ({ children }: PhotoStyleStoreProviderProps) => {
    const storeRef = useRef<StoreApi<PhotoStyleStore>>()
    if (!storeRef.current) {
        storeRef.current = createPhotoStyleStore(initPhotoStyleStore())
    }
    return <PhotoStyleStoreContext.Provider value={storeRef.current}>{children}</PhotoStyleStoreContext.Provider>
}

export const usePhotoStyleStore = <T,>(selector: (store: PhotoStyleStore) => T): T => {
    const photoStyleStoreContext = useContext(PhotoStyleStoreContext)

    if (!photoStyleStoreContext) {
        throw new Error(`usePhotoStyleStore must be use within PhotoStyleStoreProvider`)
    }

    return useStore(photoStyleStoreContext, selector)
}
