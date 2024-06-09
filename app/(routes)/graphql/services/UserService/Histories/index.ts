import _ from 'lodash'
import SupabaseDal from '../../../dal/Supabase'

const typeDefinitions = `
    scalar JSON
    type User {
        Histories: [JSON]
    }
`
export const Histories = async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {
    const { userID, conversationIDs } = parent || {}
    let conversationList = conversationIDs || []

    if (_.isEmpty(conversationList)) {
        return []
    }
    const loader = SupabaseDal.loaderConversationsHistory(context, { userid: userID }, conversationIDs)
    const histories = (await loader.loadMany(conversationIDs)) || []

    return histories
}

const resolvers = {
    User: {
        Histories: Histories,
    },
}

export default {
    typeDefinitions,
    resolvers,
}
