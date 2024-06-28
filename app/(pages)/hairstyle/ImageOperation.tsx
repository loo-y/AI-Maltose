'use client'
import React, { useState } from 'react'

enum SELECT_TYPE {
    imageUpload = `imageUpload`,
    styleSelect = `styleSelect`,
}
export default function ImageOperation() {
    const [isExpended, setIsExpended] = useState(false)
    const [selectType, setSelectType] = useState<SELECT_TYPE>()

    const handleClickExpend = (_selectType_: SELECT_TYPE) => {
        if (!isExpended) {
            setIsExpended(!isExpended)
        } else if (_selectType_ == selectType) {
            setIsExpended(!isExpended)
        }
        setSelectType(_selectType_)
    }

    const selectedClass = ``
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
                            className={`iamge-circle rounded-full w-12 h-12 ${isExpended && selectType == SELECT_TYPE.imageUpload ? 'bg-gray-50' : 'bg-gray-200 '}`}
                        ></div>
                        <div className="flex flex-col">
                            <div className="text-paw-gray text-sm font-semibold">Image *</div>
                            <div className="text-gray-400 text-xs items-end">Choose an image</div>
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
                            className={`iamge-circle rounded-full w-12 h-12 ${isExpended && selectType == SELECT_TYPE.styleSelect ? 'bg-gray-50' : 'bg-gray-200 '}`}
                        ></div>
                        <div className="flex flex-col">
                            <div className="text-paw-gray text-sm font-semibold">Hair Style *</div>
                            <div className="text-gray-400 text-xs items-end">Choose an hair style</div>
                        </div>
                    </div>
                </div>
                <div className="generate_button flex items-center justify-center">
                    <button
                        className={`rounded-full w-32 bg-blue-500 hover:bg-blue-600 text-white h-14 flex flex-row items-center justify-center gap-2`}
                    >
                        <span>Generate</span>
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
                    </button>
                </div>
            </div>
            {isExpended ? selectType == SELECT_TYPE.imageUpload ? <ImageUpload /> : <StyleSelect /> : null}
        </div>
    )
}

const ImageUpload = () => {
    return (
        <div className="flex flex-1 rounded-2xl mb-3 bg-gray-100 ml-3 border border-dashed border-gray-300 flex-col">
            <div className="flex flex-1 overflow-y-scroll"></div>
            <div className="flex w-full items-center justify-center py-2">
                <button className="text-white text-sm font-semibold w-fit rounded-lg h-10 px-4 bg-blue-500 hover:bg-blue-600">
                    Upload Image
                </button>
            </div>
        </div>
    )
}

const StyleSelect = () => {
    return <div className="flex flex-1 rounded-2xl mb-3 bg-white ml-3"></div>
}
