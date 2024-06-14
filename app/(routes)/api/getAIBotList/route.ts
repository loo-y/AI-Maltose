import { NextRequest, NextResponse } from 'next/server'
import { getAIBots } from '../../graphql/dal/Supabase/queries'
import _ from 'lodash'
export const runtime = 'edge'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { aiid } = body || {}
        const aibotlist = await getAIBots({
            aiid,
        })
        if (aibotlist?.length > 0) {
            return NextResponse.json({
                AIBotList: _.map(aibotlist, aibot => {
                    const { aiid, ainame, query_type, is_custom, image_capability } = aibot || {}
                    return {
                        id: aiid,
                        name: ainame,
                        queryType: query_type, // query_type
                        isCustom: is_custom, // is_custom
                        imageCapability: image_capability, // image_capability
                    }
                }),
            })
        }
        return NextResponse.json({
            error: 'Failed to get AIBotList',
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}
