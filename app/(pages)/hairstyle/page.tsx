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
                        <ImageOperation /* hairStyleList={HairStyleList}*/ />
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
    return [
        `Yi85ZmFpMmwyZTUvM2Q3NGViNWJkZjg3YTNhODRiYjFkNGZkNDA4MmI5ODNhOWVlMmQwMDYyMy5hajJwNmc=`,
        `Yi85ZmFpMmwyZTUvMzA3NGUxNTZkMDhlYWNhZjRmYmRkMmYxNDg4MmJiOGVhMmUxMmUwNDY5My5hajJwNmc=`,
        `Yi85ZmFpMmwyZTUvM2Q3NGU5NWVkNzgzYTZhODRiYjNkZWYyNGI4M2I2OGZhNWUzMjYwNjYzMy5hajJwNmc=`,
        `Yi85ZmFpMmwyZTUvMzY3NGU4NWRkZDg0YWFhNDQ1YjJkY2Y1NDY4N2I3ODJhNGU5MmUwYzZhMy5hajJwNmc=`,
        `Yi85ZmFpMmwyZTUvMzU3MmUxNWVkYThkYWFhMjQ4YmZkM2Y0NGY4NmJlOGZhMWUzMmIwMTYxMy5hajJwNmc=`,
        `Yi85ZmFpMmwyZTUvMzU3ZGViNTlkMzg2YTZhMDQ5YjBkNmZjNDQ4NmI4OGVhYWUzMjQwYzY2My5hajJwNmc=`,
        `Yi85ZmFpMmwyZTUvM2Y3N2VmNTNkMTg0YWRhZTQ3YjlkYmY3NDQ4Y2I2OGFhYWUxMmMwNjYzMy5hajJwNmc=`,
        `Yi85ZmFpMmwyZTUvM2Y3NWU2NTZkMjgyYTdhMjQyYmZkNmY3NGM4ZGIwOGRhZWU1MmIwNjY4My5hajJwNmc=`,
        `Yi85ZmFpMmwyZTUvM2I3OWUwNTBkNjhjYThhNDQ0YjVkN2YxNGI4MWIxODBhM2U5MmYwZTY0My5hajJwNmc=`,
        `Yi85ZmFpMmwyZTUvMzg3MWU1NTVkZDg0YTRhZTQ4YmVkNGZkNGY4NGI4ODRhMmVhMjIwZjY2My5hajJwNmc=`,
        `Yi85ZmFpMmwyZTUvM2E3NGUxNWJkZjgwYThhMzQ0YmFkM2Y0NGE4OWJmODBhYmVjMmYwYTY5My5hajJwNmc=`,
    ]
}
