import { NextRequest, NextResponse } from 'next/server'
import { imageHost } from '../utils/constants'
import { imageIDEncrypt } from '../utils/tools'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
    return NextResponse.json({ message: 'GET request not allowed' }, { status: 405 })
}

export async function POST(req: NextRequest) {
    const headers = {
        Accept: 'application/json, text/javascript, */*; q=0.01',
    }
    try {
        const formData = await req.formData()
        const response = await fetch(`${imageHost}/upload`, {
            method: 'POST',
            headers: {
                ...headers,
            },
            body: formData,
        })

        const data = await response.json()
        const src = data?.[0]?.src
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
