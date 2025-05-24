import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

export function sha256(content: string) {
    return crypto.createHash('sha256').update(content).digest('hex')
}

export function hashPassword(password: string) {
    return sha256(password + process.env.PASSWORD_SECRET)
}
