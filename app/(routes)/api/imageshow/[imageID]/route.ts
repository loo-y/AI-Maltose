import { NextResponse, NextRequest } from 'next/server'
import { imageHost } from '../../utils/constants'
import { imageIDDecrypt } from '../../utils/tools'
export async function GET(request: NextRequest, { params }: { params: { imageID: string } }) {
    const { imageID } = params || {}
    console.log(`imageID`, imageID)
    try {
        // 获取 query 参数中的 URL
        const { searchParams } = new URL(request.url)
        const imageRealID = imageIDDecrypt(imageID)
        console.log(`imageRealID`, imageRealID)
        const imageUrl = `${imageHost}${imageRealID}` // searchParams.get('url')

        if (!imageUrl) {
            return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
        }

        // Fetch the image from the provided URL
        const response = await fetch(imageUrl)

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch image' }, { status: response.status })
        }

        // Get the image data as a buffer
        const imageBuffer = await response.arrayBuffer()

        // Create a new Response with the image data and appropriate headers
        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': response.headers.get('Content-Type') || '',
                'Content-Length': response.headers.get('Content-Length') || '',
            },
        })
    } catch (error) {
        // Handle errors
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
    }
}
