import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { SignedIn, UserButton } from '@clerk/nextjs'
import ImageOperation from './ImageOperation'
import ImageDisplay from './ImageDisplay'
import Topbar from './TopBar'
import { PhotoStyleStoreProvider } from './providers'
import { Toaster } from '@/components/ui/sonner'

async function PhotoStyle() {
    return (
        <main className="main h-full overflow-hidden bg-paw-white-gray flex">
            <div className="w-full flex flex-col h-full focus-visible:outline-0">
                <Topbar />
                <div className="flex-1 w-full">
                    <div className="max-w-[50rem] h-full mx-auto py-10 flex flex-col">
                        <ImageOperation /* photoStyleList={PhotoStyleList}*/ />
                        <ImageDisplay />
                    </div>
                </div>
                <Toaster position="top-center" richColors />
            </div>
        </main>
    )
}

export default async function PhotoStylePage() {
    const { userId } = auth()
    console.log(`page userId`, userId)
    if (!userId) {
        // 如果 auth 不存在，则重定向到登录页面
        redirect('/signin')
        return null
    }
    return (
        <PhotoStyleStoreProvider>
            <PhotoStyle></PhotoStyle>
        </PhotoStyleStoreProvider>
    )
}
