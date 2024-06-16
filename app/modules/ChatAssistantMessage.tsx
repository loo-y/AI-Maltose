'use client'
import React, { useEffect, useState } from 'react'
import { IHistory, Roles, IChatMessage, AssistantMessage } from '../shared/interface'
import _ from 'lodash'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter, PrismLight as SyntaxHighlighterLight } from 'react-syntax-highlighter'
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface IChatAssistantMessageProps {
    chatMessage?: AssistantMessage
    waiting?: boolean
}

const ChatAssistantMessage = ({ chatMessage, waiting }: IChatAssistantMessageProps) => {
    const { content, provider, role } = chatMessage || {}

    const handleCopy = async (textToCopy: string) => {
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(textToCopy)
            } else if (document.execCommand) {
                const textArea = document.createElement('textarea')
                textArea.value = textToCopy
                document.body.appendChild(textArea)
                textArea.select()
                document.execCommand('copy')
                document.body.removeChild(textArea)
            }
        } catch (err) {
            console.error('copy failed: ', err)
        }
    }

    return (
        <div className="w-full">
            <div className="py-2 px-3 text-base m-auto md:px-5 lg:px-1 xl:px-5 mb-3">
                <div className="mx-auto flex flex-1 gap-3 md:gap-6 md:max-w-[50rem] w-full justify-start px-4">
                    <div className="flex relative flex-row gap-3">
                        <div className="provider-icon flex-shrink-0 flex flex-col relative items-end">
                            <div className="rounded-full border border-gray-200 border-solid w-8 h-8 flex justify-center items-center">
                                <img
                                    src={`/images/providers/${provider || 'default'}.svg`}
                                    className="w-[1.125rem] h-[1.125rem]"
                                />
                            </div>
                        </div>
                        <div className="flex w-full flex-col gap-1 juice:empty:hidden juice:first:pt-[3px] text-gray-600">
                            {waiting && !content ? (
                                <div className="flex flex-row items-center flex-grow justify-start gap-1 -mr-1">
                                    <div className=" svg-image flex min-w-12 h-10 w-10 overflow-hidden items-center justify-center ">
                                        <img src={'/images/icons/three-dots-loading.svg'} className="h-8 w-8 " />
                                    </div>
                                </div>
                            ) : (
                                <div className="markdown prose w-full break-words dark:prose-invert light mt-1">
                                    <ReactMarkdown
                                        components={{
                                            code(props) {
                                                const { children, className, node, ...rest } = props
                                                const match = /language-(\w+)/.exec(className || '')
                                                const codeName = match?.[1] || ''
                                                return match ? (
                                                    <div className="text-sm leading-4 my-3 overflow-hidden overflow-x-scroll break-all break-words flex gap-0 flex-col">
                                                        <div className="flex items-center relative bg-gray-950 text-gray-300 text-token-text-secondary bg-token-main-surface-secondary px-4 py-2 text-xs font-sans justify-between rounded-t-md">
                                                            <span>{codeName}</span>
                                                            <div className="flex items-center">
                                                                <span className="" data-state="closed">
                                                                    <button
                                                                        className="flex gap-1 items-center"
                                                                        onClick={() => {
                                                                            handleCopy(
                                                                                String(children)?.replace(/\n$/, '')
                                                                            )
                                                                        }}
                                                                    >
                                                                        <img
                                                                            src="/images/icons/copy-code.svg"
                                                                            alt="copy code"
                                                                            className="w-3 h-3 text-gray-300"
                                                                        />
                                                                        Copy code
                                                                    </button>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {/* @ts-ignore */}
                                                        <SyntaxHighlighter
                                                            {...rest}
                                                            PreTag="pre"
                                                            language={codeName}
                                                            wrapLines={true}
                                                            wrapLongLines={true}
                                                            style={vscDarkPlus}
                                                            className={`rounded-b-md !mt-0`}
                                                        >
                                                            {String(children)?.replace(/\n$/, '')}
                                                        </SyntaxHighlighter>
                                                    </div>
                                                ) : (
                                                    <code
                                                        {...rest}
                                                        className={`${className || ''} text-sm leading-5 font-bold text-black whitespace-pre-wrap`}
                                                    >
                                                        {`\``}
                                                        {children}
                                                        {`\``}
                                                    </code>
                                                )
                                            },
                                        }}
                                    >
                                        {content}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatAssistantMessage
