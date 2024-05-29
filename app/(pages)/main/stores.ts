import { createStore } from 'zustand/vanilla'

type MainState = {
    isloading?: boolean
}

type MainActions = {
    updateIsLoading: (loading: boolean) => void
}

export type MainStore = MainState & MainActions

export const initMainStore = (): MainState => {
    return { isloading: false }
}

const defaultInitState: MainState = {
    isloading: false,
}

export const createMainStore = (initState: MainState = defaultInitState) => {
    return createStore<MainStore>()(set => {
        return {
            ...initState,

            updateIsLoading: (loading: boolean) => {
                return set(state => {
                    return {
                        isloading: loading,
                    }
                })
            },
        }
    })
}
