import dotenv from 'dotenv'
import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { CART_MESSAGES } from '~/constants/messages'
dotenv.config()

export const addToCartValidator = validate(
    checkSchema(
        {
            product_id: {
                notEmpty: {
                    errorMessage: CART_MESSAGES.PRODUCT_ID_REQUIRED
                },
                isMongoId: {
                    errorMessage: CART_MESSAGES.PRODUCT_ID_INVALID
                }
            },
            quantity: {
                notEmpty: {
                    errorMessage: CART_MESSAGES.QUANTITY_REQUIRED
                },
                isInt: {
                    options: { min: 1 },
                    errorMessage: CART_MESSAGES.QUANTITY_INVALID
                },
                toInt: true
            }
        },
        ['body']
    )
)

export const updateCartValidator = validate(
    checkSchema(
        {
            quantity: {
                notEmpty: {
                    errorMessage: CART_MESSAGES.QUANTITY_REQUIRED
                },
                isInt: {
                    options: { min: 1 },
                    errorMessage: CART_MESSAGES.QUANTITY_INVALID
                },
                toInt: true
            }
        },
        ['body']
    )
)
