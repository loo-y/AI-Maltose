// type chatItem
interface SystemMessage {
    role: Roles.system,
    content: string,
    name?: string
}

export type TextMessage = { type: 'text', text: string };
export type ImageUrlMessage = { type: 'image_url', image_url: { url: string; detail?: string } };


export interface UserMessage {
    role: Roles.user,
    content: string | (TextMessage | ImageUrlMessage)[],
    name?: string
}

export interface AssistantMessage {
    provider?: string,
    role: Roles.assistant,
    content?: string | null,
    name?: string
    tool_calls?: {
        id: string,
        name: string,
        function: {
            name: string,
            arguments: string,
        }
    }[]
}


export type IChatMessage = SystemMessage | UserMessage | AssistantMessage

// type Roles
export enum Roles {
    user = 'user',
    assistant = 'assistant',
    system = 'system',
}

// type history
export type IHistory = IChatMessage[]