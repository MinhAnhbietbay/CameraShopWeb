import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.routes'
import productsRouter from './routes/product.routes'
import databaseService from './services/database.services'
import { config } from 'dotenv'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import cartRouter from './routes/cart.routes'
import orderRouter from './routes/order.routes'
import userRouter from './routes/user.routes'
import { createUploadDir } from './utils/createUploadDir'
import adminRoutes from './routes/admin.routes'
config()

databaseService.connect()
const app = express()
const port = process.env.PORT

// Tạo thư mục uploads nếu chưa tồn tại
createUploadDir()

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))

app.use(express.json())

app.use('/auth', authRouter)

app.use('/users', userRouter)

app.use('/products', productsRouter)

app.use('/cart', cartRouter)

app.use('/orders', orderRouter)

app.use('/admin', adminRoutes)

app.use(defaultErrorHandler)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
