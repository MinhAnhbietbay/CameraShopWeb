import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { RegisterRequestBody, LogoutRequestBody, RefreshTokenRequestBody } from '~/models/requests/auth.requests'
import User from '~/models/schemas/User.schema'
import usersService from '~/services/users.services'
import { USERS_MESSAGES } from '~/constants/messages'

export const loginController = async (req: Request, res: Response) => {
    const user = req.user as User
    const user_id = user._id as ObjectId
    const result = await usersService.login(user_id.toString())
    res.json({
        message: USERS_MESSAGES.LOGIN_SUCCESS,
        result
    })
    return
}

export const registerController = async (
    req: Request<ParamsDictionary, any, RegisterRequestBody>,
    res: Response,
    next: NextFunction
) => {
    const result = await usersService.register(req.body)
    res.json({
        message: USERS_MESSAGES.REGISTER_SUCCESS,
        result
    })
    return
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutRequestBody>, res: Response) => {
    const { refresh_token } = req.body
    const result = await usersService.logout(refresh_token)
    res.json({
        message: USERS_MESSAGES.LOGOUT_SUCCESS,
        result
    })
    return
}

export const refreshTokenController = async (
    req: Request<ParamsDictionary, any, RefreshTokenRequestBody>,
    res: Response
) => {
    const { refresh_token } = req.body
    const user_id = req.decoded_refresh_token?.user_id as string
    const result = await usersService.refreshToken(user_id, refresh_token)
    res.json({
        message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESS,
        result
    })
    return
}
