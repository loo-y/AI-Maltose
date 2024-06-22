import _ from 'lodash'
import SupabaseDal from '../../../dal/Supabase'

const typeDefinitions = `
    scalar JSON
    type User {
        AIBotList(params: AIBotListArgs): [JSON]
    }

    input AIBotListArgs {
        "Specific AI Bot ID"
        aiid: String
    }
`
export const AIBotList = async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {
    const { userID } = parent || {}
    const { aiid } = args?.params || {}
    if (!userID) {
        return []
    }

    const loader = SupabaseDal.loadAIBotList(context, { aiid, userid: userID }, userID)
    const aiBotList = (await loader.load({})) || []

    return aiBotList
}

const resolvers = {
    User: {
        AIBotList: AIBotList,
    },
}

export default {
    typeDefinitions,
    resolvers,
}
