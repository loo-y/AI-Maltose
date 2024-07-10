import { isNumber } from 'lodash'
import { createStore } from 'zustand/vanilla'

type PhotoStyleState = {
    isloading?: boolean
    userInfo: Record<string, any>
    createdImageList: string[]
    newImageByAI?: string
    balanceRefreshTime?: number
}

type PhotoStyleActions = {
    updateIsLoading: (loading: boolean) => void
    updateNewImage: (imageUrlID: string) => void
    updateBalanceRefreshTime: (time: number) => void
}

export type PhotoStyleStore = PhotoStyleState & PhotoStyleActions

const defaultInitState: PhotoStyleState = {
    isloading: false,
    userInfo: {},
    createdImageList: [],
    balanceRefreshTime: 0,
}

export const initPhotoStyleStore = (): PhotoStyleState => {
    return defaultInitState
}

export const createPhotoStyleStore = (initState: PhotoStyleState = defaultInitState) => {
    return createStore<PhotoStyleStore>()(set => {
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
