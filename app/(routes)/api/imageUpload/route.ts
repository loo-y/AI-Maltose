import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    return NextResponse.json({ message: 'GET request not allowed' }, { status: 405 })
}

export async function POST(req: NextRequest) {
    const headers = {
        Accept: 'application/json, text/javascript, */*; q=0.01',
    }
    try {
        const formData = await req.formData()
        const response = await fetch('https://telegra.ph/upload', {
            method: 'POST',
            headers: {
                ...headers,
            },
            body: formData,
        })

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
    }
}
