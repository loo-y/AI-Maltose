// import 'dotenv/config'
import OpenaiDal from '../../../dal/Openai'
import _ from 'lodash'
import { Repeater } from 'graphql-yoga'
import { addConversationMessage, updateConversationTopic, addConsumptionRecords } from '../../../dal/Supabase/queries'

const typeDefinitions = `
    scalar JSON
    type Chat {
        Openai(params: OpenaiArgs): ChatResult
        OpenaiStream(params: OpenaiArgs): [String]
    }

    input OpenaiArgs {
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
export const Openai = async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {
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
    const openaiArgs = args?.params || {}
    const { messages: appendMessages, apiKey, model, maxTokens, baseUrl } = openaiArgs || {}
    const maxTokensUse = maxTokens || baseMaxTokens
    const messages = _.concat([], baseMessages || [], appendMessages || []) || []
    const key = messages.at(-1)?.content
    console.log(`key`, key)
    if (!key) {
        return { text: '' }
    }
    const text: any = await (
        await OpenaiDal.loader(
            context,
            {
                messages,
                apiKey: api_key || apiKey,
                model: api_model_name || model,
                maxOutputTokens: maxTokensUse,
                searchWeb,
                baseUrl: api_url || baseUrl,
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

export const OpenaiStream = async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {
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
        const openaiArgs = args?.params || {}
        const { messages: appendMessages, apiKey, model, maxTokens, baseUrl } = openaiArgs || {}
        const maxTokensUse = maxTokens || baseMaxTokens
        const messages = _.concat([], baseMessages || [], appendMessages || []) || []
        const key = `${messages.at(-1)?.content || ''}_stream`

        await (
            await OpenaiDal.loader(
                context,
                {
                    messages,
                    apiKey: api_key || apiKey,
                    model: api_model_name || model,
                    maxOutputTokens: maxTokensUse,
                    isStream: true,
                    searchWeb,
                    baseUrl: api_url || baseUrl,
                    completeHandler: async ({ content, status, model, usage }) => {
                        const promiseQueries = []
                        if (content && status && !isTopic) {
                            promiseQueries.push(
                                addConversationMessage({
                                    conversation_id: conversationID,
                                    role: 'ai',
                                    userid,
                                    aiid,
                                    content: content,
                                })
                            )
                        }
                        if (status && usage?.total_tokens) {
                            promiseQueries.push(
                                addConsumptionRecords({
                                    conversation_id: conversationID,
                                    aiid,
                                    userid,
                                    tokens: usage?.total_tokens,
                                })
                            )
                        }
                        promiseQueries?.length && (await Promise.all(promiseQueries))

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
        Openai,
        OpenaiStream,
    },
}

export default {
    typeDefinitions,
    resolvers,
}
