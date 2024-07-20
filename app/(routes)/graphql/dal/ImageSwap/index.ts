import DataLoader from 'dataloader'
import _ from 'lodash'
import { getSwapStyles, getImageAIProvider } from '../Supabase/queries'
import { getFaceSwap } from './replicate'
import { imageUrlPrefix, appDomain } from '@/app/shared/constants'
import { getWorkflowTemplateInfo, createJobByTemplate, getJobStatus } from './tensorArt'

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
                    const imageStyleResultList = await Promise.all(
                        keys.map(key =>
                            getSwapStyles({
                                ctx,
                                style_type: ctx.loaderReplicateFaceSwapArgs[key].styleType,
                                providerid: ctx.loaderReplicateFaceSwapArgs[key].provider,
                            })
                        )
                    )
                    return imageStyleResultList
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

export const loadTensorArtTemplate = (
    ctx: TBaseContext,
    args: { providerId: string; resourceId: string },
    keys: string[]
) => {
    ctx.loaderTensorArtTemplateArgs = {
        ...ctx.loaderTensorArtTemplateArgs,
    }
    _.map(keys, key => {
        ctx.loaderTensorArtTemplateArgs[key] = {
            ...args,
            templateId: key,
        }
    })

    if (!ctx?.loaderTensorArtTemplate) {
        ctx.loaderTensorArtTemplate = new DataLoader<string, string>(
            async keys => {
                console.log(`loaderTensorArtTemplate-keys-🐹🐹🐹`, keys)
                const providerId = args.providerId
                const resourceId = args.resourceId
                const imageAIProviderInfo = await getImageAIProvider({ ctx, providerid: providerId })
                const { api_url: endpoint, api_key: authToken } = imageAIProviderInfo || {}
                try {
                    const tensorArtTemplateResultList = await Promise.all(
                        keys.map(key => {
                            return new Promise(async (resolve, reject) => {
                                let job = {}
                                const { templateId } = ctx.loaderTensorArtTemplateArgs[key]
                                const workflowTemplateInfo = await getWorkflowTemplateInfo({ templateId, authToken })
                                const { fields, status } = workflowTemplateInfo
                                console.log(`workflowTemplateInfo`, workflowTemplateInfo)
                                if (status && !_.isEmpty(fields)) {
                                    const fieldAttrs = _.map(fields?.fieldAttrs, item => {
                                        const { fieldName, fieldValue } = item || {}
                                        return {
                                            ...item,
                                            fieldName,
                                            fieldValue: fieldName === 'image' ? resourceId : fieldValue,
                                        }
                                    })
                                    console.log(`fieldAttrs`, fieldAttrs)
                                    const jobResult = await createJobByTemplate({
                                        templateId,
                                        fields: {
                                            fieldAttrs,
                                        },
                                        authToken,
                                        endpoint,
                                    })
                                    console.log(`jobResult`, jobResult)
                                    if (jobResult?.status && jobResult?.job) {
                                        job = {
                                            jobInfo: jobResult.job,
                                            jobstatus: jobResult.jobStatus,
                                        }
                                    }
                                }
                                resolve(job)
                            })
                        })
                    )
                    return tensorArtTemplateResultList
                } catch (e) {
                    console.log(`[loaderTensorArtTemplate] error: ${e}`)
                }
                return new Array(keys.length || 1).fill({ status: false })
            },
            {
                batchScheduleFn: callback => setTimeout(callback, 100),
            }
        )
    }
    return ctx.loaderTensorArtTemplate
}

export const loadTensorArtJob = (ctx: TBaseContext, args: { providerId: string }, keys: string[]) => {
    ctx.loaderTensorArtJobArgs = {
        ...ctx.loaderTensorArtJobArgs,
    }
    _.map(keys, key => {
        ctx.loaderTensorArtJobArgs[key] = {
            ...args,
            jobId: key,
        }
    })

    if (!ctx?.loaderTensorArtJob) {
        ctx.loaderTensorArtJob = new DataLoader<string, string>(
            async keys => {
                console.log(`loaderTensorArtJob-keys-🐹🐹🐹`, keys)
                const providerId = args.providerId
                const imageAIProviderInfo = await getImageAIProvider({ ctx, providerid: providerId })
                const { api_url: endpoint, api_key: authToken } = imageAIProviderInfo || {}
                try {
                    const tensorArtJobResultList = await Promise.all(
                        keys.map(key => {
                            return new Promise(async (resolve, reject) => {
                                const { jobId } = ctx.loaderTensorArtJobArgs[key]
                                const jobResult = await getJobStatus({
                                    jobId,
                                    authToken,
                                    endpoint,
                                })
                                resolve(jobResult)
                            })
                        })
                    )
                    return tensorArtJobResultList
                } catch (e) {
                    console.log(`[loaderTensorArtJob] error: ${e}`)
                }
                return new Array(keys.length || 1).fill({ status: false })
            },
            {
                batchScheduleFn: callback => setTimeout(callback, 100),
            }
        )
    }

    return ctx.loaderTensorArtJob
}
