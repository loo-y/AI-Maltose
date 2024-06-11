'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useMainStore } from './providers'
import { MainStoreProvider } from './providers'
import _ from 'lodash'
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import Sidebar from '@/app/modules/Sidebar'
import Chatinput from '@/app/modules/ChatInput'
import ConversationBox from '@/app/modules/ConversationBox'
import AISelection from '@/app/modules/AISelection'
import { sleep } from '../../shared/util'
import { fetchAIGraphql } from '@/app/shared/fetches'
import { IChatMessage, Roles, IHistory, ImageUrlMessage, TextMessage, UserMessage } from '@/app/shared/interface'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import {
    handleGetAIResponse,
    handleGetUserInfo,
    handleGetConversationHistory,
    handleGetAIBots,
} from '@/app/shared/handlers'

const Main = ({ aiBots }: { aiBots: Record<string, any>[] }) => {
    console.log(`aiBots`, aiBots)
    const mainState = useMainStore(state => state)
    let { currentConversation, updateCurrentConversation } = mainState
    const [isFetching, setIsFetching] = useState(false)
    const [waitingForResponse, setWaitingForResponse] = useState(false)
    const [history, setHistory] = useState<IHistory>([])
    const [conversationList, setConversationList] = useState<{ conversation_id: number; topic: string }[]>([])
    const conversationContainerRef = useRef<HTMLDivElement>(null)
    const [hideSidebar, setHideSidebar] = useState(false)
    // useEffect(() => {
    //     handleGetConversation({ conversationID: 1 })
    // }, [])

    // 变更选中的对话时，移除 fetching 状态
    useEffect(() => {
        setIsFetching(false)
        handleGetUserInfo().then(userInfo => {
            console.log(`userInfo`, userInfo)
            const { BasicInfo } = userInfo || {}
            const { conversations } = BasicInfo || {}
            // 倒排序
            setConversationList(_.orderBy(conversations, ['conversation_id'], ['desc']))
        })

        // 变更对话ID时，重新获取服务端的聊天记录
        if (currentConversation?.id && currentConversation.id > 0) {
            handleGetConversationHistory({ conversationID: currentConversation.id }).then(historyFromServer => {
                setHistory(historyFromServer)
            })
        }
    }, [])

    const scrollToEnd = useCallback(() => {
        if (conversationContainerRef.current) {
            const theElement = conversationContainerRef.current as HTMLElement
            theElement.scrollTo(0, theElement.scrollHeight)
            console.log(`theElement.scrollHeight`, theElement.scrollHeight)
        }
    }, [isFetching])

    const handleToggleSidebar = () => {
        setHideSidebar(!hideSidebar)
    }

    const handleCreateNewConversation = () => {
        updateCurrentConversation({ id: 0 })
        setHistory([])
        // refresh
        console.log(`currentConversation`, currentConversation)
    }

    const handleChangeConversation = useCallback((conversationID: number) => {
        setIsFetching(false)
        // 变更对话ID时，重新获取服务端的聊天记录
        if (conversationID > 0) {
            handleGetConversationHistory({ conversationID }).then(historyFromServer => {
                setHistory(historyFromServer)
                updateCurrentConversation({ id: conversationID })
            })
        }
    }, [])

    const handleUpdateTopic = async () => {
        if (!currentConversation.topic && currentConversation?.id && history.length >= 4) {
            const topicMessages = _.take(history, 4)
            const topicResult = await handleGetAIResponse({
                messages: [
                    ...topicMessages,
                    { role: Roles.user, content: `请根据上面的对话，总结出话题，限定一句话。` } as UserMessage,
                ],
                conversationID: currentConversation.id,
                isTopic: true,
            })
            const chatResult = topicResult?.data?.chat || {}
            console.log(`chatResult`, topicResult, chatResult)
            const topic = _.find(_.values(chatResult), 'text')?.text || ``
            if (topic) {
                updateCurrentConversation({ topic })
                setConversationList(_conversationList => {
                    const newConversationList = _.map(_conversationList, item => {
                        if (item.conversation_id === currentConversation.id) {
                            return { ...item, topic }
                        }
                        return item
                    })
                    return newConversationList
                })
            }
        }
    }

    const handleSendQuestion = async (question: string, imageList?: string[]) => {
        setWaitingForResponse(true)
        setIsFetching(true)
        console.log(`imageList`, imageList)
        const userContent = _.isEmpty(imageList)
            ? question
            : [
                  { type: 'text', text: question } as TextMessage,
                  ..._.map(imageList, imgSrc => {
                      return { type: 'image_url', image_url: { url: imgSrc } } as ImageUrlMessage
                  }),
              ]
        setHistory(_history => {
            return [
                ..._history,
                {
                    role: Roles.user,
                    content: userContent,
                },
            ]
        })
        setTimeout(() => scrollToEnd(), 100)
        handleUpdateTopic()

        // 只取最后5条
        const lastQuestMessages = _.takeRight(
            [...history, { role: Roles.user, content: userContent } as UserMessage],
            5
        )
        console.log(`currentConversation===>`, currentConversation)
        await handleGetAIResponse({
            messages: lastQuestMessages,
            conversationID: currentConversation?.id || 0,
            onNonStream: (data: Record<string, any>) => {
                const { chat } = data || {}
                const { ChatInfo } = chat || {}
                console.log(`ChatInfo`, ChatInfo)
                console.log(`ChatInfo.conversationID`, ChatInfo?.conversationID)
                if (ChatInfo?.conversationID) {
                    updateCurrentConversation({ id: ChatInfo.conversationID })
                    setConversationList(_conversationList => {
                        if (_.find(_conversationList, { conversation_id: ChatInfo.conversationID })) {
                            return _conversationList
                        }
                        return [
                            { conversation_id: ChatInfo.conversationID, topic: ChatInfo.topic },
                            ..._conversationList,
                        ]
                    })
                }
            },
            onStream: (content: any) => {
                setWaitingForResponse(false)
                console.log(`stream result`, content)
                if (content && !content.includes(`__{{streamCompleted}}__`)) {
                    setHistory(_history => {
                        const newHistory = [..._history]
                        if (newHistory?.at(-1)?.role !== Roles.assistant) {
                            newHistory.push({
                                role: Roles.assistant,
                                content,
                            })
                        } else {
                            newHistory!.at(-1)!.content += content
                        }
                        return newHistory
                    })
                    scrollToEnd()
                } else if (content.includes(`__{{streamCompleted}}__`)) {
                    setIsFetching(false)
                    setWaitingForResponse(false)
                }
            },
        })
    }

    const sidebarHideClass = `md:hidden`
    const sidebarShowClass = `w-[280px]`
    const rightFullClass = `w-full`
    const rightNormalClass = `flex-1`
    return (
        <div className="w-full flex flex-row h-full focus-visible:outline-0 transition-all duration-500">
            <div
                className={`sidebar h-full bg-gray-100 overflow-hidden hidden md:block transition-transform duration-500 ease-in-out ${hideSidebar ? sidebarHideClass : sidebarShowClass}`}
            >
                <Sidebar
                    conversationList={conversationList}
                    onSelectConversation={handleChangeConversation}
                    onToggleSidebar={handleToggleSidebar}
                    onCreateNewConversation={handleCreateNewConversation}
                />
            </div>
            <div
                className={`flex flex-col relative h-full focus-visible:outline-0 transition-transform duration-500 ease-in-out ${hideSidebar ? rightFullClass : rightNormalClass}`}
            >
                <div className="flex-1 overflow-hidden overflow-y-scroll " ref={conversationContainerRef}>
                    <div className="absolute flex flex-row h-14 w-full items-center justify-between">
                        <div className="topleft ml-4 flex flex-row">
                            {hideSidebar && (
                                <>
                                    <div
                                        className=" cursor-pointer hover:bg-gray-200 w-9 h-9 rounded-lg flex items-center justify-center"
                                        onClick={handleToggleSidebar}
                                    >
                                        <img src="/images/icons/sidebar.svg" className="w-6 h-6" />
                                    </div>
                                    <div
                                        className=" cursor-pointer hover:bg-gray-200 w-9 h-9 pt-[2px] rounded-lg flex items-center justify-center"
                                        onClick={handleCreateNewConversation}
                                    >
                                        <img src="/images/icons/create-new.svg" className="w-6 h-6" />
                                    </div>
                                </>
                            )}
                            <div className="flex items-center justify-center">
                                <AISelection aiBots={aiBots} mainState={mainState} />
                            </div>
                            {/* <Drawer direction="left">
                                <DrawerTrigger>Open</DrawerTrigger>
                                <DrawerContent
                                    direction="left"
                                    className="bg-transparent rounded-tl-none rounded-r-xl h-full w-[280px] fixed bottom-0 left-0 !right-auto z-[9999] overflow-hidden"
                                >
                                    <Sidebar />
                                </DrawerContent>
                            </Drawer> */}
                        </div>
                        <div className="topright signmodule mr-4">
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>
                    </div>
                    <ConversationBox history={history} isFetching={isFetching} waiting={waitingForResponse} />
                </div>
                <div className="w-full p-0  border-transparent dark:border-transparent juice:w-full  min-h-[5.5rem] text-base">
                    <Chatinput isFetching={isFetching} onSendQuestion={handleSendQuestion} />
                </div>
            </div>
        </div>
    )
}

const MainPage = ({ aiBots }: { aiBots: Record<string, any>[] }) => {
    useEffect(() => {
        let vh = window.innerHeight * 0.01
        // Then we set the value in the --vh custom property to the root of the document
        document.documentElement.style.setProperty('--vh', `${vh}px`)
        console.log(`user useEffect`)
        // We listen to the resize event
        window.addEventListener('resize', () => {
            // We execute the same script as before
            let vh = Math.min(document?.documentElement?.clientHeight || window.innerHeight, window.innerHeight) * 0.01
            console.log(`resizing, new view height`, vh)
            document.documentElement.style.setProperty('--vh', `${vh}px`)
        })
    }, [])

    return (
        <MainStoreProvider>
            <Main aiBots={aiBots}></Main>
        </MainStoreProvider>
    )
}

export default MainPage
