import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'
import { Request, Response } from 'express'
import usersService from '~/services/users.services'

export const getUserByIdController = async (req: Request, res: Response) => {
    const user_id = req.params.user_id
    const user = await usersService.getUserById(user_id)
    res.json({
        message: 'User fetched successfully',
        result: user
    })
    return
}

export const getProfileController = async (req: Request, res: Response) => {
    const user_id = req.decoded_authorization?.user_id as string
    const user = await usersService.getUserById(user_id)
    res.json({
        message: 'User fetched successfully',
        result: user
    })
}

export const updateUserAddressController = async (req: Request, res: Response) => {
    const user_id = req.decoded_authorization?.user_id as string
    const { address, phone } = req.body

    if (!address || typeof address !== 'string') {
        res.status(400).json({
            message: 'Address is required and must be a string'
        })
        return
    }

    if (!phone || typeof phone !== 'string') {
        res.status(400).json({
            message: 'Phone is required and must be a string'
        })
        return
    }

    const user = await usersService.updateUserAddress(user_id, { address, phone })
    res.json({
        message: 'User address and phone updated successfully',
        result: user
    })
}

export const changePasswordController = async (req: Request, res: Response) => {
    const user_id = req.decoded_authorization?.user_id as string
    const user = await usersService.changePassword(user_id, req.body)
    res.json({
        message: 'Password changed successfully',
        result: user
    })
    return
}

export const deleteUserController = async (req: Request, res: Response) => {
    const user_id = req.params.user_id
    const user = await usersService.deleteUser(user_id)
    res.json({
        message: 'User deleted successfully',
        result: user
    })
    return
}

export const getAllUsersController = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1
    const pageSize = Number(req.query.pageSize) || 10
    const result = await usersService.getAllUsers(page, pageSize)
    res.json({
        message: 'Users fetched successfully',
        result
    })
    return
}

export const updateRoleController = async (req: Request, res: Response) => {
    const user_id = req.params.user_id
    const user = await usersService.updateRole(user_id, req.body)
    res.json({
        message: 'User role updated successfully',
        result: user
    })
    return
}
