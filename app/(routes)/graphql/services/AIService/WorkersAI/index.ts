// import 'dotenv/config'
import WorkersAIDal from '../../../dal/WorkersAI'
import _ from 'lodash'
import { Repeater } from 'graphql-yoga'
import { addConversationMessage, updateConversationTopic } from '../../../dal/Supabase/queries'

const typeDefinitions = `
    scalar JSON
    type Chat {
        WorkersAI(params: WorkersAIArgs): ChatResult
        WorkersAIStream(params: WorkersAIArgs): [String]
    }

    input WorkersAIArgs {
        messages: Message
        "Account ID"
        accountID: String
        "API_KEY"
        apiKey: String
        "Model Name"
        model: String
        "Max Tokens"
        maxTokens: Int
        "BaseUrl"
        baseUrl: String
    }
`
export const WorkersAI = async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {
    const {
        messages: baseMessages,
        maxTokens: baseMaxTokens,
        searchWeb,
        conversationID,
        isTopic,
        userid,
        api_key,
        api_url,
        api_model_name,
        api_account,
        aiid,
    } = parent || {}

    const workersAIArgs = args?.params || {}
    const { messages: appendMessages, apiKey, model, maxTokens, accountID, baseUrl } = workersAIArgs || {}
    const maxTokensUse = maxTokens || baseMaxTokens
    const messages = _.concat([], baseMessages || [], appendMessages || []) || []
    const key = messages.at(-1)?.content
    console.log(`key`, key)
    if (!key) {
        return { text: '' }
    }
    const text: any = await (
        await WorkersAIDal.loader(
            context,
            {
                messages,
                apiKey: api_key || apiKey,
                model: api_model_name || model,
                maxOutputTokens: maxTokensUse,
                searchWeb,
                baseUrl: api_url || baseUrl,
                accountID: api_account || accountID,
            },
            key
        )
    ).load(key)

    if (text) {
        if (isTopic) {
            await updateConversationTopic({ conversation_id: conversationID, topic: text, userid: userid })
        } else {
            await addConversationMessage({
                conversation_id: conversationID,
                role: 'ai',
                userid,
                aiid,
                content: text,
            })
        }
    }

    return { text }
}

export const WorkersAIStream = async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {
    const xvalue = new Repeater<String>(async (push, stop) => {
        const {
            messages: baseMessages,
            maxTokens: baseMaxTokens,
            searchWeb,
            conversationID,
            userid,
            isTopic,
            api_key,
            api_url,
            api_model_name,
            api_account,
            aiid,
        } = parent || {}
        const workersAIArgs = args?.params || {}
        const { messages: appendMessages, apiKey, model, maxTokens, accountID, baseUrl } = workersAIArgs || {}
        const maxTokensUse = maxTokens || baseMaxTokens
        const messages = _.concat([], baseMessages || [], appendMessages || []) || []
        const key = `${messages.at(-1)?.content || ''}_stream`

        await (
            await WorkersAIDal.loader(
                context,
                {
                    messages,
                    apiKey: api_key || apiKey,
                    model: api_model_name || model,
                    maxOutputTokens: maxTokensUse,
                    isStream: true,
                    searchWeb,
                    accountID: api_account || accountID,
                    baseUrl: api_url || baseUrl,
                    completeHandler: async ({ content, status, model }) => {
                        if (content && status && !isTopic) {
                            await addConversationMessage({
                                conversation_id: conversationID,
                                role: 'ai',
                                userid,
                                aiid,
                                content: content,
                            })
                        }
                        stop()
                    },
                    streamHandler: ({ token, status }) => {
                        if (token && status) {
                            push(token)
                        }
                    },
                },
                key
            )
        ).load(key)
    })
    return xvalue
}
const resolvers = {
    Chat: {
        WorkersAI,
        WorkersAIStream,
    },
}

export default {
    typeDefinitions,
    resolvers,
}
