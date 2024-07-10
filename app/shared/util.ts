export const sleep = (sec: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true)
        }, sec * 1000)
    })
}

export const isAbsoluteUrl = (url: string) => {
    return /^https?:\/\//.test(url)
}

export const generateMD5 = async (input: string) => {
    // 将输入字符串转换为 Uint8Array
    const encoder = new TextEncoder()
    const data = encoder.encode(input)

    // 使用 Web Crypto API 生成 MD5 哈希
    const hashBuffer = await crypto.subtle.digest('MD5', data)

    // 将 ArrayBuffer 转换为十六进制字符串
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    return hashHex
}
