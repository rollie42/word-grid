import BitArray from "@bitarray/es6"
import { encode, decode } from "base64-arraybuffer"

export interface GameDef {
    w1: string
    w2: string
    w3: string
    w4: string
    h1: string
    h2: string
    h3: string
    h4: string
}

export const validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ-".split('')
export const serializeSettings = (settings: GameDef) => {
    const stringConcat = Object.values(settings).join('-').toUpperCase()
    const bits = Array.from(stringConcat)
        .map(c => {
            // TODO: check if invalid?
            // console.log(validChars.indexOf(c).toString(2).padStart(5, '0').slice(-5))
            return validChars.indexOf(c).toString(2).padStart(5, '0').slice(-5) // 5 bits is enough to index our array
        })
        .join('')

    let arr = BitArray.from(bits)    
    const encoded = encode(arr.buffer).replaceAll("+", "-").replaceAll("/", "_")
    return encoded
}

export const deserializeSettings = (encoded: string): GameDef => {
    const buffer = decode(encoded.replaceAll("-", "+").replaceAll("_", "/"))
    const vals = []
    for(const b of new Uint8Array(buffer)) {
        for (let i = 0; i < 8; i++) {
            vals.push(!!(b & (1 << i)))
        }
    }
    let arr = BitArray.from(vals)
    const a2 = [...arr].map(b => b.toString())
    const settings = a2.map((_, index) => index * 5)
        .map(begin => a2.slice(begin, begin + 5).join(''))
        .map(chunk => parseInt(chunk, 2))
        .map(idx => validChars[idx])
        .join('')
        .split('-')
    
    return {
        w1: settings[0],
        w2: settings[1],
        w3: settings[2],
        w4: settings[3],
        h1: settings[4],
        h2: settings[5],
        h3: settings[6],
        h4: settings[7].replace(/A*$/, ''),
    }  
}