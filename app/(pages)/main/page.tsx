'use client'
import { useEffect, useState } from 'react'
import { useMainStore } from './providers'
import { MainStoreProvider } from './providers'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerTrigger,
  } from "@/components/ui/drawer"
import Sidebar from '@/app/modules/Sidebar'
import Chatinput from '@/app/modules/ChatInput'
import ConversationBox from '@/app/modules/ConversationBox'
import { sleep } from '../../shared/util'
  
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
        await sleep(3)
        setIsRequesting(false)
    }

    return (
        <div className="flex flex-col w-full h-full focus-visible:outline-0">
            <div className='flex-1 overflow-hidden overflow-y-scroll'>
                <div className='absolute flex flex-row  h-14 w-full items-center justify-between'>
                    <div className='topleft ml-4'>
                    <Drawer direction="left"> 
                    <DrawerTrigger>Open</DrawerTrigger>
                    <DrawerContent direction="left" className='bg-transparent rounded-tl-none rounded-r-xl h-full w-[280px] fixed bottom-0 left-0 !right-auto z-[9999] overflow-hidden'>
                        <Sidebar />
                    </DrawerContent>
                    </Drawer>
                    </div>
                    <div className='topright'>

                    </div>
                </div>
                <ConversationBox />
            </div>
            <div className='w-full p-0  border-transparent dark:border-transparent juice:w-full  min-h-[5.5rem] text-base'>
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
