import _ from 'lodash'
const env = (typeof process != 'undefined' && process?.env) || ({} as NodeJS.ProcessEnv)
import { defaultSalt } from './constants'
// 加盐并加密函数
export const imageIDEncrypt = (imageID: string) => {
    // 将盐和 imageID 交替混合
    let mixed = ''
    const salt = env?.ENCRYPT_SALT || defaultSalt
    const maxLength = Math.max(imageID.length, salt.length)
    _.map(new Array(maxLength), (_, index) => {
        mixed += salt[index] || ''
        mixed += imageID[index] || ''
    })
    //   for (let i = 0; i < Math.max(imageID.length, salt.length); i++) {
    //     if (i < salt.length) mixed += salt[i];
    //     if (i < imageID.length) mixed += imageID[i];
    //   }

    // 将混合后的字符串转换为 Base64
    let encryptedID = Buffer.from(mixed).toString('base64')
    return encryptedID
}

// 解密函数
export const imageIDDecrypt = (encryptedID: string) => {
    // 将 Base64 编码的字符串解码为普通字符串
    let decodedID = Buffer.from(encryptedID, 'base64').toString('utf8')
    const salt = env?.ENCRYPT_SALT || defaultSalt
    const saltLength = salt.length
    // 从混合字符串中提取原始的 imageID
    let imageID = ''
    let saltIndex = 0
    _.map(new Array(decodedID.length), (_, index) => {
        if (saltIndex < saltLength && decodedID[index] === salt[saltIndex]) {
            saltIndex++
        } else {
            imageID += decodedID[index]
        }
    })

    //   for (let i = 0; i < decodedID.length; i++) {
    //     if (saltIndex < saltLength && decodedID[i] === salt[saltIndex]) {
    //       saltIndex++;
    //     } else {
    //       imageID += decodedID[i];
    //     }
    //   }

    // 验证盐是否完全匹配
    if (saltIndex !== saltLength) {
        throw new Error('Invalid salt or encrypted ID')
    }

    return imageID
}
