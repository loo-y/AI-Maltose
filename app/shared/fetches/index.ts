import _ from 'lodash'
import { IGrahpqlAIFetchProps } from '../interface'
import { getGraphqlAIMashupBody } from './fetchHelper'
import { fetchEventSource } from '@microsoft/fetch-event-source'

const graphqlUrl = '/graphql'

const getCommonOptions = async ({ userToken }: { userToken?: string }) => {
    const headers = _.omitBy(
        {
            'Content-Type': 'application/json',
            'X-User-Token': userToken,
        },
        _.isUndefined
    ) as Record<string, string>

    let options = {
        method: 'POST',
        headers,
    }
    return options
}

export const fetchAIGraphql = async (paramsForAIGraphql: IGrahpqlAIFetchProps) => {
    const { isStream, ...rest } = paramsForAIGraphql || {}
    if (isStream) {
        return fetchAIGraphqlStream(paramsForAIGraphql)
    }

    const body = getGraphqlAIMashupBody({
        ...rest,
        name: `GetAiGraphqlQuery`,
    })
    const options = await getCommonOptions({ userToken: 'test' })

    try {
        const response = await fetch(graphqlUrl, {
            ...options,
            body: JSON.stringify(body),
        })
        const data = await response.json()
        return {
            data: data.data,
            status: true,
        }
    } catch (e) {
        console.log(e)
        return {
            data: String(e),
            status: false,
        }
    }
}

const fetchAIGraphqlStream = async (paramsForAIGraphql: IGrahpqlAIFetchProps) => {
    const abortController = new AbortController()
    const { streamHandler, nonStreamHandler, completeHandler, ...rest } = paramsForAIGraphql || {}
    const body = getGraphqlAIMashupBody({
        ...rest,
        name: `GetAiGraphqlQuery`,
    })
    try {
        const options = await getCommonOptions({ userToken: 'test' })
        return await fetchEventSource(graphqlUrl, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body),
            onmessage(ev) {
                console.log(ev.data)
                const data: string | Record<string, any> = ev?.data || {}
                try {
                    const {
                        hasNext,
                        incremental,
                        data: insideData,
                    } = (typeof data == `object` ? data : JSON.parse(data)) || {}
                    if (insideData?.chat) {
                        typeof nonStreamHandler == `function` &&
                            nonStreamHandler({
                                chat: insideData.chat,
                                status: true,
                            })
                    }
                    if (incremental) {
                        _.map(incremental || [], (_incremental: { items: string[]; path: (string | Number)[] }) => {
                            const { items, path } = _incremental || {}
                            // const [chat, aiType, index] = path as [string, String, Number]
                            typeof streamHandler == `function` &&
                                streamHandler({
                                    content: items?.[0] || ``,
                                    status: true,
                                })
                        })
                    }
                } catch (err) {
                    console.log(`err`, err)
                    typeof streamHandler == `function` &&
                        streamHandler({
                            content: String(err),
                            status: false,
                        })
                }
            },
            onclose() {
                if (completeHandler) {
                    completeHandler({
                        data: null,
                        status: true,
                    })
                }
            },
            onerror(err) {
                if (completeHandler) {
                    completeHandler({
                        err,
                        status: false,
                    })
                }
            },
            signal: abortController.signal,
        })
    } catch (err) {
        console.log(`fetchAIGraphqlStream`, err)
        if (completeHandler) {
            completeHandler({
                err,
                status: false,
            })
        }
    }
}

export const fetchUploadImage = async (imageBlob: Blob) => {
    const url = `/api/imageUpload`
    const options = await getCommonOptions({ userToken: 'test' })
    delete options.headers['Content-Type']
    // 创建 FormData 对象
    const formData = new FormData()
    // 将 Blob 对象添加到 FormData 对象中
    formData.append('file', imageBlob, 'blob')
    try {
        const response = await fetch(url, {
            ...options,
            method: 'POST',
            body: formData,
        })
        const data = await response.json()
        return {
            data,
            status: true,
        }
    } catch (e) {
        console.log(e)
        return {
            content: String(e),
            status: false,
        }
    }
}

export const fetchUserInfoGraphql = async (params?: { conversationID: number }) => {
    const { conversationID } = params || {}
    const options = await getCommonOptions({})
    const operationName = `GetUserQuery`
    const body = {
        operationName,
        query: `
            query ${operationName}($params: UserArgs){
                user(params: $params) {
                    BasicInfo
                }
            }
        `,
        variables: {
            params: {
                conversationID,
            },
        },
    }
    try {
        const response = await fetch(graphqlUrl, {
            ...options,
            body: JSON.stringify(body),
        })
        const data = await response.json()
        return {
            data: data.data,
            status: true,
        }
    } catch (e) {
        console.log(e)
        return {
            content: String(e),
            status: false,
        }
    }
}

export const fetchConversationMessagesGraphql = async (params?: { conversationID: number }) => {
    const { conversationID } = params || {}
    const options = await getCommonOptions({})
    const operationName = `GetConversationMessagesQuery`
    const body = {
        operationName,
        query: `
            query ${operationName}($params: UserArgs){
                user(params: $params) {
                    Histories
                }
            }
        `,
        variables: {
            params: {
                conversationIDs: [conversationID],
            },
        },
    }
    try {
        const response = await fetch(graphqlUrl, {
            ...options,
            body: JSON.stringify(body),
        })
        const data = await response.json()
        return {
            data: data.data,
            status: true,
        }
    } catch (e) {
        console.log(e)
        return {
            content: String(e),
            status: false,
        }
    }
}

export const fetchAIBotListGraphql = async () => {
    const options = await getCommonOptions({})
    const operationName = `GetAIBotListQuery`
    const body = {
        operationName,
        query: `
            query ${operationName}($params: UserArgs){
                user(params: $params) {
                    AIBotList
                }
            }
        `,
        variables: {},
    }
    try {
        const response = await fetch(graphqlUrl, {
            ...options,
            body: JSON.stringify(body),
        })
        const data = await response.json()
        return {
            data: data.data,
            status: true,
        }
    } catch (e) {
        console.log(e)
        return {
            content: String(e),
            status: false,
        }
    }
}
