import { isNumber } from 'lodash'
import { createStore } from 'zustand/vanilla'
import type { ConversationType } from '@/app/shared/interface'

type AIBotType = {
    id: string
    name: string
    queryType: string
    isCustom: boolean
    imageCapability: boolean
}

type MainState = {
    isloading?: boolean
    userInfo: Record<string, any>
    currentConversation: ConversationType
    conversations: ConversationType[]
    aiBotList: AIBotType[]
}

type MainActions = {
    updateIsLoading: (loading: boolean) => void
    updateCurrentConversation: (prams: { id?: number; topic?: string; aiBotIDs?: string[] }) => void
}

export type MainStore = MainState & MainActions

const defaultInitState: MainState = {
    isloading: false,
    aiBotList: [],
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
            updateCurrentConversation: ({ id, topic = '', aiBotIDs }: ConversationType) => {
                return set(state => {
                    return {
                        currentConversation: {
                            id: isNumber(id) ? id : 0,
                            topic: topic || '',
                            aiBotIDs: aiBotIDs || [],
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
