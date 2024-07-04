import _ from 'lodash'
import { loadImageStyles } from '../../../dal/ImageSwap'

const typeDefinitions = `
    scalar JSON
    type ImageSwap {
        ImageStyle(params: ImageStyleArgs): [JSON]
    }

    input ImageStyleArgs {
        styleType: String
        provider: String
    }
`
export const ImageStyle = async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {
    const { userID, keyValues } = parent || {}
    const { styleType, provider } = args?.params || {}
    const styleType_param = styleType || _.find(keyValues, kv => kv.key == 'styleType')?.value
    if (!userID || !styleType_param) {
        return []
    }

    const key = `${userID}_imagestyle`
    const loader = loadImageStyles(context, { styleType, provider }, key)
    const results = (await loader.load(key)) || []
    return results
}

const resolvers = {
    ImageSwap: {
        ImageStyle: ImageStyle,
    },
}

export default {
    typeDefinitions,
    resolvers,
}
