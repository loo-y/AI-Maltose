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
    const { userId } = auth()
    const aibotlist = await getAIBots({ userid: userId || '' })
    if (!_.isEmpty(aibotlist)) {
        let AIBotList = _.map(aibotlist, aibot => {
            const { aiid, ainame, query_type, is_custom, image_capability } = aibot || {}
            return {
                id: aiid,
                name: ainame,
                queryType: query_type, // query_type
                isCustom: is_custom, // is_custom
                imageCapability: image_capability, // image_capability
            }
        })
        // gpt-4o lowerPrice 排第一个
        AIBotList = _.orderBy(AIBotList, aiBot => {
            if (aiBot.id.includes(`4o_deepbricks`)) return -1
            return 1
        })

        return AIBotList
    }

    return []
}
