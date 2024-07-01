import { NextRequest, NextResponse } from 'next/server'
const env = (typeof process != 'undefined' && process?.env) || ({} as NodeJS.ProcessEnv)
import Replicate from 'replicate'
import { imageUrlPrefix } from '@/app/shared/constants'
import { auth, currentUser } from '@clerk/nextjs/server'

const { REPLICATE_API_TOKEN } = env || {}

const replicate = new Replicate({
    auth: REPLICATE_API_TOKEN,
})

export const runtime = 'edge'

const appDomain = 'https://sheepaw.com'

export async function GET(request: NextRequest) {
    if (!REPLICATE_API_TOKEN) {
        return NextResponse.json({ message: 'REPLICATE_API_TOKEN not found' }, { status: 500 })
    }
    const { userId } = auth()
    console.log(`userId`, userId, typeof userId)
    if (!userId) {
        return NextResponse.json({ message: 'userId not found' }, { status: 500 })
    }

    const showImage = request.nextUrl.searchParams.get('showImage')
    const inputImageUrl = request.nextUrl.searchParams.get('inputImageUrl') || undefined
    const inputID = request.nextUrl.searchParams.get('inputID') || undefined
    const hairDesc = request.nextUrl.searchParams.get('hairDesc') || ''

    return await getResponse({
        inputImageUrl,
        hairstyleDescription: hairDesc,
        inputID,
        showImage: showImage === '1',
    })
}

export async function POST(request: NextRequest) {
    const body = await request.json()
    const { inputImageUrl, hairDesc, inputID, showImage } = body || {}

    return await getResponse({
        inputImageUrl,
        inputID,
        showImage: showImage === '1',
        hairstyleDescription: hairDesc,
    })
}

const getResponse = async ({
    inputImageUrl,
    inputID,
    showImage,
    hairstyleDescription,
}: {
    inputImageUrl?: string
    inputID?: string
    showImage?: boolean
    hairstyleDescription: string
}) => {
    const inputImage = inputID ? `${appDomain}${imageUrlPrefix}/${inputID}` : inputImageUrl

    if (!inputImage || !hairstyleDescription) {
        return NextResponse.json({ message: 'inputImage not found' }, { status: 500 })
    }
    const output = await replicate.run(
        'wty-ustc/hairclip:b95cb2a16763bea87ed7ed851d5a3ab2f4655e94bcfb871edba029d4814fa587',
        {
            input: {
                image: inputImage,
                editing_type: `hairstyle`,
                disable_safety_checker: true,
                hairstyle_description: hairstyleDescription,
            },
        }
    )
    console.log(output)

    if (showImage) {
        // @ts-ignore
        const imageResponse = await fetch((output as string) || '')
        if (imageResponse.ok) {
            const imageBuffer = await imageResponse.arrayBuffer()
            const response = new NextResponse(imageBuffer)
            response.headers.set('Content-Type', 'image/jpeg')
            response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate')
            return response
        }
        // throw new Error(`Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}`);
    }

    const nextResponse = NextResponse.json({ output }, { status: 200 })
    nextResponse.headers.set('Access-Control-Allow-Origin', '*')
    return nextResponse
}
