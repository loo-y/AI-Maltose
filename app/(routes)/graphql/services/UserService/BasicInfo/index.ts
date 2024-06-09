// import 'dotenv/config'
import { queryUser } from '../../../dal/D1/queries'
import _ from 'lodash'
import SupabaseDal from '../../../dal/Supabase'

const typeDefinitions = `
    scalar JSON
    type User {
        BasicInfo: JSON
    }
`
export const BasicInfo = async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {
    const { userID } = parent || {}

    const loader = SupabaseDal.loaderUserBasicInfo(context, { userid: userID }, userID)
    let basicInfo = await loader.load(userID)
    delete basicInfo.userid

    return {
        ...basicInfo,
    }
}

const resolvers = {
    User: {
        BasicInfo: BasicInfo,
    },
}

export default {
    typeDefinitions,
    resolvers,
}
