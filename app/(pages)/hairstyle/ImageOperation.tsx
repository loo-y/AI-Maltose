'use client'
import React, { ChangeEvent, useEffect, useRef, useState, KeyboardEvent, MouseEvent } from 'react'
import { imageSizeLimition, imageUrlPrefix } from '@/app/shared/constants'
import { useHairStyleStore } from './providers'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import ChatImagePreview from '@/app/modules/ChatImagePreview'
import { handleUploadImage } from '@/app/shared/handlers'
import _ from 'lodash'
import { handleGetFaceSwapImages, handleGetFaceSwapImageStyles } from '@/app/shared/handlers'
enum SELECT_TYPE {
    imageUpload = `imageUpload`,
    styleSelect = `styleSelect`,
}

type ImageItem = {
    imageId: number
    imageUrl: string
    isLoading: boolean
}
export default function ImageOperation(/*{ hairStyleList }: { hairStyleList: string[] }*/) {
    const [isExpended, setIsExpended] = useState(false)
    const [selectType, setSelectType] = useState<SELECT_TYPE>()
    const [imageList, setImageList] = useState<ImageItem[]>([])
    const [selectedImage, setSelectedImage] = useState<ImageItem>()
    const [selectedStyle, setSelectedStyle] = useState<string>()
    const [hairStyleList, setHairStyleList] = useState<string[]>([])
    const hairStyleState = useHairStyleStore(state => state)
    const { updateNewImage, updateIsLoading, isloading, updateBalanceRefreshTime } = hairStyleState || {}

    useEffect(() => {
        handleGetFaceSwapImageStyles().then(res => {
            if (res) {
                console.log('[handleGetFaceSwapImageStyles]', res)
                setHairStyleList(res)
            }
        })
    }, [])

    useEffect(() => {
        if (selectedImage) {
        }
    }, [selectedImage])

    const handleClickExpend = (_selectType_: SELECT_TYPE) => {
        if (!isExpended) {
            setIsExpended(!isExpended)
        } else if (_selectType_ == selectType) {
            setIsExpended(!isExpended)
        }
        setSelectType(_selectType_)
    }

    const handleGenerate = () => {
        if (isloading) return
        if (!selectedImage || !selectedStyle) {
            setIsExpended(true)
            setSelectType(!selectedImage ? SELECT_TYPE.imageUpload : SELECT_TYPE.styleSelect)
            return
        }
        setIsExpended(false)
        updateIsLoading(true)
        handleGetFaceSwapImages({
            inputImageUrl: selectedImage.imageUrl,
            targetIDs: [selectedStyle],
        }).then(res => {
            _.map(res, item => {
                const { status, output } = item || {}
                if (status && output) {
                    updateNewImage(output)
                }
                updateIsLoading(false)
            })
            updateBalanceRefreshTime(Date.now())
        })
    }

    return (
        <div
            className={`${isExpended ? 'image-operation-expand' : 'image-operation-collapse'} flex  flex-col w-[50rem] bg-paw-white shadow-md border border-solid border-[rgba(236,236,236)] pr-3 transition-all duration-1000 ease-out `}
        >
            <div className="flex flex-row h-20">
                <div className="flex-1 flex px-3 items-center py-2">
                    <div
                        className={`flex-1 pr-4 w-full h-full py-4 flex flex-row gap-4 items-center ${isExpended ? (selectType == SELECT_TYPE.imageUpload ? 'rounded-l-2xl rounded-r-2xl !bg-purple-100' : 'rounded-l-2xl rounded-r-2xl') : 'rounded-l-[5rem] rounded-r-[2.5rem]'}  pl-2  hover:bg-purple-50 cursor-pointer`}
                        onClick={() => {
                            handleClickExpend(SELECT_TYPE.imageUpload)
                        }}
                    >
                        <div
                            className={`image-circle rounded-full w-12 h-12 items-center flex justify-center ${isExpended && selectType == SELECT_TYPE.imageUpload ? 'bg-gray-50' : 'bg-gray-200 '}`}
                        >
                            {selectedImage ? (
                                <img src={selectedImage.imageUrl} className="w-full h-full object-cover rounded-full" />
                            ) : (
                                <img src={`/images/icons/photo.png`} className="object-cover w-6 h-6 opacity-50" />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <div className="text-paw-gray text-sm font-semibold">Image *</div>
                            <div className="text-gray-400 text-xs items-end">
                                {selectedImage ? 'One image selected' : 'Upload and choose an image'}
                            </div>
                        </div>
                    </div>
                    <div className="w-px h-12 bg-gray-300 mx-2"></div>
                    <div
                        className={`flex-1 pr-4 w-full h-full py-4 flex flex-row gap-4 items-center  rounded-2xl ${selectType == SELECT_TYPE.styleSelect ? ' !bg-purple-100' : ''}  pl-4  hover:bg-purple-50 cursor-pointer`}
                        onClick={() => {
                            handleClickExpend(SELECT_TYPE.styleSelect)
                        }}
                    >
                        <div
                            className={`image-circle rounded-full w-12 h-12 items-center flex justify-center ${isExpended && selectType == SELECT_TYPE.styleSelect ? 'bg-gray-50' : 'bg-gray-200 '}`}
                        >
                            {selectedStyle ? (
                                <img
                                    src={`${imageUrlPrefix}/${selectedStyle}`}
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <img src={`/images/icons/ps.png`} className="object-cover w-7 h-7 opacity-50" />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <div className="text-paw-gray text-sm font-semibold">Hair Style *</div>
                            <div className="text-gray-400 text-xs items-end">
                                {selectedStyle ? 'One style selected' : 'Choose a style'}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="generate_button flex items-center justify-center">
                    <button
                        className={`rounded-full w-32  text-white h-14 flex flex-row items-center justify-center gap-2 ${isloading ? 'bg-gray-300 hover:bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                        onClick={handleGenerate}
                    >
                        <span>{isloading ? 'Generating...' : 'Generate'}</span>
                        {isloading ? null : (
                            <svg
                                fill="currentColor"
                                className=""
                                aria-hidden="true"
                                width="1em"
                                height="1em"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M10.84 3.13a.5.5 0 0 0-.68.74l6.17 5.63H2.5a.5.5 0 0 0 0 1h13.83l-6.17 5.63a.5.5 0 0 0 .68.74l6.91-6.32a.75.75 0 0 0 0-1.1l-6.91-6.32Z"
                                    fill="currentColor"
                                ></path>
                            </svg>
                        )}
                    </button>
                </div>
            </div>
            {isExpended ? (
                selectType == SELECT_TYPE.imageUpload ? (
                    <ImageSelect
                        imageList={imageList}
                        setImageList={setImageList}
                        selectedImage={selectedImage}
                        setSelectedImage={setSelectedImage}
                    />
                ) : (
                    <StyleSelect
                        styleList={hairStyleList}
                        selectedStyle={selectedStyle}
                        setSelectedStyle={setSelectedStyle}
                    />
                )
            ) : null}
        </div>
    )
}

const ImageSelect = ({
    imageList,
    setImageList,
    selectedImage,
    setSelectedImage,
}: {
    imageList: ImageItem[]
    setImageList: React.Dispatch<React.SetStateAction<ImageItem[]>>
    selectedImage?: ImageItem
    setSelectedImage?: React.Dispatch<React.SetStateAction<ImageItem | undefined>>
}) => {
    const handleOnUpload = (imageItem: { imageId: number; imageUrl: string }) => {
        if (_.isEmpty(imageItem)) return
        setImageList(oldList => {
            const newList = [...oldList, { ...imageItem, isLoading: true }]
            return newList
        })
    }

    const handleOnCompleted = async (imageItem: { imageId: number; imageUrl: string }) => {
        if (_.isEmpty(imageItem)) return
        await new Promise((resolve, reject) => {
            const img = new Image()
            // 设置图片的 src 属性
            img.src = imageItem.imageUrl
            // 设置图片的样式，使其不可见
            img.style.display = 'none'

            // 当图片加载完成时执行回调函数
            img.onload = () => {
                resolve(true)
            }
        })

        setImageList(oldList => {
            const newList = _.map(oldList, item => {
                if (item.isLoading && item.imageId == imageItem.imageId) {
                    return { ...item, imageUrl: imageItem.imageUrl, isLoading: false }
                }
                return item
            })

            return newList
        })
    }

    const handleDeleteImage = (imageItem: { imageId: number; imageUrl: string; isLoading: boolean }) => {
        setImageList(oldList => {
            const newList = _.filter(oldList, item => item.imageId !== imageItem?.imageId)
            return newList
        })
        if (selectedImage?.imageId == imageItem?.imageId) {
            setSelectedImage && setSelectedImage(undefined)
        }
    }

    const handleCheck = (imageItem: ImageItem) => {
        // debugger
        if (imageItem?.isLoading) return

        if (imageItem?.imageId == selectedImage?.imageId) {
            setSelectedImage && setSelectedImage(undefined)
        } else {
            setSelectedImage && setSelectedImage(imageItem)
        }
    }
    return (
        <div className="flex flex-1 rounded-2xl mb-3 bg-gray-100 ml-3 border border-dashed border-gray-300 flex-col h-[19rem]">
            <div className="flex flex-1 overflow-hidden overflow-y-scroll">
                {_.isEmpty(imageList) ? null : (
                    <div className="flex flex-wrap flex-row gap-2 my-2">
                        {_.map(imageList, (item, imageIndex) => {
                            const isChecked = item?.imageId == selectedImage?.imageId
                            console.log(`isChecked: ${isChecked}, imageID: ${item.imageId}`)
                            return (
                                <div
                                    className="relative flex items-center m-2 w-fit h-fit"
                                    key={`inputImageList_${imageIndex}`}
                                >
                                    <ThumbnailDisplay
                                        imageUrl={item?.imageUrl}
                                        isLoading={item?.isLoading}
                                        onDelete={() => {
                                            handleDeleteImage(item)
                                        }}
                                    />
                                    {item?.isLoading ? null : (
                                        <div
                                            className="absolute bottom-0 w-full h-6 bg-white bg-opacity-50 cursor-pointer flex items-center justify-center"
                                            onClick={() => handleCheck(item)}
                                        >
                                            <div
                                                className={`w-4 h-4 flex border-2 rounded-md  items-center justify-center transition-all duration-200 ease-in-out ${isChecked ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-200 hover:border-blue-500'}`}
                                            >
                                                <svg
                                                    className={`w-4 h-4 text-white fill-current ${isChecked ? 'block' : 'hidden'}`}
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
            <div className="flex w-full items-center justify-center py-2">
                <ImageUploadButton uploadCallback={handleOnUpload} completedCallback={handleOnCompleted} />
            </div>
        </div>
    )
}
const ImageUploadButton = ({
    uploadCallback,
    completedCallback,
}: {
    uploadCallback?: (image: { imageId: number; imageUrl: string }) => void
    completedCallback?: (image: { imageId: number; imageUrl: string }) => void
}) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [alertText, setAlertText] = useState('')

    const handleClick = () => {
        inputRef.current?.click()
    }

    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const fileInput = inputRef.current as HTMLInputElement
            // 检查文件类型
            if (!['image/png', 'image/jpeg'].includes(file.type)) {
                setAlertText(`Accepted formats: PNG, JPEG.`)
                fileInput.value = ''
                return
            }

            // 检查文件大小
            if (file.size > imageSizeLimition) {
                setAlertText(`Max image size: ${imageSizeLimition / 1000000}MB`)
                fileInput.value = ''
                return
            }

            // const formData = new FormData();
            // formData.append('file', file);
            const reader = new FileReader()
            const imageId = Date.now()
            reader.onload = () => {
                const base64Data = reader.result as string
                console.log('Base64 data:', base64Data)
                uploadCallback &&
                    uploadCallback({
                        imageId,
                        imageUrl: base64Data,
                    })
            }
            reader.readAsDataURL(file)

            const blob = new Blob([file], { type: file.type })
            fileInput.value = ''
            const style = `faceswap`
            const imageID = await handleUploadImage(blob, style)
            const imageUrl = `${location.protocol}//${location.host}/api/imageShow/${imageID}`
            console.log(`imageUrl`, imageUrl)
            completedCallback && completedCallback({ imageId, imageUrl })
        }
    }

    return (
        <>
            <div className="flex w-full items-center justify-center py-2">
                <button
                    className="text-white text-sm font-semibold w-fit rounded-lg h-10 px-4 bg-blue-500 hover:bg-blue-600"
                    onClick={handleClick}
                >
                    Upload Image
                </button>
            </div>
            <input
                type="file"
                accept=".png, .jpg, .jpeg"
                onChange={handleFileUpload}
                ref={inputRef}
                style={{ display: 'none' }}
            />
            <OverSizeAlert
                content={alertText}
                callback={() => {
                    setAlertText('')
                }}
            />
        </>
    )
}

const ThumbnailDisplay: React.FC<{
    imageUrl: string
    isLoading: boolean
    onDelete?: () => void
    hideDelete?: boolean
}> = ({ imageUrl, isLoading, onDelete, hideDelete }) => {
    const [hovered, setHovered] = useState(true)
    const [openPreview, setOpenPreview] = useState(false)
    const thumbnailRef = useRef(null)
    const imagePreviewRef = useRef(null)

    const handleMouseEnter = () => {
        setHovered(true)
    }

    const handleMouseLeave = () => {
        setHovered(false)
    }

    const handleDelete = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        event.stopPropagation()
        onDelete && onDelete()
    }

    const handleClickThumbnail = () => {
        setOpenPreview(true)
    }
    const handleClosePreview = () => {
        setOpenPreview(false)
    }

    const handleUnactiveClose = () => {
        if (imagePreviewRef?.current) {
            console.log(`handleUnactiveClose`)
            const imagePreviewElement = imagePreviewRef.current as HTMLDivElement
            setTimeout(() => {
                imagePreviewElement.click()
                imagePreviewElement.focus()
                console.log(`imagePreviewElement`, imagePreviewElement)
            }, 100)
        }
    }

    return (
        <>
            <div
                className="w-28 h-36 min-h-12 relative rounded-lg bg-contain bg-no-repeat bg-center border border-transparent bg-transparent cursor-zoom-in"
                style={{ backgroundImage: `url(${imageUrl})` }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClickThumbnail}
                ref={thumbnailRef}
            >
                {isLoading && (
                    <div className="w-full h-full flex items-center justify-center flex-col bg-opacity-50 bg-gray-500 ">
                        <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-gray-500"></div>
                    </div>
                )}
                {hovered && !hideDelete && (
                    <button
                        className="absolute -top-2 -right-2 p-1 bg-gray-600 text-white rounded-full"
                        onClick={handleDelete}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-2 h-2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}
            </div>
            <div className="">
                <ChatImagePreview imageUrl={imageUrl} isOpen={openPreview} closeCallback={handleClosePreview} />
            </div>
        </>
    )
}

const StyleSelect = ({
    styleList,
    selectedStyle,
    setSelectedStyle,
}: {
    styleList: string[]
    selectedStyle: string | undefined
    setSelectedStyle: React.Dispatch<React.SetStateAction<string | undefined>>
}) => {
    const handleCheck = (item: string) => {
        if (item == selectedStyle) {
            setSelectedStyle(undefined)
        } else {
            setSelectedStyle(item)
        }
    }
    return (
        <div className="flex flex-1 rounded-2xl mb-3 bg-white overflow-hidden overflow-y-scroll">
            {_.isEmpty(styleList) ? null : (
                <div className="flex flex-wrap flex-row gap-2 my-2">
                    {_.map(styleList, (item, styleIndex) => {
                        const isChecked = item == selectedStyle
                        return (
                            <div
                                className="relative flex items-center m-2 w-fit h-fit"
                                key={`inputImageList_${styleIndex}`}
                            >
                                <ThumbnailDisplay
                                    imageUrl={`${imageUrlPrefix}/${item}`}
                                    isLoading={false}
                                    hideDelete={true}
                                />
                                <div
                                    className="absolute bottom-0 w-full h-6 bg-white bg-opacity-50 cursor-pointer flex items-center justify-center"
                                    onClick={() => handleCheck(item)}
                                >
                                    <div
                                        className={`w-4 h-4 flex border-2 rounded-md  items-center justify-center transition-all duration-200 ease-in-out ${isChecked ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-200 hover:border-blue-500'}`}
                                    >
                                        <svg
                                            className={`w-4 h-4 text-white fill-current ${isChecked ? 'block' : 'hidden'}`}
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

const OverSizeAlert = ({ title, content, callback }: { title?: string; content?: string; callback: () => void }) => {
    const [open, setOpen] = useState(false)
    useEffect(() => {
        if (content) {
            setOpen(true)
        } else {
            setOpen(false)
        }
    }, [content])

    const handleClose = () => {
        callback()
    }
    return (
        <AlertDialog open={open}>
            <AlertDialogContent onEscapeKeyDown={handleClose}>
                <AlertDialogHeader>
                    {title ? <AlertDialogTitle>{title}</AlertDialogTitle> : null}

                    <AlertDialogDescription className="text-lg font-bold">{content}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={handleClose}>OK</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
