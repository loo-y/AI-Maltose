import DataLoader from 'dataloader'
import { ICommonDalArgs } from '../../types'
import _ from 'lodash'

const loaderD1 = async (ctx: TBaseContext, args: ICommonDalArgs, key: string) => {
    ctx.loaderD1Args = {
        ...ctx.loaderD1Args,
        [key]: args,
    }

    if (!ctx?.loaderClaude) {
        ctx.loaderClaude = new DataLoader<string, string>(
            async keys => {
                console.log(`loaderClaude-keys-🐹🐹🐹`, keys)
                try {
                    const geminiProAnswerList = await Promise.all(
                        keys.map(key =>{
                            return ''
                        })
                    )
                    return geminiProAnswerList
                } catch (e) {
                    console.log(`[loaderClaude] error: ${e}`)
                }
                return new Array(keys.length || 1).fill({ status: false })
            },
            {
                batchScheduleFn: callback => setTimeout(callback, 100),
            }
        )
    }
    return ctx.loaderD1
}

export default {  loader: loaderD1 }
