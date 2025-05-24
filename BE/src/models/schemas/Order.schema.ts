import { ObjectId } from 'mongodb'

interface OrderItem {
    product_id: ObjectId
    quantity: number
    price: number
}

interface OrderType {
    _id?: ObjectId
    user_id: ObjectId
    items: OrderItem[]
    total_amount: number
    status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
    payment_status?: 'unpaid' | 'paid'
    shipping_address: string
    phone: string
    name: string
    createdAt?: Date
    updatedAt?: Date
}

class Order {
    _id: ObjectId
    user_id: ObjectId
    items: OrderItem[]
    total_amount: number
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
    payment_status: 'unpaid' | 'paid'
    shipping_address: string
    phone: string
    name: string
    createdAt: Date
    updatedAt: Date

    constructor(order: OrderType) {
        const now = new Date()
        this._id = order._id || new ObjectId()
        this.user_id = order.user_id
        this.items = order.items
        this.total_amount = order.total_amount
        this.status = order.status || 'pending'
        this.payment_status = order.payment_status || 'unpaid'
        this.shipping_address = order.shipping_address
        this.phone = order.phone
        this.name = order.name
        this.createdAt = order.createdAt || now
        this.updatedAt = order.updatedAt || now
    }
}

export default Order
