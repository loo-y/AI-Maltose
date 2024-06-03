'use client'
import { useEffect, useState } from 'react'
import { useMainStore } from './providers'
import { MainStoreProvider } from './providers'
import _ from 'lodash'
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import Sidebar from '@/app/modules/Sidebar'
import Chatinput from '@/app/modules/ChatInput'
import ConversationBox from '@/app/modules/ConversationBox'
import { sleep } from '../../shared/util'
import { fetchAIGraphql } from '@/app/shared/fetches'
import { IChatMessage, Roles } from '@/app/shared/interface'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import ImageUploadButton from '@/app/modules/ImageUploadButton'

const Main = () => {
    const { isloading, updateIsLoading } = useMainStore(state => state)
    const [isRequesting, setIsRequesting] = useState(false)
    useEffect(() => {
        let vh = window.innerHeight * 0.01
        // Then we set the value in the --vh custom property to the root of the document
        document.documentElement.style.setProperty('--vh', `${vh}px`)

        // We listen to the resize event
        window.addEventListener('resize', () => {
            // We execute the same script as before
            let vh = Math.min(document?.documentElement?.clientHeight || window.innerHeight, window.innerHeight) * 0.01
            console.log(`resizing, new view height`, vh)
            document.documentElement.style.setProperty('--vh', `${vh}px`)
        })
    }, [])

    const handleSendQuestion = async (question: string) => {
        setIsRequesting(true)
        await helperGetAIResponse({
            messages: [{ role: Roles.user, content: question }],
        })
        setIsRequesting(false)
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
                <ConversationBox />
            </div>
            <div className="w-full p-0  border-transparent dark:border-transparent juice:w-full  min-h-[5.5rem] text-base">
                <ImageUploadButton />
                <Chatinput isRequesting={isRequesting} onSendQuestion={handleSendQuestion} />
            </div>
        </div>
    )
}

const MainPage = () => {
    return (
        <MainStoreProvider>
            <Main></Main>
        </MainStoreProvider>
    )
}

export default MainPage

const helperGetAIResponse = async ({
    messages,
    onStream,
}: {
    messages: IChatMessage[]
    onStream?: (arg: any) => void
}) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetchAIGraphql({
                messages,
                // isStream: true,
                queryOpenAI: true,
                openAIParams: {
                    baseUrl: `https://openrouter.ai/api/v1`,
                    model: `mistralai/mistral-7b-instruct:free`,
                },
                maxTokens: 100,
                // queryGroq: true,
                streamHandler: (streamResult: { data: string; status?: boolean }) => {
                    console.log('streamHandler', streamResult)
                    const { data, status } = streamResult || {}
                    if (status) {
                        typeof onStream == `function` && onStream(data || ``)
                    }
                },
                completeHandler: (value: string) => {
                    typeof onStream == `function` && onStream(`__{{streamCompleted}}__`)
                    resolve(true)
                },
            })
        ),
        sleep(10),
    ])
}
