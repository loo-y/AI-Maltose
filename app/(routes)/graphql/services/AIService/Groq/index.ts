// import 'dotenv/config'
import GroqDal from '../../../dal/Groq'
import _ from 'lodash'
import { Repeater } from 'graphql-yoga'
import { addConversationMessage, updateConversationTopic } from '../../../dal/Supabase/queries'

const typeDefinitions = `
    scalar JSON
    type Chat {
        Groq(params: GroqArgs): ChatResult
        GroqStream(params: GroqArgs): [String]
    }

    input GroqArgs {
        messages: Message
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
export const Groq = async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {
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
        aiid,
    } = parent || {}

    const groqArgs = args?.params || {}
    const { messages: appendMessages, apiKey, model, maxTokens } = groqArgs || {}
    const maxTokensUse = maxTokens || baseMaxTokens
    const messages = _.concat([], baseMessages || [], appendMessages || []) || []
    const key = messages.at(-1)?.content
    console.log(`key`, key)
    if (!key) {
        return { text: '' }
    }
    const text: any = await (
        await GroqDal.loader(
            context,
            {
                messages,
                apiKey: api_key || apiKey,
                model: api_model_name || model,
                maxOutputTokens: maxTokensUse,
                searchWeb,
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

export const GroqStream = async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {
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
            aiid,
        } = parent || {}
        const groqArgs = args?.params || {}
        const { messages: appendMessages, apiKey, model, maxTokens, baseUrl } = groqArgs || {}
        const maxTokensUse = maxTokens || baseMaxTokens
        const messages = _.concat([], baseMessages || [], appendMessages || []) || []
        const key = `${messages.at(-1)?.content || ''}_stream`

        await (
            await GroqDal.loader(
                context,
                {
                    messages,
                    apiKey: api_key || apiKey,
                    model: api_model_name || model,
                    maxOutputTokens: maxTokensUse,
                    isStream: true,
                    searchWeb,
                    completeHandler: async ({ content, status }) => {
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
        Groq,
        GroqStream,
    },
}

export default {
    typeDefinitions,
    resolvers,
}
