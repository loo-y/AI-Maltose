// import 'dotenv/config'
import AzureOpenaiDal from '../../../dal/AzureOpenai'
import _ from 'lodash'
import { Repeater } from 'graphql-yoga'
import { addConversationMessage, updateConversationTopic, addConsumptionRecords } from '../../../dal/Supabase/queries'

const typeDefinitions = `
    scalar JSON
    type Chat {
        AzureOpenai(params: AzureOpenaiArgs): ChatResult
        AzureOpenaiStream(params: AzureOpenaiArgs): [String]
    }

    input AzureOpenaiArgs {
        messages: Message
        "API_KEY"
        apiKey: String
        "ENDPOINT"
        endpoint: String
        "Model Name"
        model: String
        "Max Tokens"
        maxTokens: Int
    }
`
export const AzureOpenai = async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {
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

    const azureOpenaiArgs = args?.params || {}
    const { messages: appendMessages, apiKey, model, maxTokens, endpoint } = azureOpenaiArgs || {}
    const maxTokensUse = maxTokens || baseMaxTokens
    const messages = _.concat([], baseMessages || [], appendMessages || []) || []
    const key = messages.at(-1)?.content
    console.log(`key`, key)
    if (!key) {
        return { text: '' }
    }
    const text: any = await (
        await AzureOpenaiDal.loader(
            context,
            {
                messages,
                apiKey: apiKey || api_key,
                model: model || api_model_name,
                maxOutputTokens: maxTokensUse,
                searchWeb,
                endpoint: endpoint || api_url,
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

export const AzureOpenaiStream = async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {
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
        const azureOpenaiArgs = args?.params || {}
        const { messages: appendMessages, apiKey, model, maxTokens, endpoint } = azureOpenaiArgs || {}
        const maxTokensUse = maxTokens || baseMaxTokens
        const messages = _.concat([], baseMessages || [], appendMessages || []) || []
        const key = `${messages.at(-1)?.content || ''}_stream`

        await (
            await AzureOpenaiDal.loader(
                context,
                {
                    messages,
                    apiKey: apiKey || api_key,
                    model: model || api_model_name,
                    maxOutputTokens: maxTokensUse,
                    endpoint: endpoint || api_url,
                    isStream: true,
                    searchWeb,

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
        AzureOpenai,
        AzureOpenaiStream,
    },
}

export default {
    typeDefinitions,
    resolvers,
}
