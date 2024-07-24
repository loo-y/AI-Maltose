'use client'
import React, { useCallback, useRef, useEffect, useState } from 'react'
import { usePhotoStyleStore } from './providers'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import _ from 'lodash'
import { imageUrlPrefix } from '@/app/shared/constants'
import { isAbsoluteUrl, sleep } from '@/app/shared/util'
import ChatImagePreview from '@/app/modules/ChatImagePreview'
import type { JOB_IMAGE } from './stores'
import { handleGetTensorArtJobs } from '@/app/shared/handlers'

export default function ImageDisplay() {
    const photoStyleState = usePhotoStyleStore(state => state)
    const { createdImageList, updateImageStatus } = photoStyleState || {}
    return (
        <div className="w-full mt-6 px-1">
            <Tabs defaultValue="createdImages" className="w-full">
                <TabsList>
                    <TabsTrigger value="createdImages">My Images</TabsTrigger>
                    <TabsTrigger value="newImage">New Image</TabsTrigger>
                </TabsList>
                <div className="flex px-1 mt-2 w-full h-[50rem] overflow-hidden overflow-y-scroll">
                    <TabsContent value="createdImages" className="w-full">
                        <MyImageList />
                    </TabsContent>
                    <TabsContent value="newImage">Create a new image first</TabsContent>
                </div>
            </Tabs>
        </div>
    )
}

const MyImageList = () => {
    const photoStyleState = usePhotoStyleStore(state => state)
    const { createdImageList, updateImageStatus } = photoStyleState || {}
    console.log(`createdImageList`, createdImageList)
    const [openPreview, setOpenPreview] = useState(false)
    const [imageUrl, setImageUrl] = useState('')
    const [isGetImagesInterval, setIsGetImagesInterval] = useState<boolean>(false)

    const imageListRef: React.MutableRefObject<JOB_IMAGE[]> = useRef([])

    useEffect(() => {
        imageListRef.current = createdImageList
        if (!isGetImagesInterval) {
            getImageInterval()
        }
        return () => {
            imageListRef.current = []
            console.log(`imageListRef.current unload`, imageListRef.current)
        }
    }, [createdImageList])

    const getImageInterval = useCallback(async () => {
        console.log(`newImageList`, imageListRef.current)
        const waitingImages: JOB_IMAGE[] = _.filter(imageListRef.current, item => {
            return !!item.jobID && item.status != 'SUCCESS'
        })
        if (waitingImages?.length > 0) {
            setIsGetImagesInterval(true)
            const jobResults = await handleGetTensorArtJobs({
                jobIds: _.map(waitingImages, item => item.jobID),
            })
            console.log(`jobResults`, jobResults)
            if (!_.isEmpty(jobResults)) {
                _.map(jobResults, item => {
                    const { imageUrl, imageID, jobStatus, jobId } = item || {}
                    if ((imageID || imageUrl) && jobStatus == 'SUCCESS') {
                        updateImageStatus({
                            imageID,
                            imageUrl,
                            status: jobStatus,
                            jobID: jobId,
                        })
                    }
                })
            }
            await sleep(2)
            getImageInterval()
        } else {
            setIsGetImagesInterval(false)
        }
    }, [createdImageList])

    const handleClosePreview = () => {
        setOpenPreview(false)
    }

    const handleOpenPreview = (imageUrl: string) => {
        if (imageUrl) {
            setImageUrl(imageUrl)
            setOpenPreview(true)
        }
    }

    return (
        <>
            <div className="flex flex-row flex-wrap w-full items-start pb-6">
                {_.map(createdImageList, (imageItem, imageIndex) => {
                    const { jobID, status, imageID, imageUrl } = imageItem || {}
                    const showImageUrl = imageUrl
                        ? imageUrl
                        : imageID
                          ? isAbsoluteUrl(imageID)
                              ? imageID
                              : `${imageUrlPrefix}/${imageID}`
                          : ''
                    return (
                        <div
                            className={`flex w-1/3 p-3 h-[20rem] ${imageIndex % 3 == 0 ? 'pl-0' : imageIndex % 3 == 2 ? 'pr-0' : ''}`}
                            key={`myimagelist_${imageIndex}`}
                            onClick={() => handleOpenPreview(showImageUrl)}
                        >
                            {showImageUrl ? (
                                <div
                                    className="w-full h-full relative rounded-2xl bg-cover bg-no-repeat bg-center border border-solid border-gray-300 shadow-xl bg-transparent cursor-zoom-in"
                                    style={{ backgroundImage: `url(${showImageUrl})` }}
                                ></div>
                            ) : (
                                <div className="w-full h-full relative rounded-2xl flex items-center justify-center flex-col bg-opacity-50 bg-gray-500  z-20">
                                    <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-gray-500"></div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
            <div className="">
                <ChatImagePreview imageUrl={imageUrl} isOpen={openPreview} closeCallback={handleClosePreview} />
            </div>
        </>
    )
}
