export interface UpdateUserAddressRequestBody {
    address: string
    phone: string
}

export interface ChangePasswordRequestBody {
    oldPassword: string
    newPassword: string
    confirmNewPassword: string
}

export interface UpdateRoleRequestBody {
    role: 'admin' | 'user'
}
