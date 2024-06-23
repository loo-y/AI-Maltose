import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { SignedIn, UserButton } from '@clerk/nextjs'

export default async function Painting() {
    const { userId } = auth()
    console.log(`page userId`, userId)
    if (!userId) {
        // 如果 auth 不存在，则重定向到登录页面
        redirect('/signin')
        return null
    }

    return (
        <main className="main h-full overflow-hidden bg-paw-gray">
            <div className="w-full flex flex-col h-full focus-visible:outline-0">
                <div className="topbar flex flex-row justify-between bg-paw-black px-4 h-14">
                    <div className="left flex flex-row"></div>
                    <div className="right flex flex-row">
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
                </div>
            </div>
        </main>
    )
}
