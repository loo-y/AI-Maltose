import DataLoader from 'dataloader'
import _ from 'lodash'
import { getSwapStyles, getImageAIProvider } from '../Supabase/queries'
import { getFaceSwap } from './replicate'
import { imageUrlPrefix, appDomain } from '@/app/shared/constants'

export const loadReplicateFaceSwap = (
    ctx: TBaseContext,
    args: { inputID?: string; inputImageUrl?: string; provider: string },
    keys: string[]
) => {
    ctx.loaderReplicateFaceSwapArgs = {
        ...ctx.loaderReplicateFaceSwapArgs,
    }
    _.map(keys, key => {
        ctx.loaderReplicateFaceSwapArgs[key] = {
            ...args,
            imageSHowID: key,
        }
    })

    if (!ctx?.loaderReplicateFaceSwap) {
        ctx.loaderReplicateFaceSwap = new DataLoader<string, string>(
            async keys => {
                console.log(`loaderReplicateFaceSwap-keys-🐹🐹🐹`, keys)
                const providerid = args.provider
                // 确保只能读取数据库中允许的imageShowID
                const [imageSwapList, imageAIProviderInfo] = await Promise.all([
                    getSwapStyles({ ctx, imageShowIDList: [...keys], style_type: 'faceswap', providerid }),
                    getImageAIProvider({ ctx, providerid }),
                ])
                try {
                    const replicateFaceSwapList = await Promise.all(
                        _.map(keys, key => {
                            const swapArg = ctx.loaderReplicateFaceSwapArgs[key] || {}
                            const { inputID, inputImageUrl } = swapArg
                            const swapImage = inputImageUrl
                                ? inputImageUrl
                                : inputID
                                  ? `${appDomain}${imageUrlPrefix}/${inputID}`
                                  : ''
                            let targetImage = ''
                            const styleImageShowID =
                                _.find(imageSwapList, item => item.style_imageshowid === key)?.style_imageshowid || ''
                            if (styleImageShowID) {
                                targetImage = `${appDomain}${imageUrlPrefix}/${styleImageShowID}`
                            }
                            return getFaceSwap({
                                swapImage,
                                targetImage,
                                replicateAPIToken: imageAIProviderInfo?.api_key || '',
                            })
                        })
                    )

                    return replicateFaceSwapList
                } catch (e) {
                    console.log(`[loaderReplicateFaceSwap] error: ${e}`)
                }
                return new Array(keys.length || 1).fill({ status: false })
            },
            {
                batchScheduleFn: callback => setTimeout(callback, 100),
            }
        )
    }
    return ctx.loaderReplicateFaceSwap
}

export const loadImageStyles = (ctx: TBaseContext, args: { styleType: string; provider?: string }, key: string) => {
    ctx.loaderReplicateFaceSwapArgs = {
        ...ctx.loaderReplicateFaceSwapArgs,
        [key]: args,
    }

    if (!ctx?.loaderReplicateFaceSwap) {
        ctx.loaderReplicateFaceSwap = new DataLoader<string, string>(
            async keys => {
                console.log(`loaderReplicateFaceSwap-keys-🐹🐹🐹`, keys)
                try {
                    const lingyiwanwuAnswerList = await Promise.all(
                        keys.map(key =>
                            getSwapStyles({
                                ctx,
                                style_type: ctx.loaderReplicateFaceSwapArgs[key].styleType,
                                providerid: ctx.loaderReplicateFaceSwapArgs[key].provider,
                            })
                        )
                    )
                    return lingyiwanwuAnswerList
                } catch (e) {
                    console.log(`[loaderReplicateFaceSwap] error: ${e}`)
                }
                return new Array(keys.length || 1).fill({ status: false })
            },
            {
                batchScheduleFn: callback => setTimeout(callback, 100),
            }
        )
    }
    return ctx.loaderReplicateFaceSwap
}
