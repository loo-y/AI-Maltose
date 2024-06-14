// import 'dotenv/config'
import DataLoader from 'dataloader'
import _ from 'lodash'
import { getUser, getconversationMessages, getAIBots } from './queries'

const loaderUserBasicInfo = (ctx: TBaseContext, args: { userid: string }, key: string) => {
    ctx.loaderUserBasicInfoArgs = {
        ...ctx.loaderUserBasicInfoArgs,
        [key]: args,
    }

    if (!ctx?.loaderUserBasicInfo) {
        ctx.loaderUserBasicInfo = new DataLoader<string, string>(
            async keys => {
                console.log(`loaderUserBasicInfo-keys-🐹🐹🐹`, keys)
                try {
                    const userBasicInfoList = await Promise.all(
                        keys.map(key =>
                            getUser({
                                ctx,
                                userid: ctx.loaderUserBasicInfoArgs[key]?.userid,
                            })
                        )
                    )
                    return userBasicInfoList
                } catch (e) {
                    console.log(`[loaderUserBasicInfo] error: ${e}`)
                }
                return new Array(keys.length || 1).fill({ status: false })
            },
            {
                batchScheduleFn: callback => setTimeout(callback, 100),
            }
        )
    }

    return ctx.loaderUserBasicInfo
}

const loaderConversationsHistory = (ctx: TBaseContext, args: { userid: string }, keys: string[]) => {
    ctx.loaderConversationsHistoryArgs = {
        ...ctx.loaderConversationsHistoryProArgs,
    }
    _.map(keys, key => {
        ctx.loaderConversationsHistoryArgs[key] = {
            ...args,
            conversation_id: key,
        }
    })

    if (!ctx?.loaderConversationsHistory) {
        ctx.loaderConversationsHistory = new DataLoader<string, string>(
            async keys => {
                console.log(`loaderConversationsHistory-keys-🐹🐹🐹`, keys)
                try {
                    const conversationsHistoryList = await Promise.all(
                        keys.map(key =>
                            getconversationMessages({
                                ctx,
                                ...ctx.loaderConversationsHistoryArgs[key],
                            })
                        )
                    )
                    return conversationsHistoryList
                } catch (e) {
                    console.log(`[loaderConversationsHistory] error: ${e}`)
                }
                return new Array(keys.length || 1).fill({ status: false })
            },
            {
                batchScheduleFn: callback => setTimeout(callback, 100),
            }
        )
    }
    return ctx.loaderConversationsHistory
}

const loadAIBotList = (ctx: TBaseContext, args: { userid?: string; aiid?: string }, key: string) => {
    ctx.loaderAIBotListArgs = {
        ...ctx.loaderUserBasicInfoArgs,
        [key]: args,
    }

    if (!ctx?.loaderAIBotList) {
        ctx.loaderAIBotList = new DataLoader<string, string>(
            async keys => {
                console.log(`loaderAIBotList-keys-🐹🐹🐹`, keys)
                try {
                    const userBasicInfoList = await Promise.all(
                        keys.map(key =>
                            getAIBots({
                                ctx,
                                ...ctx.loaderAIBotListArgs[key],
                            })
                        )
                    )
                    return userBasicInfoList
                } catch (e) {
                    console.log(`[loaderAIBotList] error: ${e}`)
                }
                return new Array(keys.length || 1).fill({ status: false })
            },
            {
                batchScheduleFn: callback => setTimeout(callback, 100),
            }
        )
    }

    return ctx.loaderAIBotList
}
export default { loaderUserBasicInfo, loaderConversationsHistory, loadAIBotList }
