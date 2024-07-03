import { IExecutableSchemaDefinition } from '@graphql-tools/schema'
import ChatCommon from './ChatCommon'
import GeminiPro from './AIService/GeminiPro'
import Claude from './AIService/Claude'
import Moonshot from './AIService/Moonshot'
import Openai from './AIService/Openai'
import Groq from './AIService/Groq'
import Lingyiwanwu from './AIService/Lingyiwanwu'
import Ernie from './AIService/Ernie'
import Qwen from './AIService/Qwen'
import Zhipu from './AIService/Zhipu'
import Chain from './Chain'
import AzureOpenai from './AIService/AzureOpenai'
import WorkersAI from './AIService/WorkersAI'
import User from './User'
import BasicInfo from './UserService/BasicInfo'
import Histories from './UserService/Histories'
import Conversation from './UserService/Conversation'
import AIBotList from './UserService/AIBotList'
import ImageSwapCommon from './ImageSwapCommon'
import FaceSwap from './ImageSwapServices/FaceSwap'

const serviceList = [
    Chain,
    ChatCommon,
    AzureOpenai,
    Openai,
    GeminiPro,
    Claude,
    Moonshot,
    Groq,
    Lingyiwanwu,
    Ernie,
    Qwen,
    Zhipu,
    WorkersAI,
    User,
    BasicInfo,
    Histories,
    Conversation,
    AIBotList,

    ImageSwapCommon,
    FaceSwap,
]

export default {
    typeDefinitions: serviceList.map(service => service.typeDefinitions),
    resolverList: serviceList.map(service => service.resolvers) as IExecutableSchemaDefinition['resolvers'],
}
