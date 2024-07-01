import _ from 'lodash'

const typeDefinitions = `
    scalar JSON
    type ImageSwap {
        FaceSwap(params: FaceSwapArgs): JSON
    }

    input FaceSwapArgs {
        inputID: string
        inputImageUrl: string
        targetImageIDs: [string]
    }
`
export const FaceSwap = async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {
    const { userID } = parent || {}
    const { aiid } = args?.params || {}
    if (!userID) {
        return {}
    }

    return {}
}

const resolvers = {
    User: {
        FaceSwap: FaceSwap,
    },
}

export default {
    typeDefinitions,
    resolvers,
}
