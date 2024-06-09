import _ from 'lodash'
import SupabaseDal from '../../../dal/Supabase'
import { updateConversationTopic } from '../../../dal/Supabase/queries'

const typeDefinitions = `
    scalar JSON
    type UserMutation {
        Conversation: JSON
    }
`
export const Conversation = async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {
    const { userID, conversationID, topic } = parent || {}
    const result = await updateConversationTopic({ conversation_id: conversationID, topic, userid: userID })
    return result
}

const resolvers = {
    UserMutation: {
        Conversation,
    },
}

export default {
    typeDefinitions,
    resolvers,
}
