const typeDefinitions = `
    scalar JSON
    type Query {
        imageSwap(params: ImageSwapArgs): ImageSwap
    }

    input KeyValuePair {
        key: String!
        value: String!
    }

    input ImageSwapArgs {
        "Swap Keys"
        keyValues: [KeyValuePair]
    }
`

const resolvers = {
    Query: {
        imageSwap: async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {
            const imageSwapArgs = args.params
            console.log(`context.user`, context.userId)
            if (!context.userId) {
                throw new Error('Unauthorized')
            }
            return {
                ...imageSwapArgs,
                userID: context.userId,
            }
        },
    },
}

export default {
    typeDefinitions,
    resolvers,
}
