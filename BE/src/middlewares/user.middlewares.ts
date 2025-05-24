import { checkSchema } from 'express-validator'
import { USERS_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { validate } from '~/utils/validation'
import { ObjectId } from 'mongodb'

export const updAddressValidator = validate(
    checkSchema(
        {
            address: {
                notEmpty: {
                    errorMessage: USERS_MESSAGES.ADDRESS_IS_REQUIRED
                },
                isString: {
                    errorMessage: USERS_MESSAGES.ADDRESS_MUST_BE_STRING
                },
                isLength: {
                    options: { min: 1, max: 255 },
                    errorMessage: USERS_MESSAGES.ADDRESS_LENGTH_MUST_BE_FROM_1_TO_255
                },
                trim: true
            },
            phone: {
                notEmpty: {
                    errorMessage: USERS_MESSAGES.PHONE_IS_REQUIRED
                },
                isMobilePhone: {
                    errorMessage: USERS_MESSAGES.PHONE_IS_INVALID
                },
                trim: true
            }
        },
        ['body']
    )
)

export const changePasswordValidator = validate(
    checkSchema(
        {
            oldPassword: {
                notEmpty: {
                    errorMessage: USERS_MESSAGES.OLD_PASSWORD_IS_REQUIRED
                },
                isString: {
                    errorMessage: USERS_MESSAGES.OLD_PASSWORD_MUST_BE_A_STRING
                },
                isLength: {
                    options: { min: 6, max: 255 },
                    errorMessage: USERS_MESSAGES.OLD_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
                },
                isStrongPassword: {
                    options: {
                        minLength: 6,
                        minLowercase: 1,
                        minUppercase: 1,
                        minNumbers: 1,
                        minSymbols: 1
                    },
                    errorMessage: USERS_MESSAGES.OLD_PASSWORD_MUST_BE_STRONG
                },
                custom: {
                    options: async (value, { req }) => {
                        const user = await databaseService.users.findOne({
                            _id: new ObjectId(req.decoded_authorization?.user_id as string),
                            password: hashPassword(value)
                        })
                        if (!user) {
                            throw new Error(USERS_MESSAGES.OLD_PASSWORD_INCORRECT)
                        }
                        return true
                    }
                }
            },
            newPassword: {
                notEmpty: {
                    errorMessage: USERS_MESSAGES.NEW_PASSWORD_IS_REQUIRED
                },
                isString: {
                    errorMessage: USERS_MESSAGES.NEW_PASSWORD_MUST_BE_A_STRING
                },
                isLength: {
                    options: { min: 6, max: 255 },
                    errorMessage: USERS_MESSAGES.NEW_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
                },
                isStrongPassword: {
                    options: {
                        minLength: 6,
                        minLowercase: 1,
                        minUppercase: 1,
                        minNumbers: 1,
                        minSymbols: 1
                    },
                    errorMessage: USERS_MESSAGES.NEW_PASSWORD_MUST_BE_STRONG
                }
            },
            confirmNewPassword: {
                notEmpty: {
                    errorMessage: USERS_MESSAGES.CONFIRM_NEW_PASSWORD_IS_REQUIRED
                },
                isString: {
                    errorMessage: USERS_MESSAGES.CONFIRM_NEW_PASSWORD_MUST_BE_A_STRING
                },
                isLength: {
                    options: { min: 6, max: 255 },
                    errorMessage: USERS_MESSAGES.CONFIRM_NEW_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
                },
                custom: {
                    options: (value, { req }) => {
                        if (value !== req.body.newPassword)
                            throw new Error(USERS_MESSAGES.CONFIRM_NEW_PASSWORD_DOES_NOT_MATCH_PASSWORD)
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
