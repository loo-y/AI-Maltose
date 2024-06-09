// import 'dotenv/config'
import DataLoader from 'dataloader'
import _ from 'lodash'
import { getUser, getconversationMessages } from './queries'

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
                                ...ctx.loaderGeminiProArgs[key],
                            })
                        )
                    )
                    return conversationsHistoryList
                } catch (e) {
                    console.log(`[loaderGeminiPro] error: ${e}`)
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

export default { loaderUserBasicInfo, loaderConversationsHistory }
