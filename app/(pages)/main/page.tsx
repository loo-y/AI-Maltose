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
import {
    IChatMessage,
    Roles,
    IHistory,
    ImageUrlMessage,
    TextMessage,
    UserMessage,
    AI_BOT_TYPE,
    ConversationType,
} from '@/app/shared/interface'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { handleGetAIResponse, handleGetUserInfo, handleGetConversationHistory } from '@/app/shared/handlers'
import { useMediaQuery } from 'react-responsive'
import { Toaster } from '@/components/ui/sonner'
import Loading from './Loading'
import Link from 'next/link'

const navigation = [
    { title: 'Home', path: '/' },
    { title: 'PhotoStyle', path: '/photostyle' },
]

const Main = ({ aiBots }: { aiBots: AI_BOT_TYPE[] }) => {
    const [mounted, setMounted] = useState(false)
    const isMd = useMediaQuery({ query: '(min-width: 768px)' })
    const isMountedSmallScreen = mounted && !isMd

    const mainState = useMainStore(state => state)
    let { currentConversation, conversations, updateCurrentConversation, updateConversations, updateIsLoading } =
        mainState
    const [isFetching, setIsFetching] = useState(false)
    const [waitingForResponse, setWaitingForResponse] = useState(false)
    const [history, setHistory] = useState<IHistory>([])
    const [conversationList, setConversationList] = useState<ConversationType[]>([])
    const conversationContainerRef = useRef<HTMLDivElement>(null)
    const [hideSidebar, setHideSidebar] = useState(false)
    const [openDrawerSidebar, setOpenDrawerSidebar] = useState<boolean>(false)
    const [abortController, setAbortController] = useState<AbortController | null>(null)

    // useEffect(() => {
    //     handleGetConversation({ conversationID: 1 })
    // }, [])

    // 变更选中的对话时，移除 fetching 状态
    useEffect(() => {
        setMounted(true)
        setIsFetching(false)
        handleGetUserInfo().then(userInfo => {
            console.log(`userInfo`, userInfo)
            const { BasicInfo } = userInfo || {}
            const { conversations } = BasicInfo || {}
            // 倒排序
            // setConversationList(_.orderBy(conversations, ['conversation_id'], ['desc']))
            updateConversations(_.orderBy(conversations, ['conversation_id'], ['desc']))
        })

        // 变更对话ID时，重新获取服务端的聊天记录
        if (currentConversation?.conversation_id && currentConversation.conversation_id > 0) {
            handleGetConversationHistory({ conversationID: currentConversation.conversation_id }).then(
                historyFromServer => {
                    setHistory(historyFromServer)
                }
            )
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
        if (!isMountedSmallScreen) {
            setHideSidebar(!hideSidebar)
        }
    }

    const handleCreateNewConversation = () => {
        updateCurrentConversation({ ...currentConversation, topic: '', conversation_id: 0 })
        setHistory([])
        // refresh
        console.log(`currentConversation`, currentConversation)
    }

    const handleChangeConversation = useCallback(
        (conversationID: number) => {
            setIsFetching(false)
            // 变更对话ID时，重新获取服务端的聊天记录
            if (conversationID > 0) {
                setOpenDrawerSidebar(false)
                updateIsLoading(true)
                handleGetConversationHistory({ conversationID }).then(historyFromServer => {
                    setHistory(historyFromServer)
                    const theConversation = _.find(conversations, c => {
                        return c.conversation_id == conversationID
                    })
                    updateCurrentConversation(
                        theConversation
                            ? {
                                  conversation_id: theConversation.conversation_id,
                                  topic: theConversation.topic,
                                  aiBotIDs: theConversation.aiBotIDs,
                              }
                            : { conversation_id: conversationID, topic: '', aiBotIDs: [] }
                    )
                    setTimeout(() => {
                        // scoll to bottom
                        scrollToEnd()
                        updateIsLoading(false)
                    }, 0)
                })
            }
        },
        [conversations]
    )

    const handleUpdateTopic = async (history: IHistory) => {
        console.log(
            `handleUpdateTopic`,
            currentConversation.topic,
            currentConversation?.conversation_id,
            history.length
        )
        if (!currentConversation.topic && currentConversation?.conversation_id && history.length >= 2) {
            const { queryType, id: aiid } = _.find(aiBots, { id: currentConversation?.aiBotIDs?.[0] }) || {}

            const topicMessages = _.take(history, 4)
            const topicResult = await handleGetAIResponse({
                aiid: aiid || '',
                queryType: queryType,
                messages: [
                    ...topicMessages,
                    {
                        role: Roles.user,
                        content: `请根据上面的对话，以用户的第一人称视角总结出话题，限定一句话。不需要出现"话题是"之类的前缀。`,
                    } as UserMessage,
                ],
                conversationID: currentConversation.conversation_id,
                isTopic: true,
            })
            const chatResult = topicResult?.data?.chat || {}
            console.log(`chatResult`, topicResult, chatResult)
            const topic = _.find(_.values(chatResult), 'text')?.text || ``
            if (topic) {
                updateCurrentConversation({ ...currentConversation, topic })
                // setConversationList(_conversationList => {
                //     const newConversationList = _.map(_conversationList, item => {
                //         if (item.conversation_id === currentConversation.conversation_id) {
                //             return { ...item, topic }
                //         }
                //         return item
                //     })
                //     return newConversationList
                // })
            }
        }
    }

    const handleSendQuestion = async (question: string, imageList?: string[]) => {
        // 必须每次新建一个新的 abortController，
        // 这个新的 abortController 作为新的signal传递
        // 并且保存到 state 中
        // state 保存是异步的
        let _abortController = new AbortController()
        setAbortController(_abortController)
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
        setTimeout(() => {
            scrollToEnd()
            handleUpdateTopic(history)
        }, 100)

        const {
            queryType,
            imageCapability,
            id: aiid,
        } = _.find(aiBots, { id: currentConversation?.aiBotIDs?.[0] }) || {}
        // 只取最后5条
        let lastQuestMessages = _.takeRight([...history, { role: Roles.user, content: userContent } as UserMessage], 5)
        setHistory(_history => {
            return [
                ..._history,
                {
                    role: Roles.user,
                    content: userContent,
                },
            ]
        })
        // 没有图片处理能力时，只取文本
        if (!imageCapability) {
            lastQuestMessages = _.map(lastQuestMessages, m => {
                const { role, content } = m
                return {
                    role,
                    content: _.isString(content)
                        ? content
                        : (_.find(content, c => c.type == `text`) as TextMessage)?.text || '',
                }
            })
        }
        console.log(`currentConversation===>`, currentConversation)

        await handleGetAIResponse({
            abortController: _abortController || undefined,
            aiid,
            queryType: queryType,
            messages: lastQuestMessages,
            conversationID: currentConversation?.conversation_id || 0,
            onNonStream: (data: Record<string, any>) => {
                const { chat } = data || {}
                const { ChatInfo } = chat || {}
                console.log(`ChatInfo`, ChatInfo)
                console.log(`ChatInfo.conversationID`, ChatInfo?.conversationID)
                if (ChatInfo?.conversationID) {
                    updateCurrentConversation({ ...currentConversation, conversation_id: ChatInfo.conversationID })
                    //     setConversationList(_conversationList => {
                    //         if (_.find(_conversationList, { conversation_id: ChatInfo.conversationID })) {
                    //             return _conversationList
                    //         }
                    //         const newConversation: ConversationType = {
                    //             conversation_id: ChatInfo.conversationID,
                    //             topic: ChatInfo.topic,
                    //             aiBotIDs: [],
                    //         }
                    //         if (aiid) {
                    //             newConversation.aiBotIDs = [aiid]
                    //         }
                    //         return [newConversation, ..._conversationList]
                    //     })
                }
            },
            onStream: (content: any) => {
                console.log(`stream result`, content)
                if (content && !content.includes(`__{{streamCompleted}}__`)) {
                    // 有第一个单词返回才隐藏点点点
                    setWaitingForResponse(false)
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

    const handleAbortQuestion = () => {
        if (abortController) {
            // 检查 controller 是否存在
            abortController.abort()
            setIsFetching(false)
            setWaitingForResponse(false)
        }
    }

    const handleRetry = async () => {
        const _abortController__ = new AbortController()
        const {
            queryType,
            imageCapability,
            id: aiid,
        } = _.find(aiBots, { id: currentConversation?.aiBotIDs?.[0] }) || {}
        // 只取最后5条
        let lastQuestMessages = _.takeRight([...history], 5)
        await handleGetAIResponse({
            isRetry: true,
            abortController: _abortController__ || undefined,
            aiid,
            queryType: queryType,
            messages: lastQuestMessages,
            conversationID: currentConversation?.conversation_id || 0,
            onNonStream: (data: Record<string, any>) => {
                const { chat } = data || {}
                const { ChatInfo } = chat || {}
                console.log(`ChatInfo`, ChatInfo)
                console.log(`ChatInfo.conversationID`, ChatInfo?.conversationID)
                if (ChatInfo?.conversationID) {
                    updateCurrentConversation({ ...currentConversation, conversation_id: ChatInfo.conversationID })
                }
            },
            onStream: (content: any) => {
                console.log(`stream result`, content)
                if (content && !content.includes(`__{{streamCompleted}}__`)) {
                    // 有第一个单词返回才隐藏点点点
                    setWaitingForResponse(false)
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
        <>
            <Loading />
            <div className="w-full flex flex-row h-full focus-visible:outline-0 transition-all duration-500">
                <div
                    className={`sidebar h-full bg-gray-100 overflow-hidden hidden md:block transition-transform duration-500 ease-in-out ${hideSidebar ? sidebarHideClass : sidebarShowClass}`}
                >
                    <Sidebar
                        currentConversation={currentConversation}
                        conversationList={conversations}
                        onSelectConversation={handleChangeConversation}
                        onToggleSidebar={handleToggleSidebar}
                        onCreateNewConversation={handleCreateNewConversation}
                        isMountedSmallScreen={isMountedSmallScreen}
                    />
                </div>
                <div
                    className={`flex flex-col relative h-full focus-visible:outline-0 transition-transform duration-500 ease-in-out ${hideSidebar ? rightFullClass : rightNormalClass}`}
                >
                    <div className="flex-1 overflow-hidden overflow-y-scroll " ref={conversationContainerRef}>
                        <div className="absolute flex flex-row h-14 w-full items-center justify-between z-10 bg-white">
                            <div className="topleft ml-4 flex flex-row">
                                {hideSidebar || isMountedSmallScreen ? (
                                    <>
                                        {isMountedSmallScreen ? (
                                            <Drawer open={openDrawerSidebar} onOpenChange={setOpenDrawerSidebar}>
                                                <DrawerTrigger>
                                                    <div className=" cursor-pointer hover:bg-gray-200 w-9 h-9 rounded-lg flex items-center justify-center">
                                                        <img src="/images/icons/sidebar.svg" className="w-6 h-6" />
                                                    </div>
                                                </DrawerTrigger>
                                                <DrawerContent>
                                                    <Sidebar
                                                        currentConversation={currentConversation}
                                                        conversationList={conversations}
                                                        onSelectConversation={handleChangeConversation}
                                                        onToggleSidebar={handleToggleSidebar}
                                                        onCreateNewConversation={handleCreateNewConversation}
                                                        isMountedSmallScreen={isMountedSmallScreen}
                                                        className={`bg-white max-h-[70vh]`}
                                                    />
                                                </DrawerContent>
                                            </Drawer>
                                        ) : (
                                            <div
                                                className=" cursor-pointer hover:bg-gray-200 w-9 h-9 rounded-lg flex items-center justify-center"
                                                onClick={handleToggleSidebar}
                                            >
                                                <img src="/images/icons/sidebar.svg" className="w-6 h-6" />
                                            </div>
                                        )}
                                        <div
                                            className=" cursor-pointer hover:bg-gray-200 w-9 h-9 pt-[2px] rounded-lg flex items-center justify-center"
                                            onClick={handleCreateNewConversation}
                                        >
                                            <img src="/images/icons/create-new.svg" className="w-6 h-6" />
                                        </div>
                                    </>
                                ) : null}
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
                            <div className="topright signmodule mr-4 mt-1">
                                <ul className="text-gray-700 justify-end items-center hidden md:flex flex-row gap-2 space-y-0 space-x-6 text-sm font-medium ">
                                    {_.map(navigation, (item, idx) => {
                                        return (
                                            <li key={`navigation_${idx}`} className="duration-150 hover:text-gray-900">
                                                <Link href={item.path} className="block" target="_blank">
                                                    {item.title}
                                                </Link>
                                            </li>
                                        )
                                    })}
                                    <li>
                                        <div className="mt-2">
                                            <SignedIn>
                                                <UserButton />
                                            </SignedIn>
                                        </div>
                                    </li>
                                </ul>
                                <div className="mt-2 md:hidden flex">
                                    <SignedIn>
                                        <UserButton />
                                    </SignedIn>
                                </div>
                            </div>
                        </div>
                        <ConversationBox
                            history={history}
                            isFetching={isFetching}
                            waiting={waitingForResponse}
                            handleRetry={handleRetry}
                        />
                    </div>
                    <div className="w-full p-0  border-transparent dark:border-transparent juice:w-full  min-h-[5.5rem] text-base">
                        <Chatinput
                            isFetching={isFetching}
                            onSendQuestion={handleSendQuestion}
                            onAbortQuestion={handleAbortQuestion}
                            imageCapability={
                                _.find(aiBots, { id: currentConversation?.aiBotIDs?.[0] })?.imageCapability
                            }
                        />
                    </div>
                </div>
                <Toaster position="top-center" richColors />
            </div>
        </>
    )
}

const MainPage = ({ aiBots }: { aiBots: AI_BOT_TYPE[] }) => {
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
