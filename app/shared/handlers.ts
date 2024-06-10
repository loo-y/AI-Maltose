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

const conversationMock: IHistory = [
    {
        role: Roles.user,
        content: `Hello, how can I help you today?`,
    },
    {
        role: Roles.assistant,
        content: `Hi there! I'm here to help. How can I assist you today?`,
    },
    {
        role: Roles.user,
        content: `那你能告诉我如何创造出一副类似这样的画吗？或者有什么简便的方法来实现吗？我没有画画的基础，但是我是一个前段开发工程师`,
    },
    {
        provider: `openai`,
        role: Roles.assistant,
        content:
            '首先，确保你已经安装了所需的依赖项。你需要 ```axios``` 来处理 HTTP 请求，以及 ```@types/react``` 和 ```@types/node``` 来提供 TypeScript 类型支持。\n在你的主应用文件中导入并使用这个组件：\n```typescript\nimport React, { useState, useEffect } from "react";\nimport axios from "axios";\n\nconst App = () => {\n  const [response, setResponse] = useState("");\n\n  useEffect(() => {\n    // Your API key\n    const apiKey = "YOUR_GPT_API_KEY";\n\n    // Your prompt\n    const prompt = "What is the best way to learn React?";\n\n    // The request body\n    const requestBody = {\n      prompt: {\n        text: prompt,\n      },\n    };\n\n    // The API endpoint\n    const endpoint = "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key={{API_KEY}}";\n\n    axios\n      .post(endpoint, requestBody, {\n        headers: {\n          "Content-Type": "application/json",\n          Authorization: `Bearer ${apiKey}`,\n        },\n      })\n      .then((res) => {\n        setResponse(res.data.candidates[0].output);\n      })\n      .catch((err) => {\n        console.error(err);\n      });\n  }, []);\n\n  return (\n    <div>\n      <p>{response}</p>\n    </div>\n  );\n};\n\nexport default App;\n```',
    },
    {
        role: Roles.user,
        content: [
            { type: 'text', text: "What's in this image? 图片里有什么？请你告诉我" },
            {
                type: 'image_url',
                image_url: {
                    url: 'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/051e54b6-668b-4186-a008-10f7af9f8eeb/width=1024,quality=90/00125-1470895961.jpeg',
                },
            },
            {
                type: 'image_url',
                image_url: {
                    url: 'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/655a1499-b331-4207-8f8e-cddeb35c13e4/width=1152,quality=90/20240404054945%202025473007%20by%20Scott%20Naismith%20and%20Aaron%20Jasinski%20and%20Jeff%20Easley%20in%20the%20style%20of%20Bess%20Hamiti%20and%20Emilia%20Wilk,%20%20movie%20still%20_lora_juggernaut_.jpeg',
                },
            },
            {
                type: 'image_url',
                image_url: {
                    url: 'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/23b690ec-c6b1-4a01-9693-30ae2860ebc3/width=1024,quality=90/00075-136686703.jpeg',
                },
            },
            {
                type: 'image_url',
                image_url: {
                    url: 'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/655a1499-b331-4207-8f8e-cddeb35c13e4/width=1152,quality=90/20240404054945%202025473007%20by%20Scott%20Naismith%20and%20Aaron%20Jasinski%20and%20Jeff%20Easley%20in%20the%20style%20of%20Bess%20Hamiti%20and%20Emilia%20Wilk,%20%20movie%20still%20_lora_juggernaut_.jpeg',
                },
            },
            {
                type: 'image_url',
                image_url: {
                    url: 'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/051e54b6-668b-4186-a008-10f7af9f8eeb/width=1024,quality=90/00125-1470895961.jpeg',
                },
            },
            {
                type: 'image_url',
                image_url: {
                    url: 'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/655a1499-b331-4207-8f8e-cddeb35c13e4/width=1152,quality=90/20240404054945%202025473007%20by%20Scott%20Naismith%20and%20Aaron%20Jasinski%20and%20Jeff%20Easley%20in%20the%20style%20of%20Bess%20Hamiti%20and%20Emilia%20Wilk,%20%20movie%20still%20_lora_juggernaut_.jpeg',
                },
            },
        ],
    },
]
