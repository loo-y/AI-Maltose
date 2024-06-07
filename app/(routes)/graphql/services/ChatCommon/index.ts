import _ from 'lodash'

const typeDefinitions = `
    scalar JSON
    type Query {
        chat(params: ChatArgs): Chat
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
        imageUrl: ImageUrlDetailsInput
    }

    input ImageUrlDetailsInput {
        url: String!
        detail: String
    }

    input ChatArgs {
        "Request Message List"
        messages: [Message]
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
            const { messages } = chatArgs || {}
            const fixedMessages = _.map(messages, m => {
                const { content, contentArray, ...other } = m
                if (_.isEmpty(contentArray)) {
                    return {
                        ...other,
                        content,
                    }
                }
                return {
                    ...other,
                    content: contentArray,
                }
            })
            console.log(`context.user`, context.userId)

            if (!context.userId) {
                throw new Error('Unauthorized')
            }

            return {
                ...chatArgs,
                messages: fixedMessages,
            }
        },
    },
}

export default {
    typeDefinitions,
    resolvers,
}
