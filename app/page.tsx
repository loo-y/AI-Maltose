import MainPage from '@/app/(pages)/main/page'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { AI_BOT_TYPE } from '@/app/shared/interface'
import { getAIBots } from '@/app/(routes)/graphql/dal/Supabase/queries'
import _ from 'lodash'

export default async function Home() {
    const { userId } = auth()
    console.log(`page userId`, userId)
    if (!userId) {
        // 如果 auth 不存在，则重定向到登录页面
        redirect('/signin')
        return null
    }
    const AIBots = await handleGetAIBotsByServer()
    return (
        <main className="main h-full overflow-hidden">
            <MainPage aiBots={AIBots} />
        </main>
    )
}

const handleGetAIBotsByServer = async (): Promise<AI_BOT_TYPE[]> => {
    const aibotlist = await getAIBots({})
    if (!_.isEmpty(aibotlist)) {
        const AIBotList = _.map(aibotlist, aibot => {
            const { aiid, ainame, query_type, is_custom, image_capability } = aibot || {}
            return {
                id: aiid,
                name: ainame,
                queryType: query_type, // query_type
                isCustom: is_custom, // is_custom
                imageCapability: image_capability, // image_capability
            }
        })

        return AIBotList
    }

    return []
}
