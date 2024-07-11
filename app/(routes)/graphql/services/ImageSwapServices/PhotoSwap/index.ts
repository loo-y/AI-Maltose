import _ from 'lodash'
import { loadTensorArtTemplate } from '../../../dal/ImageSwap'

const typeDefinitions = `
    scalar JSON
    type ImageSwapMutation {
        PhotoSwap(params: PhotoSwapArgs): [JSON]
    }

    input PhotoSwapArgs {
        inputID: String
        inputImageUrl: String
    }

    type ImageSwap {
        PhotoJob(params: PhotoJobArgs): [JSON]
    }

    input PhotoJobArgs {
        jobId: String
    }
`

export const PhotoSwap = async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {}

export const PhotoJob = async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {}

const resolvers = {
    ImageSwapMutation: {
        PhotoSwap: PhotoSwap,
    },
    ImageSwap: {
        PhotoJob: PhotoJob,
    },
}

export default {
    typeDefinitions,
    resolvers,
}
