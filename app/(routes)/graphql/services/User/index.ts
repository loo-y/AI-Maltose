const typeDefinitions = `
    scalar JSON
    type Query {
        user(params: UserArgs): User
    }

    input UserArgs {
        "ConversationID List"
        conversationIDs: [Int]
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
}

export default {
    typeDefinitions,
    resolvers,
}
