import { configDotenv } from 'dotenv'
import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { ORDERS_MESSAGES } from '~/constants/messages'

configDotenv()
export const createOrderValidator = validate(
    checkSchema(
        {
            user_id: {
                notEmpty: {
                    errorMessage: ORDERS_MESSAGES.USER_ID_REQUIRED
                },
                isMongoId: {
                    errorMessage: ORDERS_MESSAGES.USER_ID_INVALID
                }
            },
            products: {
                isArray: {
                    errorMessage: ORDERS_MESSAGES.PRODUCTS_MUST_BE_ARRAY
                },
                notEmpty: {
                    errorMessage: ORDERS_MESSAGES.PRODUCTS_REQUIRED
                }
            },
            'products.*.product_id': {
                notEmpty: {
                    errorMessage: ORDERS_MESSAGES.PRODUCT_ID_REQUIRED
                },
                isMongoId: {
                    errorMessage: ORDERS_MESSAGES.PRODUCT_ID_INVALID
                }
            },
            'products.*.quantity': {
                notEmpty: {
                    errorMessage: ORDERS_MESSAGES.QUANTITY_REQUIRED
                },
                isInt: {
                    options: { min: 1 },
                    errorMessage: ORDERS_MESSAGES.QUANTITY_INVALID
                },
                toInt: true
            },
            total_price: {
                notEmpty: {
                    errorMessage: ORDERS_MESSAGES.TOTAL_PRICE_REQUIRED
                },
                isFloat: {
                    options: { min: 0 },
                    errorMessage: ORDERS_MESSAGES.TOTAL_PRICE_INVALID
                },
                toFloat: true
            },
            address: {
                notEmpty: {
                    errorMessage: ORDERS_MESSAGES.ADDRESS_REQUIRED
                },
                isString: {
                    errorMessage: ORDERS_MESSAGES.ADDRESS_INVALID
                },
                trim: true
            },
            payment_status: {
                optional: true,
                isIn: {
                    options: [['pending', 'paid']],
                    errorMessage: ORDERS_MESSAGES.PAYMENT_STATUS_INVALID
                }
            },
            status: {
                optional: true,
                isIn: {
                    options: [['pending', 'processing', 'shipped', 'delivered', 'cancelled']],
                    errorMessage: ORDERS_MESSAGES.STATUS_INVALID
                }
            }
        },
        ['body']
    )
)
