// import 'dotenv/config'
import { queryUserConversationMessages } from '../../../dal/D1/queries'
import _ from 'lodash'
import { Repeater } from 'graphql-yoga'

const typeDefinitions = `
    scalar JSON
    type User {
        conversationMessages: [JSON]
    }
`

export const ConversationMessages = async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {
    const { conversationID, userID } = parent || {}
    const messages = await queryUserConversationMessages({ userID, conversationID })
    return {
        messages,
    }
}

const resolvers = {
    User: {
        ConversationMessages,
    },
}

export default {
    typeDefinitions,
    resolvers,
}
