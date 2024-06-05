// import 'dotenv/config'
import { queryUser } from '../../../dal/D1/queries'
import _ from 'lodash'
import { Repeater } from 'graphql-yoga'

const typeDefinitions = `
    scalar JSON
    type User {
        BasicInfo: BaicInfoResult
    }

    type BaicInfoResult {
        userInfo: JSON
        JSON: JSON
    }
`
export const BasicInfo = async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {
    const { userID } = parent || {}
    const userInfo = await queryUser({ userID })
    console.log(`userInfo`, userInfo)
    return {
        userInfo,
    }
}

const resolvers = {
    User: {
        BasicInfo,
    },
}

export default {
    typeDefinitions,
    resolvers,
}
