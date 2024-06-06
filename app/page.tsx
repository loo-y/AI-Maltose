import MainPage from '@/app/(pages)/main/page'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export const runtime = 'edge'

export default function Home() {
    const { userId } = auth()
    console.log(`page userId`, userId)
    if (!userId) {
        // 如果 auth 不存在，则重定向到登录页面
        redirect('/signin')
        return null
    }
    return (
        <main className="main h-full overflow-hidden">
            <MainPage />
        </main>
    )
}
