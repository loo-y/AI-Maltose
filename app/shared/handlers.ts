import _ from 'lodash'
import { sleep } from './util'
import { fetchAIGraphql, fetchUploadImage, fetchUserInfoGraphql, fetchConversationMessagesGraphql } from './fetches'
import { IChatMessage, Roles, IHistory } from './interface'

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
}: {
    messages: IChatMessage[]
    conversationID: number
    onStream?: (arg: any) => void
    onNonStream?: (arg: any) => void
    maxTokens?: number
    isTopic?: boolean
}) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetchAIGraphql({
                isTopic,
                messages: messages,
                conversationID,
                isStream: onStream ? true : false,
                queryOpenAI: true,
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
                    typeof onStream == `function` && onStream(`__{{streamCompleted}}__`)
                    // resolve(true)
                },
            }).then(res => {
                console.log(`fetchAIGraphql===>`, res)
                resolve(res)
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

export const handleGetAIBots = async () => {
    return aibotMock
}

const aibotMock = [
    {
        id: `openai_gpt-4o`,
        name: `GPT-4o`,
        queryType: `queryOpenAI`, // query_type
        isCustom: false, // is_custom
        imageCapability: true, // image_capability
    },
    // {
    //     id: `gemini_pro_1.5`,
    //     name: `Gemini Pro 1.5`,
    //     queryType: `queryOpenAI`,
    //     isCustom: false,
    // },
]
