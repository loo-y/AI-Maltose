import _ from 'lodash'
import { loadTensorArtTemplate } from '../../../dal/ImageSwap'

const typeDefinitions = `
    scalar JSON
    type ImageSwapMutation {
        TensorArtTemplate(params: TensorArtTemplateArgs): [JSON]
    }

    input TensorArtTemplateArgs {
        resourceID: String
        templateIDs: [String]
    }

    type ImageSwap {
        TensorArtTemplateJob(params: TensorArtTemplateJobArgs): [JSON]
    }

    input TensorArtTemplateJobArgs {
        jobId: String
    }
`

export const TensorArtTemplate = async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {
    const { userID } = parent || {}
    const { resourceID, templateIDs } = args?.params || {}

    if (!resourceID || !templateIDs?.length) {
        throw new Error('resourceID or templateID is empty')
        return []
    }

    const key = `${userID}_tensorArtTemplate`
    const loader = loadTensorArtTemplate(context, { providerId: `tensorArt`, resourceId: resourceID }, templateIDs)
    const results = (await loader.loadMany(templateIDs)) || []
    return results
}

export const TensorArtTemplateJob = async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {}

const resolvers = {
    ImageSwapMutation: {
        TensorArtTemplate: TensorArtTemplate,
    },
    ImageSwap: {
        TensorArtTemplateJob: TensorArtTemplateJob,
    },
}

export default {
    typeDefinitions,
    resolvers,
}
