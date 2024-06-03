import _ from 'lodash'
import { IGrahpqlAIFetchProps } from '../interface'
import { getGraphqlAIMashupBody } from './fetchHelper'
import { fetchEventSource } from '@microsoft/fetch-event-source'

const graphqlUrl = '/graphql'

const getCommonOptions = async ({ userToken }: { userToken: string }) => {
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

    try {
        const options = await getCommonOptions({ userToken: 'test' })

        const response = await fetch(graphqlUrl, {
            ...options,
            body: JSON.stringify(body),
        })
        const data = await response.json()
        return {
            content: data.data,
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

const fetchAIGraphqlStream = async (paramsForAIGraphql: IGrahpqlAIFetchProps) => {
    const abortController = new AbortController()
    const { streamHandler, completeHandler, ...rest } = paramsForAIGraphql || {}
    const body = getGraphqlAIMashupBody({
        ...rest,
        name: `GetAiGraphqlQuery`,
    })
    try {
        const options = await getCommonOptions({ userToken: 'test' })
        await fetchEventSource(graphqlUrl, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body),
            onmessage(ev) {
                console.log(ev.data)
                const data: string | Record<string, any> = ev?.data || {}
                try {
                    const { hasNext, incremental } = (typeof data == `object` ? data : JSON.parse(data)) || {}
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