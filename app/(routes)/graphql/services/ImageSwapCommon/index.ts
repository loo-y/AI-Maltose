import { reduceBalanceForUser, getUser } from '@/app/(routes)/graphql/dal/Supabase/queries'

const typeDefinitions = `
    scalar JSON
    type Query {
        imageSwap(params: ImageSwapArgs): ImageSwap
    }

    type Mutation {
        imageSwap(params: ImageSwapArgs): ImageSwapMutation
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

            // 判断是否有足够的balance
            const userInfo = await getUser({ userid: context.userId })
            const hasBalance = userInfo?.balance > 0
            if (!hasBalance) {
                throw new Error('Insufficient balance')
            }

            return {
                ...imageSwapArgs,
                userID: context.userId,
            }
        },
    },
    Mutation: {
        imageSwap: async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {
            const imageSwapArgs = args.params
            console.log(`context.user`, context.userId)
            if (!context.userId) {
                throw new Error('Unauthorized')
            }

            // 用一次扣一个点
            const reduceBalance = await reduceBalanceForUser({ userid: context.userId, reduceAmount: 1 })
            if (!reduceBalance) {
                throw new Error('Insufficient balance')
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
