import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enums'

interface UserType {
    _id?: ObjectId
    name: string
    email: string
    password: string
    phone: string
    role?: string
    address?: string
    createdAt?: Date
    updatedAt?: Date
    email_verify_token?: string
    forgot_password_token?: string
    verify?: UserVerifyStatus
}

class User {
    _id: ObjectId
    name: string
    email: string
    password: string
    phone: string
    role: string
    address: string
    createdAt: Date
    updatedAt: Date
    email_verify_token: string
    forgot_password_token: string
    verify: UserVerifyStatus

    constructor(user: UserType) {
        const date = new Date()
        this._id = user._id || new ObjectId()
        this.name = user.name
        this.email = user.email
        this.password = user.password
        this.phone = user.phone
        this.role = user.role || 'user'
        this.address = user.address || ''
        this.createdAt = user.createdAt || date
        this.updatedAt = user.updatedAt || date
        this.email_verify_token = user.email_verify_token || ''
        this.forgot_password_token = user.forgot_password_token || ''
        this.verify = user.verify || UserVerifyStatus.Unverified
    }
}

export default User
