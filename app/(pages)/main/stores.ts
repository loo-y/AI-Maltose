import { isNumber } from 'lodash'
import { createStore } from 'zustand/vanilla'

type MainState = {
    isloading?: boolean
    userInfo: Record<string, any>
    currentConversation: {
        id?: number
        topic?: string
    }
    conversations: {
        id: number
        topic: string
    }[]
}

type MainActions = {
    updateIsLoading: (loading: boolean) => void
    updateCurrentConversation: (prams: { id?: number; topic?: string }) => void
}

export type MainStore = MainState & MainActions

const defaultInitState: MainState = {
    isloading: false,
    userInfo: {},
    conversations: [],
    currentConversation: {
        id: 0,
        topic: '',
    },
}

export const initMainStore = (): MainState => {
    return defaultInitState
}

export const createMainStore = (initState: MainState = defaultInitState) => {
    return createStore<MainStore>()(set => {
        return {
            ...initState,
            updateCurrentConversation: ({ id, topic = '' }: { id?: number; topic?: string }) => {
                return set(state => {
                    return {
                        currentConversation: {
                            id: isNumber(id) ? id : state.currentConversation.id,
                            topic: topic || state.currentConversation.topic,
                        },
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
