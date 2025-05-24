import { body, checkSchema } from 'express-validator'
import { PRODUCTS_MESSAGES } from '~/constants/messages'
import { validate } from '~/utils/validation'
import dotenv from 'dotenv'
dotenv.config()

export const addProductValidator = validate(
    checkSchema(
        {
            name: {
                notEmpty: {
                    errorMessage: PRODUCTS_MESSAGES.NAME_IS_REQUIRED
                },
                isString: {
                    errorMessage: PRODUCTS_MESSAGES.NAME_MUST_BE_STRING
                },
                trim: true
            },
            price: {
                notEmpty: {
                    errorMessage: PRODUCTS_MESSAGES.PRICE_IS_REQUIRED
                },
                isFloat: {
                    options: { min: 0 },
                    errorMessage: PRODUCTS_MESSAGES.PRICE_MUST_BE_POSITIVE_NUMBER
                },
                toFloat: true
            },
            maker: {
                notEmpty: {
                    errorMessage: PRODUCTS_MESSAGES.MAKER_IS_REQUIRED
                },
                isString: {
                    errorMessage: PRODUCTS_MESSAGES.MAKER_MUST_BE_STRING
                },
                trim: true
            },
            description: {
                notEmpty: {
                    errorMessage: PRODUCTS_MESSAGES.DESCRIPTION_IS_REQUIRED
                },
                isString: {
                    errorMessage: PRODUCTS_MESSAGES.DESCRIPTION_MUST_BE_STRING
                },
                trim: true
            },
            count_in_stock: {
                notEmpty: {
                    errorMessage: PRODUCTS_MESSAGES.COUNT_IN_STOCK_IS_REQUIRED
                },
                isInt: {
                    options: { min: 0 },
                    errorMessage: PRODUCTS_MESSAGES.COUNT_IN_STOCK_MUST_BE_NON_NEGATIVE_INTEGER
                },
                toInt: true
            },
            category: {
                notEmpty: {
                    errorMessage: PRODUCTS_MESSAGES.CATEGORY_IS_REQUIRED
                },
                isString: {
                    errorMessage: PRODUCTS_MESSAGES.CATEGORY_MUST_BE_STRING
                },
                trim: true
            }
        },
        ['body']
    )
)

export const updateProductValidator = validate(
    checkSchema(
        {
            name: {
                optional: true,
                isString: {
                    errorMessage: PRODUCTS_MESSAGES.NAME_MUST_BE_STRING
                },
                trim: true
            },
            price: {
                optional: true,
                isFloat: {
                    options: { min: 0 },
                    errorMessage: PRODUCTS_MESSAGES.PRICE_MUST_BE_POSITIVE_NUMBER
                },
                toFloat: true
            },
            description: {
                optional: true,
                isString: {
                    errorMessage: PRODUCTS_MESSAGES.DESCRIPTION_MUST_BE_STRING
                },
                trim: true
            },
            image: {
                optional: true,
                isString: {
                    errorMessage: PRODUCTS_MESSAGES.IMAGE_MUST_BE_STRING
                },
                trim: true
            },
            count_in_stock: {
                optional: true,
                isInt: {
                    options: { min: 0 },
                    errorMessage: PRODUCTS_MESSAGES.COUNT_IN_STOCK_MUST_BE_NON_NEGATIVE_INTEGER
                },
                toInt: true
            },
            category: {
                optional: true,
                isString: {
                    errorMessage: PRODUCTS_MESSAGES.CATEGORY_MUST_BE_STRING
                },
                trim: true
            },
            is_active: {
                optional: true,
                isBoolean: {
                    errorMessage: PRODUCTS_MESSAGES.IS_ACTIVE_MUST_BE_BOOLEAN
                },
                toBoolean: true
            }
        },
        ['body']
    )
)
