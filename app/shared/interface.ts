// type chatItem
export interface SystemMessage {
    role: Roles.system
    content: string
    name?: string
}

export type TextMessage = { type: 'text'; text: string }
export type ImageUrlMessage = { type: 'image_url'; image_url: { url: string; detail?: string } }
export type AzureImageUrlMessage = { type: 'image_url'; imageUrl: { url: string; detail?: string } }

export interface UserMessage {
    role: Roles.user
    content: string | (TextMessage | ImageUrlMessage | AzureImageUrlMessage)[]
    name?: string
}

export interface AssistantMessage {
    provider?: string
    role: Roles.assistant | Roles.model
    content?: string | null
    name?: string
    tool_calls?: {
        id: string
        name: string
        function: {
            name: string
            arguments: string
        }
    }[]
}

export type IChatMessage = SystemMessage | UserMessage | AssistantMessage

// type Roles
export enum Roles {
    user = 'user',
    assistant = 'assistant',
    system = 'system',
    model = 'model', // GeminiPro
}

// type history
export type IHistory = IChatMessage[]

export interface IGrahpqlAIFetchProps {
    aiid?: string
    prompt?: string
    isTopic?: boolean
    messages?: IChatMessage[]
    conversationID?: number
    maxTokens?: number
    isStream?: boolean
    queryQwen?: boolean
    qwenParams?: Record<string, any>
    queryGeminiPro?: boolean
    geminiProParams?: Record<string, any>
    queryMoonshot?: boolean
    moonshotParams?: Record<string, any>
    queryGroq?: boolean
    groqParams?: Record<string, any>
    queryClaude?: boolean
    claudeParams?: Record<string, any>
    queryErnie?: boolean
    ernieParams?: Record<string, any>
    queryOpenAI?: boolean
    openAIParams?: Record<string, any>
    queryAzureOpenAI?: boolean
    azureOpenAIParams?: Record<string, any>
    queryWorkersAI?: boolean
    workersAIParams?: Record<string, any>
    queryLingyiwanwu?: boolean
    lingyiwanwuParams?: Record<string, any>
    streamHandler?: (data: any) => void
    completeHandler?: (data: any) => void
    nonStreamHandler?: (data: any) => void
}

export type AI_BOT_TYPE = {
    id: string
    name: string
    queryType: string
    isCustom: boolean
    imageCapability: boolean
}

export type ConversationType = {
    conversation_id?: number
    topic?: string
    aiBotIDs?: string[]
}
