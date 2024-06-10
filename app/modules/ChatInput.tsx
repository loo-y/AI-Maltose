'use client'
import React, { useState, ChangeEvent, KeyboardEvent, useRef, MouseEvent } from 'react'
import _ from 'lodash'
import ImageUploadButton from '@/app/modules/ImageUploadButton'
import ChatImagePreview from './ChatImagePreview'

interface IChatInputProps {
    maxRows?: number
    onSendQuestion: (question: string, imagList?: string[]) => void
    isFetching?: boolean
}
const Chatinput = ({ maxRows = 5, isFetching = false, onSendQuestion }: IChatInputProps) => {
    const [isComposing, setIsComposing] = useState(false)
    const [inputValue, setInputValue] = useState<string>('')
    const [inputRows, setInputRows] = useState<number>(1)
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const [imageList, setImageList] = useState<{ imageUrl: string; isLoading: boolean }[]>([])

    const handleCompositionStart = () => {
        setIsComposing(true)
    }

    const handleCompositionEnd = () => {
        setIsComposing(false)
    }

    const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const currentValue = event.target.value
        setInputValue(currentValue)
        const rows = currentValue.split('\n').length + (currentValue.match(/\n$/)?.[1] ? 1 : 0)
        setInputRows(Math.min(rows, maxRows))
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.shiftKey && event.key === 'Enter') {
            event.preventDefault()

            const currentInputRef = inputRef.current as HTMLTextAreaElement
            const { selectionStart, selectionEnd } = currentInputRef
            const newInputValue = inputValue.substring(0, selectionStart) + '\n' + inputValue.substring(selectionEnd)
            setInputValue(newInputValue)
            setInputRows(value => {
                return Math.min(value + 1, maxRows)
            })
            // 移动光标位置到插入换行符后
            const newSelectionStart = selectionStart + 1
            // 需要延时执行，否则无法定位，会被 setInputValue 后执行修改定位
            setTimeout(() => {
                currentInputRef.setSelectionRange(newSelectionStart, newSelectionStart)
            }, 0)
        } else if (event.key === 'Enter') {
            if (!isComposing) {
                event.preventDefault()
                handleSendQuestion()
            }
        }
    }
    const handleSendQuestion = () => {
        const question = _.trim(inputValue)
        console.log(`imageList`, imageList)
        if (question) {
            onSendQuestion(
                _.trim(inputValue),
                _.map(imageList, imgItem => imgItem.imageUrl)
            )
            setInputValue('')
            setInputRows(1)
        }
        setImageList([])
    }

    const handleFocus = () => {
        // document.body.addEventListener('touchmove', ()=>{inputRef.current?.blur()}, { passive: false });
    }
    const handleBlur = () => {
        setTimeout(() => {
            document.documentElement.scrollTop = 0
            document.body.scrollTop = 0
            window.innerHeight = window.outerHeight
            window.scrollTo(0, 0)
        }, 50)
    }

    const handleImageUploaded = async (newImageSrc: string | null) => {
        if (!newImageSrc) return
        await new Promise((resolve, reject) => {
            const img = new Image()
            // 设置图片的 src 属性
            img.src = newImageSrc
            // 设置图片的样式，使其不可见
            img.style.display = 'none'

            // 当图片加载完成时执行回调函数
            img.onload = () => {
                resolve(true)
            }
        })

        setImageList(oldList => {
            const newList = _.map(oldList, item => {
                if (item.isLoading) {
                    return { ...item, imageUrl: newImageSrc, isLoading: false }
                }
                return item
            })

            return newList
        })
    }

    const handleImageUploading = (newImageSrc: string | null) => {
        if (!newImageSrc) return
        setImageList(oldList => {
            const newList = [...oldList, { imageUrl: newImageSrc, isLoading: true }]
            return newList
        })
    }

    const handleDeleteImage = (imageItem: { imageUrl: string; isLoading: boolean }) => {
        setImageList(oldList => {
            const newList = _.filter(oldList, item => item.imageUrl !== imageItem?.imageUrl)
            return newList
        })
    }

    return (
        <div className="__chatinput__ relative h-full ">
            <div className="max-w-[50rem] w-full flex flex-col mx-auto">
                <div className="overflow-y-scroll overflow-x-hidden rounded-3xl bg-gray-100 flex flex-row gap-1 flex-grow  mx-4 text-gray-600 max-h-52">
                    <div className="flex flex-grow flex-row  border-0 pl-5 gap-1 ">
                        <div className="flex flex-row justify-start items-end my-2 -ml-1rem gap-1">
                            <ImageUploadButton
                                completedCallback={handleImageUploaded}
                                uploadCallback={handleImageUploading}
                            />
                        </div>
                        <div className="flex flex-col gap-2 w-full flex-grow">
                            {_.isEmpty(imageList) ? null : (
                                <div className="flex flex-row gap-2 h-fit mt-3">
                                    {_.map(imageList, (imageItem, imageIndex) => {
                                        return (
                                            <ThumbnailDisplay
                                                key={`inputImageList_${imageIndex}`}
                                                imageUrl={imageItem?.imageUrl}
                                                isLoading={imageItem?.isLoading}
                                                onDelete={() => {
                                                    handleDeleteImage(imageItem)
                                                }}
                                            />
                                        )
                                    })}
                                </div>
                            )}
                            <div className="flex my-1 flex-row gap-2 flex-grow ml-2 mb-3 items-center">
                                <textarea
                                    disabled={isFetching ? true : undefined}
                                    id={`chat-input`}
                                    value={inputValue}
                                    ref={inputRef}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    rows={inputRows}
                                    style={{ resize: 'none' }}
                                    onCompositionStart={handleCompositionStart}
                                    onCompositionEnd={handleCompositionEnd}
                                    className="block flex-grow  bg-transparent outline-none pt-2 w-full leading-6"
                                    placeholder="Type your messeage here..."
                                    onBlur={handleBlur}
                                    onFocus={handleFocus}
                                ></textarea>
                            </div>
                        </div>
                        <div className="flex flex-row justify-end items-end my-2 mr-[0.4rem] gap-1">
                            <div className=" items-center flex">
                                <div
                                    className="svg-image flex h-10 w-10 overflow-hidden items-center justify-center cursor-pointer bg-lightGreen rounded-full"
                                    onClick={handleSendQuestion}
                                >
                                    <img
                                        src={isFetching ? '/images/icons/stop.svg' : '/images/icons/arrow-up.svg'}
                                        className="h-9 w-9"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-9"></div>
        </div>
    )
}

export default Chatinput

const ThumbnailDisplay: React.FC<{ imageUrl: string; isLoading: boolean; onDelete: () => void }> = ({
    imageUrl,
    isLoading,
    onDelete,
}) => {
    const [hovered, setHovered] = useState(true)
    const [openPreview, setOpenPreview] = useState(false)
    const thumbnailRef = useRef(null)
    const imagePreviewRef = useRef(null)

    const handleMouseEnter = () => {
        // setHovered(true)
    }

    const handleMouseLeave = () => {
        // setHovered(false)
    }

    const handleDelete = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        event.stopPropagation()
        onDelete()
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

    const handleImageClick = (event: MouseEvent<HTMLImageElement>) => {
        event.preventDefault()
        event.stopPropagation()
    }

    return (
        <>
            <div
                className="w-12 h-full min-h-12 relative rounded-lg bg-contain bg-no-repeat bg-center border border-transparent bg-transparent cursor-zoom-in"
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
                {hovered && (
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
