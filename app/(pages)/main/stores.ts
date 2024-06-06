import { createStore } from 'zustand/vanilla'

type MainState = {
    isloading?: boolean
    userInfo: Record<string, any>
    currentConversationID: number
    conversations: {
        id: number
        topic: string
    }[]
}

type MainActions = {
    updateIsLoading: (loading: boolean) => void
    updateCurrentConversation: (cID: number) => void
}

export type MainStore = MainState & MainActions

const defaultInitState: MainState = {
    isloading: false,
    userInfo: {},
    conversations: [],
    currentConversationID: 0,
}

export const initMainStore = (): MainState => {
    return defaultInitState
}

export const createMainStore = (initState: MainState = defaultInitState) => {
    return createStore<MainStore>()(set => {
        return {
            ...initState,
            updateCurrentConversation: (cID: number) => {
                return set(state => {
                    return {
                        currentConversationID: cID,
                    }
                })
            },
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
