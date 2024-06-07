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
        content: UserContent!
    }

    union UserContent = String | [TextImageContent]

    union TextImageContent = TextContentInput | ImageUrlInput

    input TextContentInput {
        type: String!
        content: String!
    }

    input ImageUrlInput {
        type: String!
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
            console.log(`context.user`, context.userId)
            if (!context.userId) {
                throw new Error('Unauthorized')
            }
            return {
                ...chatArgs,
            }
        },
    },
}

export default {
    typeDefinitions,
    resolvers,
}
