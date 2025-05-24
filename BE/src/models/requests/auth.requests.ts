import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enums'

export interface RegisterRequestBody {
    name: string
    email: string
    password: string
    confirmPassword: string
    phone: string
}

export interface TokenPayload extends JwtPayload {
    user_id: string
    token_type: TokenType
}

export interface LogoutRequestBody {
    refresh_token: string
}

export interface RefreshTokenRequestBody {
    refresh_token: string
}
