const typeDefinitions = `
    scalar JSON
    type Query {
        user(params: UserArgs): User
    }

    type Mutation {
        user(params: UserMutationArgs): UserMutation
    }

    input UserArgs {
        "ConversationID List"
        conversationIDs: [Int]
    }

    input UserMutationArgs {
        "ConversationID"
        conversationID: Int
        "Topic"
        topic: String
    }
`

const resolvers = {
    Query: {
        user: async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {
            const userArgs = args.params
            console.log(`context.user`, context.userId)
            if (!context.userId) {
                throw new Error('Unauthorized')
            }
            return {
                ...userArgs,
                userID: context.userId,
            }
        },
    },
    Mutation: {
        user: async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {
            const userArgs = args.params
            console.log(`context.user`, context.userId)
            if (!context.userId) {
                throw new Error('Unauthorized')
            }
            return {
                ...userArgs,
                userID: context.userId,
            }
        },
    },
}

export default {
    typeDefinitions,
    resolvers,
}
