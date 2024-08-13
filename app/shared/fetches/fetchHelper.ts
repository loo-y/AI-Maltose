import { IGrahpqlAIFetchProps } from '../interface'
import _ from 'lodash'

export const getGraphqlAIMashupBody = ({
    prompt,
    aiid,
    isTopic,
    messages,
    conversationID,
    maxTokens,
    name,
    isStream,
    queryQwen,
    qwenParams,
    queryGeminiPro,
    geminiProParams,
    queryMoonshot,
    moonshotParams,
    queryGroq,
    groqParams,
    queryClaude,
    claudeParams,
    queryErnie,
    ernieParams,
    queryOpenAI,
    openAIParams,
    queryAzureOpenAI,
    azureOpenAIParams,
    queryWorkersAI,
    workersAIParams,
    queryLingyiwanwu,
    lingyiwanwuParams,
    isRetry,
}: IGrahpqlAIFetchProps & { name?: string; isRetry?: boolean }) => {
    const queryName = name || 'GQAIQuery'
    let paramsList = [`$params: ChatArgs`],
        queryList = [],
        variables: Record<string, any> = {
            params: {
                aiid,
                isRetry: isRetry || false,
                isTopic,
                conversationID: conversationID || 0,
                messages: _.isEmpty(messages)
                    ? [
                          {
                              role: 'user',
                              content: [{ type: 'text', text: prompt }],
                          },
                      ]
                    : _.map(messages, m => {
                          if (_.isString(m.content)) {
                              return {
                                  role: m.role,
                                  content: m.content,
                              }
                          }
                          return {
                              role: m.role,
                              contentArray: m.content,
                          }
                      }),
                maxTokens: maxTokens || 512,
            },
        }
    if (queryQwen) {
        let paramsQwen = '',
            hasQwenArgs = qwenParams
        if (hasQwenArgs) {
            paramsList.push(`$qwenParams: QwenArgs`)
            paramsQwen = '(params: $qwenParams)'
            variables.qwenParams = qwenParams
        }
        queryList.push(isStream ? `QwenStream${paramsQwen}@stream` : `Qwen ${paramsQwen} {text}`)
    }
    if (queryGeminiPro) {
        let paramsGeminiPro = '',
            hasGeminiProArgs = geminiProParams
        if (hasGeminiProArgs) {
            paramsList.push(`$geminiProParams: GeminiProArgs`)
            paramsGeminiPro = '(params: $geminiProParams)'
            variables.geminiProParams = geminiProParams
        }
        queryList.push(isStream ? `GeminiProStream${paramsGeminiPro}@stream` : `GeminiPro ${paramsGeminiPro} {text}`)
    }
    if (queryMoonshot) {
        let paramsMoonshot = '',
            hasMoonshotArgs = moonshotParams
        if (hasMoonshotArgs) {
            paramsList.push(`$moonshotParams: MoonshotArgs`)
            paramsMoonshot = '(params: $moonshotParams)'
            variables.moonshotParams = moonshotParams
        }
        queryList.push(isStream ? `MoonshotStream${paramsMoonshot}@stream` : `Moonshot ${paramsMoonshot} {text}`)
    }
    if (queryGroq) {
        let paramsGroq = '',
            hasGroqArgs = groqParams
        if (hasGroqArgs) {
            paramsList.push(`$groqParams: GroqArgs`)
            paramsGroq = '(params: $groqParams)'
            variables.groqParams = groqParams
        }
        queryList.push(isStream ? `GroqStream${paramsGroq}@stream` : `Groq ${paramsGroq} {text}`)
    }
    if (queryClaude) {
        let paramsClaude = '',
            hasClaudeArgs = claudeParams
        if (hasClaudeArgs) {
            paramsList.push(`$claudeParams: ClaudeArgs`)
            paramsClaude = '(params: $claudeParams)'
            variables.claudeParams = claudeParams
        }
        queryList.push(isStream ? `ClaudeStream${paramsClaude}@stream` : `Claude ${paramsClaude} {text}`)
    }
    if (queryErnie) {
        let paramsErnie = '',
            hasErnieArgs = ernieParams
        if (hasErnieArgs) {
            paramsList.push(`$ernieParams: ErnieArgs`)
            paramsErnie = '(params: $ernieParams)'
            variables.ernieParams = ernieParams
        }
        queryList.push(isStream ? `ErnieStream${paramsErnie}@stream` : `Ernie ${paramsErnie} {text}`)
    }
    if (queryOpenAI) {
        let paramsOpenAI = '',
            hasOpenAIArgs = openAIParams
        if (hasOpenAIArgs) {
            paramsList.push(`$openAIParams: OpenaiArgs`)
            paramsOpenAI = '(params: $openAIParams)'
            variables.openAIParams = openAIParams
        }
        queryList.push(isStream ? `OpenaiStream${paramsOpenAI}@stream` : `Openai ${paramsOpenAI} {text}`)
    }
    if (queryAzureOpenAI) {
        let paramsAzureOpenAI = '',
            hasAzureOpenAIArgs = azureOpenAIParams
        if (hasAzureOpenAIArgs) {
            paramsList.push(`$azureOpenAIParams: AzureOpenaiArgs`)
            paramsAzureOpenAI = '(params: $azureOpenAIParams)'
            variables.azureOpenAIParams = azureOpenAIParams
        }
        queryList.push(
            isStream ? `AzureOpenaiStream${paramsAzureOpenAI}@stream` : `AzureOpenai ${paramsAzureOpenAI} {text}`
        )
    }
    if (queryWorkersAI) {
        let paramsWorkersAI = '',
            hasWorkersAIArgs = workersAIParams
        if (hasWorkersAIArgs) {
            paramsList.push(`$workersAIParams: WorkersAIArgs`)
            paramsWorkersAI = '(params: $workersAIParams)'
            variables.workersAIParams = workersAIParams
        }
        queryList.push(isStream ? `WorkersAIStream${paramsWorkersAI}@stream` : `WorkersAI ${paramsWorkersAI} {text}`)
    }
    if (queryLingyiwanwu) {
        let paramsLingyiwanwu = '',
            hasLingyiwanwuArgs = lingyiwanwuParams
        if (hasLingyiwanwuArgs) {
            paramsList.push(`$lingyiwanwuParams: LingyiwanwuArgs`)
            paramsLingyiwanwu = '(params: $lingyiwanwuParams)'
            variables.lingyiwanwuParams = lingyiwanwuParams
        }
        queryList.push(
            isStream ? `LingyiwanwuStream${paramsLingyiwanwu}@stream` : `Lingyiwanwu ${paramsLingyiwanwu} {text}`
        )
    }
    const query = `query ${queryName}(${paramsList.join(', ')}) {
        chat(params: $params) {
            ${isTopic ? '' : 'ChatInfo'}
            ${queryList.join('\n            ')}
        }
      }`
    return {
        operationName: queryName,
        query,
        variables,
    }
}
