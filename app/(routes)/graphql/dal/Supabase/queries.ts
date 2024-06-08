import { createClient } from './server'
import _ from 'lodash'

export const getUser = async ({ userid }: { userid: string }) => {
    const supabase = createClient()

    const { data } = await supabase.from('users').select('*').eq('userid', userid)

    return data?.[0] || {}
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

export const createConversation = async ({ userid }: { userid: string }) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('conversations').insert([{ userid }]).select()

    console.log(`createConversation===>`, data, error)
    if (_.isEmpty(error) && !_.isEmpty(data)) {
        return data?.[0]?.conversation_id
    }
    return 0
}

// add message by conversation id
export const addConversationMessage = async (messageData: {
    conversation_id: number
    role: string
    userid?: string
    aiid?: string
    content: string | Record<string, any>[]
}) => {
    const supabase = createClient()
    const { conversation_id, role, userid, content, aiid } = messageData || {}

    let currentConversationId = conversation_id
    // 如果是新对话，创建一条记录
    if (!conversation_id && userid) {
        currentConversationId = await createConversation({ userid })
    }

    console.log(`currentConversationId`, currentConversationId)

    if (!currentConversationId) {
        return false
    }

    // 用于标记多条类型消息在同一个消息里
    const messageid = Date.now().toString()
    const msgData = {
        conversation_id: currentConversationId,
        sender_type: role,
        sender_id: userid || aiid,
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
