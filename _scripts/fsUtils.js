import {writeFile as writeFileCb} from 'fs'

export const writeFile = (filePath, data) => (
    new Promise((resolve, reject) => {
        writeFileCb(filePath, data, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
)
