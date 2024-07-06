import { isNumber } from 'lodash'
import { createStore } from 'zustand/vanilla'

type HairStyleState = {
    isloading?: boolean
    userInfo: Record<string, any>
    createdImageList: string[]
    newImageByAI?: string
    balanceRefreshTime?: number
}

type HairStyleActions = {
    updateIsLoading: (loading: boolean) => void
    updateNewImage: (imageUrlID: string) => void
    updateBalanceRefreshTime: (time: number) => void
}

export type HairStyleStore = HairStyleState & HairStyleActions

const defaultInitState: HairStyleState = {
    isloading: false,
    userInfo: {},
    createdImageList: [],
    balanceRefreshTime: 0,
}

export const initHairStyleStore = (): HairStyleState => {
    return defaultInitState
}

export const createHairStyleStore = (initState: HairStyleState = defaultInitState) => {
    return createStore<HairStyleStore>()(set => {
        return {
            ...initState,
            updateIsLoading: (loading: boolean) => {
                return set(state => {
                    return {
                        isloading: loading,
                    }
                })
            },
            updateNewImage: (imageUrlID: string) => {
                return set(state => {
                    return {
                        newImageByAI: imageUrlID,
                        createdImageList: [imageUrlID, ...state.createdImageList],
                    }
                })
            },
            updateBalanceRefreshTime: (time: number) => {
                return set(state => {
                    return {
                        balanceRefreshTime: time,
                    }
                })
            },
        }
    })
}
