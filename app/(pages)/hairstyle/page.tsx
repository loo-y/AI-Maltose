import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { SignedIn, UserButton } from '@clerk/nextjs'
import ImageOperation from '@/app/(pages)/hairstyle/ImageOperation'
import ImageDisplay from '@/app/(pages)/hairstyle/ImageDisplay'

import { HairStyleStoreProvider } from './providers'

async function HairStyle() {
    const HairStyleList = await handleGetHairstylesByServer()

    return (
        <main className="main h-full overflow-hidden bg-paw-white-gray flex">
            <div className="w-full flex flex-col h-full focus-visible:outline-0">
                <div className="topbar flex flex-row justify-between bg-paw-white px-4 h-14 shadow-sm">
                    <div className="left flex flex-row"></div>
                    <div className="right flex flex-row items-center ">
                        <SignedIn>
                            <div className="shadow-lg w-fit h-fit items-center flex justify-center rounded-full">
                                <UserButton />
                            </div>
                        </SignedIn>
                    </div>
                </div>
                <div className="flex-1 w-full">
                    <div className="max-w-[50rem] h-full mx-auto py-10 flex flex-col">
                        <ImageOperation hairStyleList={HairStyleList} />
                        <ImageDisplay />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default async function HairStylePage() {
    const { userId } = auth()
    console.log(`page userId`, userId)
    if (!userId) {
        // 如果 auth 不存在，则重定向到登录页面
        redirect('/signin')
        return null
    }
    return (
        <HairStyleStoreProvider>
            <HairStyle></HairStyle>
        </HairStyleStoreProvider>
    )
}

const handleGetHairstylesByServer = async () => {
    return [`Yi85ZmFpMmwyZTUvM2Q3NGViNWJkZjg3YTNhODRiYjFkNGZkNDA4MmI5ODNhOWVlMmQwMDYyMy5hajJwNmc=`]
}
