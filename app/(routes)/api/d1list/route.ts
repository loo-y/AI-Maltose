import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { env } from 'process';

export const runtime = 'edge'

export async function GET(request: NextRequest) {
    const {CLOUDFLARE_BEAR_TOKEN, CLOUDFLARE_ACCOUNT_ID} = env || {}
    const options = {
        method: 'GET',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${CLOUDFLARE_BEAR_TOKEN}`}
    };
      
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database`, options);
    const result = await response.json();
    const nextResponse = NextResponse.json({ ...result }, { status: 200 })
    nextResponse.headers.set('Access-Control-Allow-Origin', '*')
    return nextResponse
}

export async function POST(request: NextRequest) {

}