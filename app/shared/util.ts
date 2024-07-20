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

export const generateMD5_backup = async (input: string) => {
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

export const generateMD5 = async (input: string) => {
    return md5(input)
}

function md5(string: string) {
    function rotateLeft(lValue: any, iShiftBits: any) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits))
    }

    function addUnsigned(lX: any, lY: any) {
        var lX4, lY4, lX8, lY8, lResult
        lX8 = lX & 0x80000000
        lY8 = lY & 0x80000000
        lX4 = lX & 0x40000000
        lY4 = lY & 0x40000000
        lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff)
        if (lX4 & lY4) {
            return lResult ^ 0x80000000 ^ lX8 ^ lY8
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return lResult ^ 0xc0000000 ^ lX8 ^ lY8
            } else {
                return lResult ^ 0x40000000 ^ lX8 ^ lY8
            }
        } else {
            return lResult ^ lX8 ^ lY8
        }
    }

    function f(x: any, y: any, z: any) {
        return (x & y) | (~x & z)
    }
    function g(x: any, y: any, z: any) {
        return (x & z) | (y & ~z)
    }
    function h(x: any, y: any, z: any) {
        return x ^ y ^ z
    }
    function _k(x: any, y: any, z: any) {
        return y ^ (x | ~z)
    }

    function ff(a: any, b: any, c: any, d: any, x: any, s: any, ac: any) {
        a = addUnsigned(a, addUnsigned(addUnsigned(f(b, c, d), x), ac))
        return addUnsigned(rotateLeft(a, s), b)
    }
    function gg(a: any, b: any, c: any, d: any, x: any, s: any, ac: any) {
        a = addUnsigned(a, addUnsigned(addUnsigned(g(b, c, d), x), ac))
        return addUnsigned(rotateLeft(a, s), b)
    }
    function hh(a: any, b: any, c: any, d: any, x: any, s: any, ac: any) {
        a = addUnsigned(a, addUnsigned(addUnsigned(h(b, c, d), x), ac))
        return addUnsigned(rotateLeft(a, s), b)
    }
    function kk(a: any, b: any, c: any, d: any, x: any, s: any, ac: any) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_k(b, c, d), x), ac))
        return addUnsigned(rotateLeft(a, s), b)
    }

    var x: any[] = []
    var k: any, AA: any, BB: any, CC: any, DD: any, a: any, b: any, c: any, d: any
    var S11 = 7,
        S12 = 12,
        S13 = 17,
        S14 = 22
    var S21 = 5,
        S22 = 9,
        S23 = 14,
        S24 = 20
    var S31 = 4,
        S32 = 11,
        S33 = 16,
        S34 = 23
    var S41 = 6,
        S42 = 10,
        S43 = 15,
        S44 = 21

    string = unescape(encodeURIComponent(string))

    for (var i = 0; i < string.length; i++) {
        x[i >> 2] |= (string.charCodeAt(i) & 0xff) << ((i % 4) * 8)
    }
    x[string.length >> 2] |= 0x80 << ((string.length % 4) * 8)
    x[((string.length + 8) >> 6) * 16 + 14] = string.length * 8

    a = 0x67452301
    b = 0xefcdab89
    c = 0x98badcfe
    d = 0x10325476

    for (var i = 0; i < x.length; i += 16) {
        AA = a
        BB = b
        CC = c
        DD = d
        a = ff(a, b, c, d, x[i + 0], S11, 0xd76aa478)
        d = ff(d, a, b, c, x[i + 1], S12, 0xe8c7b756)
        c = ff(c, d, a, b, x[i + 2], S13, 0x242070db)
        b = ff(b, c, d, a, x[i + 3], S14, 0xc1bdceee)
        a = ff(a, b, c, d, x[i + 4], S11, 0xf57c0faf)
        d = ff(d, a, b, c, x[i + 5], S12, 0x4787c62a)
        c = ff(c, d, a, b, x[i + 6], S13, 0xa8304613)
        b = ff(b, c, d, a, x[i + 7], S14, 0xfd469501)
        a = ff(a, b, c, d, x[i + 8], S11, 0x698098d8)
        d = ff(d, a, b, c, x[i + 9], S12, 0x8b44f7af)
        c = ff(c, d, a, b, x[i + 10], S13, 0xffff5bb1)
        b = ff(b, c, d, a, x[i + 11], S14, 0x895cd7be)
        a = ff(a, b, c, d, x[i + 12], S11, 0x6b901122)
        d = ff(d, a, b, c, x[i + 13], S12, 0xfd987193)
        c = ff(c, d, a, b, x[i + 14], S13, 0xa679438e)
        b = ff(b, c, d, a, x[i + 15], S14, 0x49b40821)

        a = gg(a, b, c, d, x[i + 1], S21, 0xf61e2562)
        d = gg(d, a, b, c, x[i + 6], S22, 0xc040b340)
        c = gg(c, d, a, b, x[i + 11], S23, 0x265e5a51)
        b = gg(b, c, d, a, x[i + 0], S24, 0xe9b6c7aa)
        a = gg(a, b, c, d, x[i + 5], S21, 0xd62f105d)
        d = gg(d, a, b, c, x[i + 10], S22, 0x2441453)
        c = gg(c, d, a, b, x[i + 15], S23, 0xd8a1e681)
        b = gg(b, c, d, a, x[i + 4], S24, 0xe7d3fbc8)
        a = gg(a, b, c, d, x[i + 9], S21, 0x21e1cde6)
        d = gg(d, a, b, c, x[i + 14], S22, 0xc33707d6)
        c = gg(c, d, a, b, x[i + 3], S23, 0xf4d50d87)
        b = gg(b, c, d, a, x[i + 8], S24, 0x455a14ed)
        a = gg(a, b, c, d, x[i + 13], S21, 0xa9e3e905)
        d = gg(d, a, b, c, x[i + 2], S22, 0xfcefa3f8)
        c = gg(c, d, a, b, x[i + 7], S23, 0x676f02d9)
        b = gg(b, c, d, a, x[i + 12], S24, 0x8d2a4c8a)

        a = hh(a, b, c, d, x[i + 5], S31, 0xfffa3942)
        d = hh(d, a, b, c, x[i + 8], S32, 0x8771f681)
        c = hh(c, d, a, b, x[i + 11], S33, 0x6d9d6122)
        b = hh(b, c, d, a, x[i + 14], S34, 0xfde5380c)
        a = hh(a, b, c, d, x[i + 1], S31, 0xa4beea44)
        d = hh(d, a, b, c, x[i + 4], S32, 0x4bdecfa9)
        c = hh(c, d, a, b, x[i + 7], S33, 0xf6bb4b60)
        b = hh(b, c, d, a, x[i + 10], S34, 0xbebfbc70)
        a = hh(a, b, c, d, x[i + 13], S31, 0x289b7ec6)
        d = hh(d, a, b, c, x[i + 0], S32, 0xeaa127fa)
        c = hh(c, d, a, b, x[i + 3], S33, 0xd4ef3085)
        b = hh(b, c, d, a, x[i + 6], S34, 0x4881d05)
        a = hh(a, b, c, d, x[i + 9], S31, 0xd9d4d039)
        d = hh(d, a, b, c, x[i + 12], S32, 0xe6db99e5)
        c = hh(c, d, a, b, x[i + 15], S33, 0x1fa27cf8)
        b = hh(b, c, d, a, x[i + 2], S34, 0xc4ac5665)

        a = kk(a, b, c, d, x[i + 0], S41, 0xf4292244)
        d = kk(d, a, b, c, x[i + 7], S42, 0x432aff97)
        c = kk(c, d, a, b, x[i + 14], S43, 0xab9423a7)
        b = kk(b, c, d, a, x[i + 5], S44, 0xfc93a039)
        a = kk(a, b, c, d, x[i + 12], S41, 0x655b59c3)
        d = kk(d, a, b, c, x[i + 3], S42, 0x8f0ccc92)
        c = kk(c, d, a, b, x[i + 10], S43, 0xffeff47d)
        b = kk(b, c, d, a, x[i + 1], S44, 0x85845dd1)
        a = kk(a, b, c, d, x[i + 8], S41, 0x6fa87e4f)
        d = kk(d, a, b, c, x[i + 15], S42, 0xfe2ce6e0)
        c = kk(c, d, a, b, x[i + 6], S43, 0xa3014314)
        b = kk(b, c, d, a, x[i + 13], S44, 0x4e0811a1)
        a = kk(a, b, c, d, x[i + 4], S41, 0xf7537e82)
        d = kk(d, a, b, c, x[i + 11], S42, 0xbd3af235)
        c = kk(c, d, a, b, x[i + 2], S43, 0x2ad7d2bb)
        b = kk(b, c, d, a, x[i + 9], S44, 0xeb86d391)

        a = addUnsigned(a, AA)
        b = addUnsigned(b, BB)
        c = addUnsigned(c, CC)
        d = addUnsigned(d, DD)
    }

    var temp = padToZero(a) + padToZero(b) + padToZero(c) + padToZero(d)

    function padToZero(num: any) {
        var hex = num.toString(16)
        return hex.length < 8 ? '0'.repeat(8 - hex.length) + hex : hex
    }

    return temp.toLowerCase()
}
