import { createStore } from 'zustand/vanilla'

type MainState = {
    isloading?: boolean
    userInfo: Record<string, any>
    conversations: {
        id: number
        topic: string
    }[]
}

type MainActions = {
    updateIsLoading: (loading: boolean) => void
}

export type MainStore = MainState & MainActions

const defaultInitState: MainState = {
    isloading: false,
    userInfo: {},
    conversations: [],
}

export const initMainStore = (): MainState => {
    return defaultInitState
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
