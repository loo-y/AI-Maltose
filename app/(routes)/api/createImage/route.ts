import { NextRequest, NextResponse } from 'next/server'
import { env } from 'process'
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

    const prompt = request.nextUrl.searchParams.get('prompt')
    const inputImageUrl = request.nextUrl.searchParams.get('inputImageUrl')
    const output = await replicate.run(
        'tencentarc/photomaker:ddfc2b08d209f9fa8c1eca692712918bd449f695dabb4a958da31802a9570fe4',
        {
            input: {
                disable_safety_checker: true,
                prompt: prompt,
                num_steps: 50,
                style_name: 'Photographic (Default)',
                input_image:
                    inputImageUrl ||
                    'https://replicate.delivery/pbxt/KFkXjMgWMT8EwYXz1uVuwnOk79jyz6rQZFrmCgIIEn0JbnGc/lenna.jpg',
                num_outputs: 1,
                guidance_scale: 5,
                negative_prompt:
                    'lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry',
                style_strength_ratio: 20,
            },
        }
    )

    const nextResponse = NextResponse.json({ output }, { status: 200 })
    nextResponse.headers.set('Access-Control-Allow-Origin', '*')
    return nextResponse
}

export async function POST(request: NextRequest) {}
