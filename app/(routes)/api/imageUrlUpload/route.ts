import { NextRequest, NextResponse } from 'next/server'
import { imageHost } from '../utils/constants'
import { imageIDEncrypt } from '../utils/tools'

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

export const uploadImageByUrl = async ({ imageUrl, encrypt }: { imageUrl: string; encrypt?: boolean }) => {
    const headers = {
        Accept: 'application/json, text/javascript, */*; q=0.01',
    }
    try {
        const formData = await getImageFormData(imageUrl)
        const response = await fetch(`${imageHost}/upload`, {
            method: 'POST',
            headers: {
                ...headers,
            },
            body: formData,
        })

        const data = await response.json()
        const src = data?.[0]?.src
        if (encrypt && src) {
            return imageIDEncrypt(src)
        }
        return src || ``
    } catch (e) {
        console.error(`uploadImageByUrl`, e)
    }

    return ``
}

const getImageFormData = async (imageUrl: string): Promise<FormData> => {
    try {
        // Fetch the image
        const response = await fetch(imageUrl)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        // Get the image data as a buffer
        const arrayBuffer = await response.arrayBuffer()
        const imageBuffer = Buffer.from(arrayBuffer)
        const blob = new Blob([imageBuffer], { type: `image/jpeg` })

        const formData = new FormData()

        formData.append(`image`, blob, 'blob')

        return formData
    } catch (error) {
        console.error('Error fetching image:', error)
        throw error
    }
}
