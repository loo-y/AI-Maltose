import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { env } from 'process'
import * as D1Fetches from '../../graphql/dal/D1/queries'
export const runtime = 'edge'

export async function GET(request: NextRequest) {
    const { CLOUDFLARE_BEAR_TOKEN, CLOUDFLARE_ACCOUNT_ID } = env || {}
    const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${CLOUDFLARE_BEAR_TOKEN}` },
    }

    // const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database`, options);
    const result = await D1Fetches.queryUserConversationMessages({ userId: '1', conversationId: 1 })
    // const result = await D1Fetches.addMessages({
    //     userId: '1',
    //     userType: 'user',
    //     conversationId: 1,
    //     message: [
    //         {
    //             content: 'hello',
    //             contentType: "text",
    //             createAt: Date.now()
    //         },
    //         {
    //             content: 'http://example.com/image2.jpg',
    //             contentType: "image",
    //             createAt: Date.now()
    //         }
    //     ]
    // })
    const nextResponse = NextResponse.json({ ...result }, { status: 200 })
    nextResponse.headers.set('Access-Control-Allow-Origin', '*')
    return nextResponse
}

export async function POST(request: NextRequest) {}
