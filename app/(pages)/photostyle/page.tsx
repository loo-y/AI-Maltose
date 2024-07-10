import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { SignedIn, UserButton } from '@clerk/nextjs'
import ImageOperation from './ImageOperation'
import ImageDisplay from './ImageDisplay'
import Topbar from './TopBar'
import { PhotoStyleStoreProvider } from './providers'

async function PhotoStyle() {
    const PhotoStyleList = await handleGetHairstylesByServer()

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
