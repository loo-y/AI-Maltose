import MainPage from '@/app/(pages)/main/page'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { AI_BOT_TYPE } from '@/app/shared/interface'
import { getAIBots, getUser } from '@/app/(routes)/graphql/dal/Supabase/queries'
import _ from 'lodash'

export default async function Chat() {
    const isAdmin = await handleGetUserAdmin()
    if (!isAdmin) {
        // 如果不是管理员，重定向到首页
        redirect('/')
        return null
    }
    return <main className="main h-full overflow-hidden"></main>
}

const handleGetUserAdmin = async () => {
    const { userId } = auth()
    const userInfo = await getUser({ userid: userId || '' })
    if (userInfo?.is_admin) {
        return true
    }
    return false
}
