import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { SignedIn, UserButton } from '@clerk/nextjs'
import ImageOperation from '@/app/(pages)/hairstyle/ImageOperation'

export default async function HairStyle() {
    const { userId } = auth()
    console.log(`page userId`, userId)
    if (!userId) {
        // 如果 auth 不存在，则重定向到登录页面
        redirect('/signin')
        return null
    }
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
                    <div className="max-w-[50rem] h-full mx-auto py-10">
                        <ImageOperation hairStyleList={HairStyleList} />
                    </div>
                </div>
            </div>
        </main>
    )
}

const handleGetHairstylesByServer = async () => {
    return [`Yi85ZmFpMmwyZTUvM2Q3NGViNWJkZjg3YTNhODRiYjFkNGZkNDA4MmI5ODNhOWVlMmQwMDYyMy5hajJwNmc=`]
}
