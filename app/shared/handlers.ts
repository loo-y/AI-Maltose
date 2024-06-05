import _ from 'lodash'
import { sleep } from './util'
import { fetchAIGraphql, fetchUploadImage } from './fetches'
import { IChatMessage } from './interface'

export const handleUploadImage = async (imageBlob: Blob): Promise<string | null> => {
    const result = await fetchUploadImage(imageBlob)
    const { data, status } = result || {}
    if (status && data?.src) {
        return data.src
    }
    return null
}

export const handleGetAIResponse = async ({
    messages,
    onStream,
    maxTokens = 256,
}: {
    messages: IChatMessage[]
    onStream?: (arg: any) => void
    maxTokens?: number
}) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetchAIGraphql({
                messages: messages,
                isStream: onStream ? true : false,
                queryOpenAI: true,
                openAIParams: {
                    baseUrl: `https://openrouter.ai/api/v1`,
                    model: `mistralai/mistral-7b-instruct:free`,
                },
                maxTokens,
                streamHandler: (streamResult: { data: string; status?: boolean }) => {
                    console.log('streamHandler', streamResult)
                    const { data, status } = streamResult || {}
                    if (status) {
                        typeof onStream == `function` && onStream(data || ``)
                    }
                },
                completeHandler: (value: string) => {
                    typeof onStream == `function` && onStream(`__{{streamCompleted}}__`)
                    resolve(true)
                },
            })
        ),
        sleep(10),
    ])
}

// get messages and info by single conversation
export const handleGetConversation = async ({ conversationID }: { conversationID: number }) => {}
