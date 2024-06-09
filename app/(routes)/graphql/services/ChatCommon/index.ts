import _ from 'lodash'
import { addConversationMessage, createConversation } from '../../dal/Supabase/queries'

const typeDefinitions = `
    scalar JSON
    type Query {
        chat(params: ChatArgs): Chat
    }

    type Chat {
        ChatInfo: JSON
    }

    type ChatResult {
        text: String!
    }

    input Message {
        role: String!
        content: String
        contentArray: [UserContent]
    }

    input UserContent {
        type: String!
        text: String
        image_url: ImageUrlDetailsInput
    }

    input ImageUrlDetailsInput {
        url: String!
        detail: String
    }

    input ChatArgs {
        "Request Message List"
        messages: [Message]
        "Conversation ID"
        conversationID: Int
        "Max Tokens"
        maxTokens: Int
        "Need Search Internet"
        searchWeb: Boolean
    }
`

const resolvers = {
    Query: {
        chat: async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {
            const chatArgs = args.params
            const { messages, conversationID } = chatArgs || {}
            const fixedMessages = _.map(messages, m => {
                const { content, contentArray, ...other } = m
                if (_.isEmpty(contentArray)) {
                    return {
                        ...other,
                        content,
                    }
                }
                const textContent = _.find(contentArray, c => c.type == 'text')?.text || ''
                const hasImage = _.find(contentArray, c => c.type == 'image_url')
                return {
                    ...other,
                    content: hasImage ? contentArray : textContent,
                }
            })
            console.log(`context.user`, context.userId)

            if (!context.userId) {
                throw new Error('Unauthorized')
            }

            let currentConversationID = conversationID

            const lastMessage = _.last(fixedMessages)
            // 最后一条用户的提问内容
            if (lastMessage?.role == 'user') {
                if (!conversationID) {
                    currentConversationID = await createConversation({ userid: context.userId })
                }

                await addConversationMessage({
                    conversation_id: currentConversationID,
                    role: `user`,
                    userid: context.userId,
                    content: lastMessage?.content,
                })
            }

            return {
                ...chatArgs,
                messages: fixedMessages,
                userid: context.userId,
                conversationID: currentConversationID,
            }
        },
    },
    Chat: {
        ChatInfo: (parent: TParent, args: Record<string, any>, context: TBaseContext) => {
            const { messages: baseMessages, maxTokens, conversationID } = parent || {}

            return {
                conversationID,
                maxTokens,
            }
        },
    },
}

export default {
    typeDefinitions,
    resolvers,
}
