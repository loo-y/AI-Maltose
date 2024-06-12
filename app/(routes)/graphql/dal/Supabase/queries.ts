import { createClient } from './server'
import _ from 'lodash'

export const getUser = async ({ userid }: { ctx?: TBaseContext; userid: string }) => {
    const supabase = createClient()

    const { data } = await supabase.from('users').select('*').eq('userid', userid)
    const user = data?.[0] || {}
    const { balance, email, username } = user || {}
    let conversations: Record<string, any>[] = []
    if (user?.userid) {
        conversations = await getUserConversations({ userid: user.userid })
    }
    return {
        balance,
        email,
        username,
        userid,
        conversations,
    }
}

export const createUser = async (userData: { username: string; userid: string; email: string; balance?: number }) => {
    const supabase = createClient()
    const user = await getUser({ userid: userData.userid })
    // 用户已存在
    if (user?.userid) {
        return true
    }
    const { data, error } = await supabase.from('users').insert([{ ...userData, balance: userData.balance || 100 }])
    if (_.isEmpty(error) && !_.isEmpty(data)) {
        return true
    }
    return false
}

export const addBalanceForUser = async (userData: { userid: string; balance: number }) => {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('users')
        .update({ balance: userData.balance })
        .eq('userid', userData.userid)
    if (_.isEmpty(error) && !_.isEmpty(data)) {
        return true
    }
    return false
}

export const createConversation = async ({ userid, aiid }: { userid: string; aiid?: string }) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('conversations').insert([{ userid }]).select()

    console.log(`createConversation===>`, data, error)
    const conversation_id = data?.[0]?.conversation_id || 0

    if (conversation_id && aiid) {
        // 插入 conversation ai
        await addAIForconversation({
            conversationid: conversation_id,
            aiid,
        })
    }

    return conversation_id
}

const addAIForconversation = async ({
    conversationid,
    userid,
    aiid,
}: {
    conversationid: number
    userid?: string
    aiid?: string
}) => {
    const supabase = createClient()
    if (!conversationid || !aiid) return false
    const { data, error } = await supabase.from('conversation_ai').select('*').eq('conversation_id', conversationid)
    if (data?.[0]?.conversation_id) return true
    const { data: insertResult, error: insertError } = await supabase.from('conversation_ai').insert([
        {
            conversation_id: conversationid,
            aiid: aiid,
        },
    ])

    return true
}

// add message by conversation id
export const addConversationMessage = async (messageData: {
    conversation_id: number
    role: string
    userid: string
    aiid?: string
    content: string | Record<string, any>[]
}) => {
    const supabase = createClient()
    const { conversation_id, role, userid, content, aiid } = messageData || {}

    let currentConversationId = conversation_id
    // 如果是新对话，创建一条记录
    if (!conversation_id && userid) {
        currentConversationId = await createConversation({ userid, aiid })
    }

    if (!currentConversationId) {
        return false
    }

    // 用于标记多条类型消息在同一个消息里
    const messageid = Date.now().toString()
    const msgData = {
        conversation_id: currentConversationId,
        sender_type: role,
        sender_id: role == 'user' ? userid : aiid,
        userid: userid,
        messageid,
    }
    const insertMessages = _.isString(content)
        ? [
              {
                  ...msgData,
                  content: content,
                  content_type: 'text',
              },
          ]
        : _.map(content, c => {
              const { text, image_url, type } = c || {}
              return {
                  ...msgData,
                  content: text || image_url?.url || '',
                  content_type: type || 'text',
              }
          })

    console.log(`insertMessages===>`, insertMessages)
    const { data, error } = await supabase.from('messages').insert(insertMessages)
    if (_.isEmpty(error) && !_.isEmpty(data)) {
        return true
    }

    console.log(`addConversationMessage error`, error)
    return false
}

export const getconversationMessages = async ({
    conversation_id,
    userid,
    ctx,
}: {
    ctx?: TBaseContext
    conversation_id: number
    userid: string
}) => {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversation_id)
        .eq('userid', userid)
        .order('created_at', { ascending: true })
    if (_.isEmpty(error) && !_.isEmpty(data)) {
        return data
    }
    return []
}

export const getUserConversations = async ({ ctx, userid }: { userid: string; ctx?: TBaseContext }) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('conversations').select('*').eq('userid', userid)
    if (_.isEmpty(error) && !_.isEmpty(data)) {
        const { data: aiList } = await supabase
            .from('conversation_ai')
            .select('conversation_id, aiid')
            .in('conversation_id', _.map(data, 'conversation_id'))

        return _.map(data, d => {
            return {
                conversation_id: d.conversation_id,
                created_at: d.created_at,
                topic: d.topic,
                cleared_messageid: d.cleared_messageid,
                aiBotIDs: _.map(
                    _.filter(aiList, ai => {
                        return ai.conversation_id == d.conversation_id
                    }),
                    item => item.aiid
                ),
            }
        })
    }
    return []
}

export const updateConversationTopic = async ({
    conversation_id,
    topic,
    userid,
}: {
    conversation_id: number
    topic: string
    userid: string
    ctx?: TBaseContext
}) => {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('conversations')
        .update({ topic })
        .eq('conversation_id', conversation_id)
        .eq('userid', userid)
        .select()

    if (_.isEmpty(error) && !_.isEmpty(data)) {
        return data
    }
    return {}
}

export const getAIBots = async ({ userid, aiid }: { userid?: string; aiid?: string; ctx?: TBaseContext }) => {
    const supabase = createClient()
    const combinedData = []
    const { data, error } = await supabase.from('ai_bots').select('*').eq('is_custom', false)
    if (_.isEmpty(error) && !_.isEmpty(data)) {
        combinedData.push(...data)
    }
    if (userid) {
        const { data: userselfData } = await supabase.from('ai_bots').select('*').eq('userid', userid)

        if (!_.isEmpty(userselfData)) {
            combinedData.push(...userselfData)
        }
    }

    if (!_.isEmpty(combinedData)) {
        if (aiid) {
            const selectedAI = _.find(combinedData, d => d.aiid == aiid)
            if (selectedAI) {
                return [selectedAI]
            }
            return []
        }

        return combinedData
    }

    return []
}
