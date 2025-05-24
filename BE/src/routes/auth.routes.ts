import { Router } from 'express'
import {
    loginController,
    registerController,
    logoutController,
    refreshTokenController
} from '~/controllers/auth.controller'
import {
    loginValidator,
    refreshTokenValidator,
    registerValidator,
    accessTokenValidator
} from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const authRouter = Router()

/**
 * Description: Login
 * Path: /login
 * Method: POST
 * Body: { email: string, password: string }
 */
authRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * Description: Register
 * Path: /register
 * Method: POST
 * Body: { name: string, email: string, password: string, confirmPassword: string }
 */
authRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * Description: Logout
 * Path: /logout
 * Method: POST
 * Header: { Authorization: Bearer <accessToken> }
 * Body: { refreshToken: string }
 */
authRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 * Description: Refresh Token
 * Path: /refresh-token
 * Method: POST
 * Body: { refreshToken: string }
 */
authRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

export default authRouter
