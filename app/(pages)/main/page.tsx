'use client'
import { useEffect, useState, useCallback } from 'react'
import { useMainStore } from './providers'
import { MainStoreProvider } from './providers'
import _ from 'lodash'
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import Sidebar from '@/app/modules/Sidebar'
import Chatinput from '@/app/modules/ChatInput'
import ConversationBox from '@/app/modules/ConversationBox'
import { sleep } from '../../shared/util'
import { fetchAIGraphql } from '@/app/shared/fetches'
import { IChatMessage, Roles, IHistory } from '@/app/shared/interface'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import ImageUploadButton from '@/app/modules/ImageUploadButton'
import { handleGetAIResponse, handleGetConversation } from '@/app/shared/handlers'

const Main = () => {
    const { currentConversationID, updateCurrentConversation } = useMainStore(state => state)
    const [isFetching, setIsFetching] = useState(false)
    const [history, setHistory] = useState<IHistory>([])

    // useEffect(() => {
    //     handleGetConversation({ conversationID: 1 })
    // }, [])

    // 变更选中的对话时，移除 fetching 状态
    useEffect(() => {
        setIsFetching(false)
        // 变更对话ID时，重新获取服务端的聊天记录
        if (currentConversationID > 0) {
            handleGetConversation({ conversationID: 1 }).then(historyFromServer => {
                setHistory(historyFromServer)
            })
        }
    }, [])

    const handleChangeConversation = useCallback((conversationID: number) => {
        setIsFetching(false)
        // 变更对话ID时，重新获取服务端的聊天记录
        if (conversationID > 0) {
            handleGetConversation({ conversationID }).then(historyFromServer => {
                setHistory(historyFromServer)
            })
            updateCurrentConversation(conversationID)
        }
    }, [])

    const handleSendQuestion = async (question: string) => {
        setIsFetching(true)
        await handleGetAIResponse({
            messages: [{ role: Roles.user, content: question }],
            onStream: (content: any) => {
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
                }
            },
        })
        setIsFetching(false)
    }

    return (
        <div className="flex flex-col w-full h-full focus-visible:outline-0">
            <div className="flex-1 overflow-hidden overflow-y-scroll">
                <div className="absolute flex flex-row  h-14 w-full items-center justify-between">
                    <div className="topleft ml-4">
                        <Drawer direction="left">
                            <DrawerTrigger>Open</DrawerTrigger>
                            <DrawerContent
                                direction="left"
                                className="bg-transparent rounded-tl-none rounded-r-xl h-full w-[280px] fixed bottom-0 left-0 !right-auto z-[9999] overflow-hidden"
                            >
                                <Sidebar />
                            </DrawerContent>
                        </Drawer>
                    </div>
                    <div className="topright signmodule mr-4">
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
                </div>
                <ConversationBox history={history} isFetching={isFetching} />
            </div>
            <div className="w-full p-0  border-transparent dark:border-transparent juice:w-full  min-h-[5.5rem] text-base">
                <ImageUploadButton />
                <Chatinput isFetching={isFetching} onSendQuestion={handleSendQuestion} />
            </div>
        </div>
    )
}

const MainPage = () => {
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
            <Main></Main>
        </MainStoreProvider>
    )
}

export default MainPage
