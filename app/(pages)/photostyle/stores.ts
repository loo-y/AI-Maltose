import _ from 'lodash'
import { createStore } from 'zustand/vanilla'

export type JOB_IMAGE = {
    imageID?: string
    imageUrl?: string
    status: string
    jobID: string
}
type PhotoStyleState = {
    isloading?: boolean
    userInfo: Record<string, any>
    createdImageList: JOB_IMAGE[]
    newImageByAI?: JOB_IMAGE
    balanceRefreshTime?: number
}

type PhotoStyleActions = {
    updateIsLoading: (loading: boolean) => void
    updateNewImage: (jobImage: JOB_IMAGE) => void
    updateImageStatus: (jobImage: JOB_IMAGE) => void
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
            updateNewImage: (jobImage: JOB_IMAGE) => {
                return set(state => {
                    return {
                        newImageByAI: jobImage,
                        createdImageList: [jobImage, ...state.createdImageList],
                    }
                })
            },
            updateImageStatus: (jobImage: JOB_IMAGE) => {
                return set(state => {
                    return {
                        createdImageList: _.map(state.createdImageList, item => {
                            if (item.jobID == jobImage.jobID) {
                                return {
                                    ...item,
                                    ...jobImage,
                                }
                            }
                            return item
                        }),
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
