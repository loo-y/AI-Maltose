import _ from 'lodash'
import { loadReplicateFaceSwap } from '../../../dal/ImageSwap'

const typeDefinitions = `
    scalar JSON
    type ImageSwapMutation {
        FaceSwap(params: FaceSwapArgs): [JSON]
    }

    input FaceSwapArgs {
        inputID: String
        inputImageUrl: String
        targetImageIDs: [String]
        provider: String
    }
`
export const FaceSwap = async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {
    const { userID, keyValues } = parent || {}
    const { inputID, inputImageUrl, targetImageIDs, provider } = args?.params || {}
    const inputID_param = inputID || _.find(keyValues, kv => kv.key == 'inputID')?.value
    const inputImageUrl_param = inputImageUrl || _.find(keyValues, kv => kv.key == 'inputImageUrl')?.value
    if (!userID || !(inputID_param || inputImageUrl_param) || _.isEmpty(targetImageIDs) || !provider) {
        return []
    }

    const loader = loadReplicateFaceSwap(
        context,
        { inputID: inputID_param, inputImageUrl: inputImageUrl_param, provider },
        targetImageIDs
    )
    const results = (await loader.loadMany(targetImageIDs)) || []

    return results
}

const resolvers = {
    ImageSwapMutation: {
        FaceSwap: FaceSwap,
    },
}

export default {
    typeDefinitions,
    resolvers,
}
