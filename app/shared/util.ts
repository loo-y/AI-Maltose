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
