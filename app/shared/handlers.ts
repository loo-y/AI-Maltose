import _ from 'lodash'
import { sleep } from './util'
import {
    fetchAIGraphql,
    fetchUploadImage,
    fetchUserInfoGraphql,
    fetchConversationMessagesGraphql,
    fetchAIBotListGraphql,
    fetchFaceSwapGraphql,
} from './fetches'
import { IChatMessage, Roles, AI_BOT_TYPE } from './interface'

export const handleUploadImage = async (imageBlob: Blob): Promise<string | null> => {
    const result = await fetchUploadImage(imageBlob)
    const { data, status } = result || {}
    if (status && data?.imageID) {
        return data.imageID
    }
    return null
}

export const handleGetAIResponse = async ({
    messages,
    conversationID,
    onStream,
    onNonStream,
    maxTokens = 2048,
    isTopic,
    queryType,
    aiid,
    abortController,
}: {
    messages: IChatMessage[]
    conversationID: number
    onStream?: (arg: any) => void
    onNonStream?: (arg: any) => void
    maxTokens?: number
    isTopic?: boolean
    queryType?: string
    aiid?: string
    abortController?: AbortController
}) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetchAIGraphql({
                abortController,
                aiid,
                isTopic,
                messages: messages,
                conversationID,
                isStream: onStream ? true : false,
                [queryType || 'queryOpenAI']: true,
                maxTokens,
                streamHandler: (streamResult: { content: string; status?: boolean }) => {
                    console.log('streamHandler', streamResult)
                    const { content, status } = streamResult || {}
                    if (status) {
                        typeof onStream == `function` && onStream(content || ``)
                    }
                },
                nonStreamHandler: (data: Record<string, any>) => {
                    console.log(`data nonStreamHandler`, data)
                    typeof onNonStream == `function` && onNonStream(data)
                },
                completeHandler: (value: string) => {
                    console.log(`completeHandler`, value)
                    typeof onStream == `function` && onStream(`__{{streamCompleted}}__`)
                    // resolve(true)
                },
            })
                .then(res => {
                    console.log(`fetchAIGraphql===>`, res)
                    resolve(res)
                })
                .catch(err => {
                    console.log(`fetchAIGraphql===> error`, err)
                    reject(err)
                })
        ) as Promise<any>,
        sleep(10),
    ])
}

// get messages and info by single conversation
export const handleGetConversationHistory = async ({ conversationID }: { conversationID: number }) => {
    const result = await fetchConversationMessagesGraphql({ conversationID })
    const { data, status } = result || {}
    console.log(`data.user.Histories`, data.user.Histories)
    if (status && data?.user?.Histories?.[0]) {
        const groupedData = _.groupBy(data.user.Histories[0], `messageid`)
        const groupedArray = _.values(
            _.mapValues(groupedData, (group, key) => {
                return _.sortBy(group, item => _.findIndex(data, item))
            })
        )

        const chatMessages: IChatMessage[] = _.map(groupedArray, items => {
            const { sender_type, content } = items?.[0] || {}
            const isAssistant = sender_type === `ai`
            return {
                role: isAssistant ? Roles.assistant : Roles.user,
                content: isAssistant
                    ? content
                    : _.map(items, item => {
                          const { content_type, content } = item || {}
                          if (content_type === `image_url`) {
                              return { type: 'image_url', image_url: { url: content } }
                          }
                          return { type: 'text', text: content }
                      }),
            }
        })
        return chatMessages
    }
    return []
}

export const handleGetUserInfo = async () => {
    const ressult = await fetchUserInfoGraphql()
    const { data, status } = ressult || {}

    if (status && data?.user) {
        return data.user
    }

    return null
}

export const handleGetAIBots = async (): Promise<AI_BOT_TYPE[]> => {
    const result = await fetchAIBotListGraphql()
    const { data, status } = result || {}
    console.log(`data handleGetAIBots`, data)
    if (status && data?.user?.AIBotList) {
        return data.user.AIBotList
    }

    return []
}

export const handleGetFaceSwapImages = async ({
    inputID,
    inputImageUrl,
    targetIDs,
}: {
    inputID?: string
    inputImageUrl?: string
    targetIDs: string[]
}) => {
    const result = await fetchFaceSwapGraphql({
        provider: 'replicate',
        inputID,
        inputImageUrl,
        targetIDs,
    })
    const { data, status } = result || {}
    if (status && data?.FaceSwap) {
        return data.FaceSwap
    }
    return []
}
