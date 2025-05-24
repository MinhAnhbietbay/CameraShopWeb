import { checkSchema } from 'express-validator'
import { Request } from 'express'
import usersService from '~/services/users.services'
import { validate } from '~/utils/validation'
import { USERS_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import { ObjectId } from 'mongodb'

export const loginValidator = validate(
    checkSchema(
        {
            email: {
                isEmail: {
                    errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
                },
                trim: true,
                custom: {
                    options: async (value, { req }) => {
                        const user = await databaseService.users.findOne({
                            email: value,
                            password: hashPassword(req.body.password)
                        })
                        if (!user) {
                            throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
                        }
                        req.user = user
                        return true
                    }
                }
            }
        },
        ['body']
    )
)

export const registerValidator = validate(
    checkSchema(
        {
            name: {
                notEmpty: {
                    errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED
                },
                isString: {
                    errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING
                },
                isLength: {
                    options: { min: 1, max: 255 },
                    errorMessage: USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_255
                },
                trim: true
            },
            phone: {
                notEmpty: {
                    errorMessage: USERS_MESSAGES.PHONE_IS_REQUIRED
                },
                isString: {
                    errorMessage: 'Phone must be a string'
                },
                isLength: {
                    options: { min: 10, max: 11 },
                    errorMessage: 'Phone length must be from 10 to 11 characters'
                },
                matches: {
                    options: /^[0-9]+$/,
                    errorMessage: 'Phone must contain only numbers'
                },
                trim: true
            },
            email: {
                isEmail: {
                    errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
                },
                trim: true,
                custom: {
                    options: async (value) => {
                        const isExistsEmail = await usersService.checkEmailExists(value)
                        if (isExistsEmail) {
                            throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXISTS)
                        }
                        return true
                    }
                }
            },
            password: {
                notEmpty: {
                    errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
                },
                isString: {
                    errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
                },
                isLength: {
                    options: { min: 6, max: 255 },
                    errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
                },
                isStrongPassword: {
                    options: {
                        minLength: 6,
                        minLowercase: 1,
                        minUppercase: 1,
                        minNumbers: 1,
                        minSymbols: 1
                    },
                    errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
                }
            },
            confirmPassword: {
                notEmpty: {
                    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
                },
                isString: {
                    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING
                },
                isLength: {
                    options: { min: 6, max: 255 },
                    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
                },
                custom: {
                    options: (value, { req }) => {
                        if (value !== req.body.password)
                            throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_DOES_NOT_MATCH_PASSWORD)
                        return true
                    }
                },
                isStrongPassword: {
                    options: {
                        minLength: 6,
                        minLowercase: 1,
                        minUppercase: 1,
                        minNumbers: 1,
                        minSymbols: 1
                    },
                    errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
                }
            }
        },
        ['body']
    )
)

export const refreshTokenValidator = validate(
    checkSchema(
        {
            refresh_token: {
                notEmpty: {
                    errorMessage: USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED
                },
                custom: {
                    options: async (value: string, { req }) => {
                        try {
                            const [decoded_refresh_token, refresh_token] = await Promise.all([
                                verifyToken({
                                    token: value,
                                    secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
                                }),
                                databaseService.refreshTokens.findOne({
                                    token: value
                                })
                            ])
                            if (refresh_token === null) {
                                throw new ErrorWithStatus({
                                    message: USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST,
                                    status: HTTP_STATUS.UNAUTHORIZED_ERROR
                                })
                            }
                            ;(req as Request).decoded_refresh_token = decoded_refresh_token
                        } catch (error) {
                            if (error instanceof jwt.JsonWebTokenError) {
                                throw new ErrorWithStatus({
                                    message: capitalize(error.message),
                                    status: HTTP_STATUS.UNAUTHORIZED_ERROR
                                })
                            }
                            throw error
                        }
                        return true
                    }
                }
            }
        },
        ['body']
    )
)

export const accessTokenValidator = validate(
    checkSchema(
        {
            Authorization: {
                notEmpty: {
                    errorMessage: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED
                },
                custom: {
                    options: async (value: string, { req }) => {
                        const accessToken = value.split(' ')[1]
                        if (!accessToken) {
                            throw new ErrorWithStatus({
                                message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
                                status: HTTP_STATUS.UNAUTHORIZED_ERROR
                            })
                        }
                        try {
                            const decoded_authorization = await verifyToken({
                                token: accessToken,
                                secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
                            })
                            ;(req as Request).decoded_authorization = decoded_authorization
                        } catch (error) {
                            throw new ErrorWithStatus({
                                message: capitalize((error as JsonWebTokenError).message),
                                status: HTTP_STATUS.UNAUTHORIZED_ERROR
                            })
                        }
                        return true
                    }
                }
            }
        },
        ['headers']
    )
)

export const authorizeadmin = validate(
    checkSchema(
        {
            Authorization: {
                custom: {
                    options: async (value: string, { req }) => {
                        if (!req.decoded_authorization) {
                            throw new ErrorWithStatus({
                                message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
                                status: HTTP_STATUS.UNAUTHORIZED_ERROR
                            })
                        }
                        const user = await databaseService.users.findOne({
                            _id: new ObjectId(req.decoded_authorization.user_id as string)
                        })
                        if (!user || user.role !== 'admin') {
                            throw new ErrorWithStatus({
                                message: USERS_MESSAGES.ADMIN_ROLE_REQUIRED,
                                status: HTTP_STATUS.UNAUTHORIZED_ERROR
                            })
                        }
                        return true
                    }
                }
            }
        },
        ['headers']
    )
)
