// import 'dotenv/config'
import DataLoader from 'dataloader'
import {
    ICommonDalArgs,
    Roles,
    IAzureOpenaiArgs,
    IChatMessage,
    SystemMessage,
    UserMessage,
    AssistantMessage,
    ImageUrlMessage,
    AzureImageUrlMessage,
} from '../../types'
import { OpenAIClient, AzureKeyCredential } from '@azure/openai'
import _ from 'lodash'
import { generationConfig } from '../../utils/constants'
import { getInternetSerchResult } from '../../utils/tools'
import { searchWebSystemMessage, searchWebTool } from '../../utils/constants'
import { ChatCompletionsFunctionToolCall } from '@azure/openai'

const availableFunctions: Record<string, any> = {
    get_internet_serch_result: getInternetSerchResult,
}

const DEFAULT_MODEL_NAME = `gpt-35-turbo` // deploymentId
// const DEFAULT_MODEL_NAME = `gpt-4`

const convertMessages = (messages: ICommonDalArgs['messages']): { history: IChatMessage[] } => {
    let history = _.map(messages, message => {
        const { role, content } = message || {}
        switch (role) {
            case Roles.system:
                return {
                    role: Roles.system,
                    content: content,
                } as SystemMessage
            case Roles.user:
                let newContent = content
                if (Array.isArray(newContent)) {
                    newContent = _.map(newContent, nc => {
                        const { type } = nc || {}
                        if (type == `image_url`) {
                            const { image_url } = nc as ImageUrlMessage
                            return {
                                type,
                                imageUrl: image_url, // fix as AzureImageUrlMessage
                            } as AzureImageUrlMessage
                        }
                        return nc
                    })
                }
                return {
                    role: Roles.user,
                    content: newContent,
                } as UserMessage
            default:
                return {
                    role: Roles.assistant,
                    content: content,
                } as AssistantMessage
        }
    })
    return {
        history: history,
    }
}

const fetchAzureOpenai = async (ctx: TBaseContext, params: Record<string, any>, options: Record<string, any> = {}) => {
    const {
        messages,
        apiKey,
        endpoint,
        model: modelName,
        isStream,
        maxOutputTokens,
        completeHandler,
        streamHandler,
        searchWeb,
    } = params || {}
    const env = (typeof process != 'undefined' && process?.env) || ({} as NodeJS.ProcessEnv)

    let API_KEY = '',
        ENDPOINT = undefined,
        modelUse = ''
    if (apiKey && modelName) {
        API_KEY = apiKey || ''
        modelUse = modelName
        ENDPOINT = endpoint || undefined
    } else if (modelName) {
        API_KEY = env?.AZURE_OPENAI_API_KEY || ''
        modelUse = modelName
        ENDPOINT = endpoint || undefined
    } else if (env.AZURE_OPENAI_API_KEY) {
        API_KEY = env.AZURE_OPENAI_API_KEY || ''
        modelUse = env.AZURE_OPENAI_API_MODEL || DEFAULT_MODEL_NAME
        ENDPOINT = env.AZURE_OPENAI_ENDPOINT || undefined
    }
    const max_tokens = maxOutputTokens || generationConfig.maxOutputTokens
    if (_.isEmpty(messages) || !API_KEY || !ENDPOINT) {
        console.log(`messages: ${messages}, api key: ${API_KEY}, endpoint: ${ENDPOINT}`)
        return 'there is no messages or api key of Openai'
    }
    const { history } = convertMessages(messages)

    const client = new OpenAIClient(ENDPOINT, new AzureKeyCredential(API_KEY))

    let tools: any[] = []
    if (searchWeb) {
        history.unshift(searchWebSystemMessage)
        tools = [searchWebTool]
    }

    console.log(`isStream`, isStream)

    if (isStream) {
        try {
            let content = ``,
                usage: Record<string, any> = {}
            if (searchWeb) {
                const firstRoundCompletion = await client.streamChatCompletions(modelUse, history, {
                    maxTokens: max_tokens,
                    toolChoice: 'auto',
                    tools,
                })
                let toolCalls: Record<string, any>[] = []

                for await (const chunk of firstRoundCompletion) {
                    const delta = chunk.choices?.[0]?.delta
                    const toolCallsChunk = delta?.toolCalls
                    const text = delta?.content || ``
                    if (text) {
                        streamHandler({
                            token: text,
                            status: true,
                        })
                        content += text
                    } else if (toolCallsChunk && !_.isEmpty(toolCallsChunk)) {
                        for (const toolCallChunk of toolCallsChunk as ChatCompletionsFunctionToolCall[]) {
                            const toolCallId = toolCallChunk?.id
                            const toolCallIndex = toolCallChunk?.index || 0
                            const { name: functionName, arguments: funArgs } = toolCallChunk.function || {}
                            if (toolCallId && functionName) {
                                toolCalls[toolCallIndex] = {
                                    id: toolCallId,
                                    function: {
                                        name: functionName,
                                    },

                                    type: 'function',
                                }
                            } else if (funArgs) {
                                toolCalls[toolCallIndex] = {
                                    ...toolCalls[toolCallIndex],
                                    function: {
                                        ...toolCalls[toolCallIndex]?.function,
                                        arguments: (toolCalls[toolCallIndex]?.function?.arguments || '') + funArgs,
                                    },
                                }
                            }
                        }
                    }
                }

                history.push({
                    // @ts-ignore
                    content: null,
                    // @ts-ignore
                    role: 'assistant',
                    toolCalls: toolCalls,
                })

                for (const toolCall of toolCalls) {
                    const { name: functionName, arguments: funArgs } = toolCall.function || {}
                    const functionToCall = availableFunctions[functionName]
                    const functionArgs = JSON.parse(funArgs?.match(/\{(?:[^{}]*)*\}/g)?.[0] || '{}')
                    streamHandler({
                        token: `正在搜索 ${functionArgs.searchText}...\n\n`,
                        status: true,
                    })

                    const functionResponse = await functionToCall(functionArgs.searchText, functionArgs.count)
                    history.push({
                        toolCallId: toolCall.id,
                        // @ts-ignore
                        role: 'tool',
                        name: functionName,
                        content: functionResponse,
                    })
                }

                const completion = await client.streamChatCompletions(modelUse, history, {
                    maxTokens: max_tokens,
                })
                for await (const chunk of completion) {
                    const text = chunk.choices?.[0]?.delta?.content || ``
                    if (chunk?.usage?.totalTokens) {
                        usage = {
                            ...chunk.usage,
                            total_tokens: chunk.usage.totalTokens,
                        }
                    }
                    console.log(`Azure Openai text`, text)
                    if (text) {
                        streamHandler({
                            token: text,
                            status: true,
                        })
                        content += text
                    }
                }
                completeHandler({
                    usage,
                    model: modelUse,
                    content: content,
                    status: true,
                })
                console.log(`🐹🐹🐹 completed content`, content)
            } else {
                const completion = await client.streamChatCompletions(modelUse, history, {
                    maxTokens: max_tokens,
                })

                for await (const chunk of completion) {
                    const text = chunk.choices?.[0]?.delta?.content || ``
                    if (chunk?.usage?.totalTokens) {
                        usage = {
                            ...chunk.usage,
                            total_tokens: chunk.usage.totalTokens,
                        }
                    }
                    console.log(`Azure Openai text`, text)
                    if (text) {
                        streamHandler({
                            token: text,
                            status: true,
                        })
                        content += text
                    }
                }
                completeHandler({
                    usage,
                    model: modelUse,
                    content: content,
                    status: true,
                })
                console.log(`🐹🐹🐹 completed content`, content)
            }
        } catch (e) {
            console.log(`Azure Openai error`, e)

            completeHandler({
                model: modelUse,
                content: '',
                status: false,
            })
        }
    } else {
        let msg = ''
        try {
            if (searchWeb) {
                const firstRoundResult = await client.getChatCompletions(modelUse, history, {
                    maxTokens: max_tokens,
                    toolChoice: 'auto',
                    tools,
                })
                const firstRoundMessage = firstRoundResult?.choices?.[0]?.message
                if (firstRoundMessage?.toolCalls && !_.isEmpty(firstRoundMessage.toolCalls)) {
                    console.log(`firstRoundMessage`, firstRoundMessage)
                    // @ts-ignore
                    history.push(firstRoundMessage)
                    for (const toolCall of firstRoundMessage.toolCalls as ChatCompletionsFunctionToolCall[]) {
                        const { name: functionName, arguments: funArgs } = toolCall.function || {}
                        const functionToCall = availableFunctions[functionName]
                        const functionArgs = JSON.parse(funArgs?.match(/\{(?:[^{}]*)*\}/g)?.[0] || '{}')
                        console.log(`functionArgs`, functionArgs)
                        const functionResponse = await functionToCall(functionArgs.searchText, functionArgs.count)
                        history.push({
                            toolCallId: toolCall.id,
                            // @ts-ignore
                            role: 'tool',
                            name: functionName,
                            content: functionResponse,
                        })
                    }
                    const secondResult = await client.getChatCompletions(modelUse, history, {
                        maxTokens: max_tokens,
                    })

                    msg = secondResult?.choices?.[0]?.message?.content || ''
                } else {
                    msg = firstRoundMessage?.content || ''
                }
            } else {
                const result = await client.getChatCompletions(modelUse, history, {
                    maxTokens: max_tokens,
                })
                msg = result?.choices?.[0]?.message?.content || ''
            }
        } catch (e) {
            console.log(`azure openai error`, e)
            msg = String(e)
        }

        console.log(`Azure Openai result`, msg)
        return msg
    }
}

const loaderAzureOpenai = async (ctx: TBaseContext, args: IAzureOpenaiArgs, key: string) => {
    ctx.loaderAzureOpenaiArgs = {
        ...ctx.loaderAzureOpenaiArgs,
        [key]: args,
    }

    if (!ctx?.loaderAzureOpenai) {
        ctx.loaderAzureOpenai = new DataLoader<string, string>(
            async keys => {
                console.log(`loaderAzureOpenai-keys-🐹🐹🐹`, keys)
                try {
                    const azureOpenaiAnswerList = await Promise.all(
                        keys.map(key =>
                            fetchAzureOpenai(ctx, {
                                ...ctx.loaderAzureOpenaiArgs[key],
                            })
                        )
                    )
                    return azureOpenaiAnswerList
                } catch (e) {
                    console.log(`[loaderAzureOpenai] error: ${e}`)
                }
                return new Array(keys.length || 1).fill({ status: false })
            },
            {
                batchScheduleFn: callback => setTimeout(callback, 100),
            }
        )
    }
    return ctx.loaderAzureOpenai
}

export default { fetch: fetchAzureOpenai, loader: loaderAzureOpenai }
