import { Db, MongoClient, Collection } from 'mongodb'
import { config } from 'dotenv'
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Product from '~/models/schemas/Product.schema'
import Cart from '~/models/schemas/Cart.schema'
import Order from '~/models/schemas/Order.schema'

config()

const uri = process.env.DB_URI as string

class DatabaseService {
    private client: MongoClient
    private db: Db

    constructor() {
        this.client = new MongoClient(uri)
        this.db = this.client.db(process.env.DB_NAME)
    }
    async connect() {
        try {
            await this.db.command({ ping: 1 })
            console.log('Kết nối MongoDB thành công!')
            await this.createIndexes()
        } catch (error) {
            console.log('Kết nối MongoDB thất bại!', error)
            throw error
        }
    }

    async createIndexes() {
        await this.products.dropIndex('name_text_description_text_category_text')
        await this.products.createIndex({
            name: 'text',
            description: 'text',
            category: 'text'
        })
        console.log('Đã tạo text index cho collection products')
    }

    get users(): Collection<User> {
        return this.db.collection(process.env.DB_USER_COLLECTION as string)
    }
    get refreshTokens(): Collection<RefreshToken> {
        return this.db.collection(process.env.DB_REFRESH_TOKEN_COLLECTION as string)
    }
    get products(): Collection<Product> {
        return this.db.collection(process.env.DB_PRODUCT_COLLECTION as string)
    }
    get carts(): Collection<Cart> {
        return this.db.collection(process.env.DB_CART_COLLECTION as string)
    }
    get orders(): Collection<Order> {
        return this.db.collection(process.env.DB_ORDER_COLLECTION as string)
    }
}

const databaseService = new DatabaseService()

export default databaseService
