import { NextRequest, NextResponse } from 'next/server'
import { imageIDEncrypt, uploadImageByUrl } from '../utils/tools'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
    return NextResponse.json({ message: 'GET request not allowed' }, { status: 405 })
}

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { imageUrl } = body || {}
    const headers = {
        Accept: 'application/json, text/javascript, */*; q=0.01',
    }
    try {
        const src = await uploadImageByUrl({ imageUrl })
        if (src) {
            const imageID = imageIDEncrypt(src)
            return NextResponse.json({ imageID })
        }
        return NextResponse.json({
            error: 'Failed to upload image',
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
    }
}
