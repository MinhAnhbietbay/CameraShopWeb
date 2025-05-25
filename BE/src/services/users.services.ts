import { RegisterRequestBody } from '~/models/requests/auth.requests'
import dotenv from 'dotenv'
import databaseService from './database.services'
import User from '~/models/schemas/User.schema'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enums'
import jwt from 'jsonwebtoken'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import {
    ChangePasswordRequestBody,
    UpdateRoleRequestBody,
    UpdateUserAddressRequestBody
} from '~/models/requests/user.requests'

dotenv.config()

class UsersService {
    private signAccessToken(user_id: string) {
        return signToken({
            payload: {
                user_id,
                token_type: TokenType.AccessToken
            },
            privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
            options: {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN_TIME
            } as jwt.SignOptions
        })
    }

    private signRefreshToken(user_id: string) {
        return signToken({
            payload: {
                user_id,
                token_type: TokenType.RefreshToken
            },
            privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
            options: {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN_TIME
            } as jwt.SignOptions
        })
    }

    private async signToken(user_id: string) {
        return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
    }

    async register(payload: RegisterRequestBody) {
        const result = await databaseService.users.insertOne(
            new User({
                ...payload,
                password: hashPassword(payload.password)
            })
        )
        const user_id = result.insertedId.toString()
        const [accessToken, refreshToken] = await this.signToken(user_id)
        await databaseService.refreshTokens.insertOne(
            new RefreshToken({
                user_id: new ObjectId(user_id),
                token: refreshToken
            })
        )
        return {
            accessToken,
            refreshToken
        }
    }
    async checkEmailExists(email: string) {
        const user = await databaseService.users.findOne({ email })
        return user !== null
    }
    async login(user_id: string) {
        const [accessToken, refreshToken] = await this.signToken(user_id)
        await databaseService.refreshTokens.insertOne(
            new RefreshToken({
                user_id: new ObjectId(user_id),
                token: refreshToken
            })
        )
        const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) });
        return {
            accessToken,
            refreshToken,
            user
        }
    }
    async logout(refresh_token: string) {
        await databaseService.refreshTokens.deleteOne({ token: refresh_token })
        return
    }

    async refreshToken(user_id: string, refresh_token: string) {
        await databaseService.refreshTokens.deleteOne({ token: refresh_token })
        const [accessToken, refreshToken] = await this.signToken(user_id)
        await databaseService.refreshTokens.insertOne(
            new RefreshToken({
                user_id: new ObjectId(user_id),
                token: refreshToken
            })
        )
        return {
            accessToken,
            refreshToken
        }
    }

    async getUserById(user_id: string) {
        const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
        return user
    }

    async updateUserAddress(user_id: string, reqBody: UpdateUserAddressRequestBody) {
        const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
        if (!user) {
            throw new Error('User not found')
        }
        return await databaseService.users.updateOne(
            { _id: new ObjectId(user_id) },
            { $set: { address: reqBody.address, phone: reqBody.phone } }
        )
    }

    async changePassword(user_id: string, reqBody: ChangePasswordRequestBody) {
        const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
        if (!user) {
            throw new Error('User not found')
        }
        return await databaseService.users.updateOne(
            { _id: new ObjectId(user_id) },
            { $set: { password: hashPassword(reqBody.newPassword) } }
        )
    }

    async getAllUsers(page: number = 1, pageSize: number = 10) {
        const skip = (page - 1) * pageSize
        const [users, total] = await Promise.all([
            databaseService.users.find({}).skip(skip).limit(pageSize).toArray(),
            databaseService.users.countDocuments({})
        ])
        return {
            users,
            pagination: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize)
            }
        }
    }

    async deleteUser(user_id: string) {
        return await databaseService.users.deleteOne({ _id: new ObjectId(user_id) })
    }

    async updateRole(user_id: string, reqBody: UpdateRoleRequestBody) {
        return await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, { $set: { role: reqBody.role } })
    }

    async updateUserFields(user_id: string, fields: any) {
        const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
        if (!user) {
            throw new Error('User not found')
        }
        return await databaseService.users.updateOne(
            { _id: new ObjectId(user_id) },
            { $set: fields }
        )
    }
}

const usersService = new UsersService()

export default usersService
