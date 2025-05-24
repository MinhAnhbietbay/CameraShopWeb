import { Request } from 'express'
import multer from 'multer'
import path from 'path'

// Cấu hình storage cho multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Sử dụng đường dẫn tuyệt đối đến thư mục public của frontend
        const uploadPath = path.join(__dirname, '../../../FE/public/uploads')
        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})

// Kiểm tra file type
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
    } else {
        cb(new Error('Chỉ chấp nhận file ảnh!'))
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // giới hạn 5MB
    }
})

// Middleware xử lý lỗi upload
export const uploadMiddleware = (req: Request, res: any, next: any) => {
    upload.single('image')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    errors: {
                        image: {
                            msg: 'Kích thước file không được vượt quá 5MB'
                        }
                    }
                })
            }
            return res.status(400).json({
                errors: {
                    image: {
                        msg: err.message
                    }
                }
            })
        } else if (err) {
            return res.status(400).json({
                errors: {
                    image: {
                        msg: err.message
                    }
                }
            })
        }
        next()
    })
}
