import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { saveUserImage, getImageAIProvider } from '@/app/(routes)/graphql/dal/Supabase/queries'
import { imageIDEncrypt } from '../utils/tools'
import { tensorArtEndpoint } from '@/app/shared/constants'
import { imageHost } from '../utils/constants'

export async function GET(req: NextRequest) {
    return NextResponse.json({ message: 'GET request not allowed' }, { status: 405 })
}

export async function POST(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const styleType = searchParams.get('style') || ''
    const formDataName = searchParams.get('formDataName') || ''
    try {
        const { userId } = auth()
        const formData = await req.formData()

        const [imageData, putInfo] = await Promise.all([
            saveFormDataAsImage({ formData, userId: userId || '', styleType }),
            getResourcePutInfo({ formData, formDataName }),
        ])

        return NextResponse.json({ ...imageData, ...putInfo })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to upload image', errorInfo: error }, { status: 500 })
    }
}

const saveFormDataAsImage = async ({
    formData,
    userId,
    styleType,
}: {
    formData: FormData
    userId?: string
    styleType?: string
}) => {
    let imageID = ''
    try {
        const response = await fetch(`${imageHost}/upload`, {
            method: 'POST',
            headers: {
                Accept: 'application/json, text/javascript, */*; q=0.01',
            },
            body: formData,
        })

        const data = await response.json()
        const src = data?.[0]?.src
        if (src) {
            imageID = imageIDEncrypt(src)
            // save record to supabase
            if (userId) {
                await saveUserImage({ userid: userId, imageid: imageID, styleType: styleType || '' })
            }
        }

        return { imageID } || {}
    } catch (e) {
        console.log(`[saveFormDataAsImage] error:`, e)
    }
    return {}
}

const getResourcePutInfo = async ({ formData, formDataName }: { formData: FormData; formDataName?: string }) => {
    const env = (typeof process != 'undefined' && process?.env) || ({} as NodeJS.ProcessEnv)
    let authToken = env.TENSORART_TOKEN || ''
    if (!authToken) {
        const { api_key } = await getImageAIProvider({ providerid: `tensorArt` })
        authToken = api_key
    }

    if (!authToken) {
        return {}
    }

    try {
        const response = await fetch(`https://${tensorArtEndpoint}/v1/resource/image`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: authToken ? `Bearer ${authToken}` : '',
            },
            body: JSON.stringify({
                expireSec: `3600`, // 过期时间秒数
            }),
        })

        const putInfoData = await response.json()

        const { resourceId, putUrl, headers } = putInfoData || {}

        console.log(`putInfoData:`, putInfoData)

        // 假设图片字段名为 'file'
        const fileGetName = formDataName || `file`
        const file = formData.get(fileGetName) as Blob
        // 读取文件内容为 ArrayBuffer
        const arrayBuffer = file ? await file.arrayBuffer() : null

        const responseOfPutResource = await fetch(putUrl, {
            method: 'PUT',
            headers,
            body: arrayBuffer,
        })
        const resultOfPutResource = await responseOfPutResource.json()

        return (
            {
                ...resultOfPutResource,
                resourceId,
            } || {}
        )
    } catch (e) {
        console.log(`[getResourcePutInfo] error:`, e)
    }
    return {}
}
