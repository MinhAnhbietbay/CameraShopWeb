import fs from 'fs'
import path from 'path'

export const createUploadDir = () => {
    const uploadPath = path.join(__dirname, '../../../FE/public/uploads')

    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true })
        console.log('Created uploads directory at:', uploadPath)
    }
}
