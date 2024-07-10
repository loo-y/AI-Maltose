import {
    IChatMessage,
    Roles,
    SystemMessage,
    UserMessage,
    AssistantMessage,
    TextMessage,
    ImageUrlMessage,
    AzureImageUrlMessage,
} from '@/app/shared/interface'
export { Roles }
export type {
    IChatMessage,
    SystemMessage,
    UserMessage,
    AssistantMessage,
    TextMessage,
    ImageUrlMessage,
    AzureImageUrlMessage,
}

export interface IMessage {
    role: Roles
    content: string
    tool_call_id?: string | undefined
    name?: string | undefined
}

export interface IClaudeMessage {
    role: Roles
    content: { type: string; text: string }[]
}

export interface ICommonDalArgs {
    messages?: IChatMessage[]
    model?: string
    apiKey?: string
    isStream?: boolean
    maxOutputTokens?: number
    searchWeb?: boolean
    completeHandler?: (params: {
        content: string
        status: boolean
        model?: string
        usage?: { completion_tokens?: number; prompt_tokens?: number; total_tokens?: number }
    }) => void
    streamHandler?: (params: { token: string; status: boolean }) => void
}

export interface IGeminiProDalArgs extends ICommonDalArgs {
    apiVersion?: string
}
export interface IErnieDalArgs extends ICommonDalArgs {
    secretKey?: string
}

export interface IAzureOpenaiArgs extends ICommonDalArgs {
    endpoint?: string
}

export interface IOpenaiArgs extends ICommonDalArgs {
    baseUrl?: string

    messages?: IChatMessage[]
}

export interface IWorkersAIArgs extends ICommonDalArgs {
    baseUrl?: string

    accountID?: string
}
