import _ from 'lodash'
import { D1Tables } from '../../utils/constants'

const { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID, CLOUDFLARE_BEAR_TOKEN } =
    (typeof process != 'undefined' && process?.env) || ({} as NodeJS.ProcessEnv)
const D1QueryUrl = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${CLOUDFLARE_D1_DATABASE_ID}/query`

const commonD1Options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${CLOUDFLARE_BEAR_TOKEN}` },
}

export const queryUser = async ({ userID }: { userID: string }) => {
    const requestOptions = {
        ...commonD1Options,
        body: JSON.stringify({
            params: [userID],
            sql: `
                SELECT u.*, c.* 
                FROM ${D1Tables.usersInfo} u 
                JOIN ${D1Tables.conversations} c 
                ON u.userid = c.userid 
                WHERE u.userid = ?
            `,
        }),
    }
    try {
        const response = await fetch(D1QueryUrl, requestOptions)
        const result = await response.json()
        console.log(`queryUser result`, result)
        const userData = result?.result?.[0]?.results
        if (!_.isEmpty(userData)) {
            const userInfo = {
                userID: userData[0]?.userid,
                username: userData[0]?.username,
                email: userData[0]?.email,
                balance: userData[0]?.balance,
                conversations: _.map(userData, d => {
                    return {
                        conversationID: d.conversation_id,
                        createAt: d.create_at,
                    }
                }),
            }

            return userInfo
        }
    } catch (e) {
        console.log(`queryUser error`, e)
    }
    return null
}

export const queryUserConversationMessages = async ({
    userID,
    conversationID,
}: {
    userID: string
    conversationID: number
}) => {
    const requestOptions = {
        ...commonD1Options,
        body: JSON.stringify({
            params: [userID, conversationID],
            sql: `
                SELECT * 
                FROM ${D1Tables.messages} 
                WHERE sender_id = ? AND conversation_id = ?
            `,
        }),
    }
    try {
        const response = await fetch(D1QueryUrl, requestOptions)
        const result = await response.json()
        const messages = result?.result?.[0]?.results
        console.log(`messages`, messages)
        if (!_.isEmpty(messages)) {
            return _.map(_.groupBy(messages, 'message_id'), v => {
                console.log(v)
                return {
                    sender: v?.[0]?.sender_id,
                    senderType: v?.[0]?.sender_type,
                    messageId: v?.[0]?.message_id,
                    conversationId: v?.[0]?.conversation_id,
                    content: _.map(v, m => {
                        return {
                            text: m.content_type == `image_url` ? undefined : m.content,
                            image_url: m.content_type == `image_url` ? { url: m.content } : undefined,
                            type: m.content_type,
                            createAt: m.create_at,
                        }
                    }),
                }
            })
        }
    } catch (e) {
        console.log(e)
    }
    return null
}

export const addMessages = async ({
    userId,
    userType,
    conversationId,
    message,
}: {
    userId: string
    userType: string
    conversationId: number
    message: { content: string; contentType: string; createAt: number }[]
}) => {
    if (_.isEmpty(message)) {
        return null
    }
    let params: (string | number)[] = [],
        values: string[] = []
    const messageID = Date.now()
    _.map(message, (m, i) => {
        params.push(messageID, conversationId, userType, userId, m.content, m.contentType, m.createAt)
        values.push(`(?,?,?,?,?,?,?)`)
    })
    const requestOptions = {
        ...commonD1Options,
        body: JSON.stringify({
            params,
            sql: `
                INSERT INTO ${D1Tables.messages} (conversation_id, sender_type, sender_id, content, content_type, created_at) 
                VALUES ${values.join(',')}
            `,
        }),
    }
    try {
        const response = await fetch(D1QueryUrl, requestOptions)
        const result = await response.json()
        return result
    } catch (e) {
        console.log(e)
    }
    return null
}
