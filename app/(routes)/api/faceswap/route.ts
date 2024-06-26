import { NextRequest, NextResponse } from 'next/server'
const env = (typeof process != 'undefined' && process?.env) || ({} as NodeJS.ProcessEnv)
import Replicate from 'replicate'
const { REPLICATE_API_TOKEN } = env || {}

const replicate = new Replicate({
    auth: REPLICATE_API_TOKEN,
})

export const runtime = 'edge'

export async function GET(request: NextRequest) {
    if (!REPLICATE_API_TOKEN) {
        return NextResponse.json({ message: 'REPLICATE_API_TOKEN not found' }, { status: 500 })
    }

    const inputImageUrl = request.nextUrl.searchParams.get('inputImageUrl')
    const targetImageUrl = request.nextUrl.searchParams.get('targetImageUrl')
    const output = await replicate.run(
        'omniedgeio/face-swap:c2d783366e8d32e6e82c40682fab6b4c23b9c6eff2692c0cf7585fc16c238cfe',
        {
            input: {
                disable_safety_checker: true,
                swap_image: inputImageUrl,
                target_image:
                    targetImageUrl ||
                    'https://www.sheepaw.com/api/imageShow/Yi85ZmFpMmwyZTUvMzc3NGVkNTFkZDhlYTVhZjQyYjRkNmZhNDY4NmIzODNhYmVkMmIwMDYyMy5hajJwNmc=',
            },
        }
    )
    console.log(output)

    const nextResponse = NextResponse.json({ output }, { status: 200 })
    nextResponse.headers.set('Access-Control-Allow-Origin', '*')
    return nextResponse
}

export async function POST(request: NextRequest) {}
