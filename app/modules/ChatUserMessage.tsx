'use client'
import React, { useEffect, useState } from 'react'
import {
    IHistory,
    Roles,
    IChatMessage,
    UserMessage,
    TextMessage,
    ImageUrlMessage,
    AzureImageUrlMessage,
} from '../shared/interface'
import _ from 'lodash'
import ChatImagePreview from './ChatImagePreview'

interface IChatUserMessageProps {
    chatMessage: {
        role: Roles.user
        content: string | (TextMessage | ImageUrlMessage)[]
        name?: string
    }
}
const ChatUserMessage = ({ chatMessage }: IChatUserMessageProps) => {
    const { role, content } = chatMessage || {}

    return (
        <div className="w-full">
            <div className="py-2 px-3 text-base m-auto md:px-5 lg:px-1 xl:px-5">
                <div className="mx-auto flex flex-1 gap-3 md:gap-6 md:max-w-[50rem] w-full justify-end px-4">
                    <div className="flex relative max-w-[70%]">
                        {typeof content === 'string' ? (
                            <div className="text-gray-600 bg-gray-100 rounded-3xl  px-5 py-2.5 whitespace-pre-wrap">
                                {content}
                            </div>
                        ) : (
                            <ObjectContent content={content} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatUserMessage

const ObjectContent = ({ content }: { content: (TextMessage | ImageUrlMessage)[] }) => {
    const textContentList = _.filter(
        content,
        (message: TextMessage | ImageUrlMessage) => message.type === 'text'
    ) as TextMessage[]
    const imageContentList = _.filter(
        content,
        (message: TextMessage | ImageUrlMessage) => message.type === 'image_url' && message.image_url?.url
    ) as ImageUrlMessage[]
    const textContent = _.map(textContentList, (message: TextMessage) => message.text).join('\n')

    const [openPreview, setOpenPreview] = useState(false)
    const [previewImageUrl, setPreviewImageUrl] = useState('')
    const handleClosePreview = () => {
        setOpenPreview(false)
        setPreviewImageUrl('')
    }

    return (
        <div className="objectcontent gap-1 flex flex-col">
            {!_.isEmpty(imageContentList) ? (
                <div className="flex flex-wrap gap-1 justify-end">
                    {_.map(imageContentList, (message: ImageUrlMessage, index: number) => {
                        const { url, detail } = message.image_url
                        return (
                            <div
                                key={`imageContentList-${index}`}
                                className=" w-32 h-32 rounded-lg cursor-pointer overflow-hidden"
                                onClick={() => {
                                    setPreviewImageUrl(url)
                                    setOpenPreview(true)
                                }}
                            >
                                <img src={url} alt={detail || ''} className="object-cover w-full h-full" />
                            </div>
                        )
                    })}
                </div>
            ) : null}
            {textContent ? (
                <div className="flex justify-end flex-row w-full">
                    <div className="text-gray-600 bg-gray-100 rounded-3xl  px-5 py-2.5 rounded-tr-lg whitespace-pre-wrap">
                        {textContent}
                    </div>
                </div>
            ) : null}
            <ChatImagePreview imageUrl={previewImageUrl} isOpen={openPreview} closeCallback={handleClosePreview} />
        </div>
    )
}
