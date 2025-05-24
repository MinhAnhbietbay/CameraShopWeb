import { NextFunction, Request, Response } from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import { EntityError } from '~/models/Errors'

export const validate = (validations: RunnableValidationChains<ValidationChain>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await validations.run(req)
        const errors = validationResult(req)
        const errorObject = errors.mapped()

        if (errors.isEmpty()) {
            next()
            return
        }

        const entityError = new EntityError({
            message: 'Validation error',
            errors: {}
        })

        for (const key in errorObject) {
            const { msg } = errorObject[key]
            // Nếu lỗi không phải là lỗi xác thực, trả về lỗi
            if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
                return next(msg)
            }
            entityError.errors[key] = errorObject[key]
        }

        next(entityError)
    }
}
