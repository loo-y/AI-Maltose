import { isNumber } from 'lodash'
import { createStore } from 'zustand/vanilla'
import type { ConversationType } from '@/app/shared/interface'
import _ from 'lodash'
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
    updateCurrentConversation: (prams: ConversationType) => void
    updateConversations: (conversations: ConversationType[]) => void
    addConversation: (conversation: ConversationType) => void
}

export type MainStore = MainState & MainActions

const defaultInitState: MainState = {
    isloading: false,
    aiBotList: [],
    userInfo: {},
    conversations: [],
    currentConversation: {
        conversation_id: 0,
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
            updateCurrentConversation: ({ conversation_id, topic = '', aiBotIDs }: ConversationType) => {
                return set(state => {
                    let hasTheConversation = false
                    const theConversation = {
                        conversation_id: isNumber(conversation_id) ? conversation_id : 0,
                        topic: conversation_id && conversation_id > 0 ? topic || '' : '',
                        aiBotIDs: aiBotIDs || [],
                    }

                    const newConversationList = _.map(state.conversations, item => {
                        if (item.conversation_id === conversation_id) {
                            hasTheConversation = true
                            return { ...item, topic, aiBotIDs }
                        }
                        return item
                    })

                    return {
                        conversations: hasTheConversation
                            ? newConversationList
                            : [theConversation, ...newConversationList],
                        currentConversation: theConversation,
                    }
                })
            },
            updateConversations: (conversations: ConversationType[]) => {
                return set(state => {
                    return {
                        conversations,
                    }
                })
            },
            addConversation: (conversation: ConversationType) => {
                return set(state => {
                    const { conversation_id, topic = '', aiBotIDs } = conversation
                    const theConversation = {
                        conversation_id: isNumber(conversation_id) ? conversation_id : 0,
                        topic: conversation_id && conversation_id > 0 ? topic || '' : '',
                        aiBotIDs: aiBotIDs || [],
                    }
                    return {
                        conversations: [theConversation, ...state.conversations],
                        currentConversation: theConversation,
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
