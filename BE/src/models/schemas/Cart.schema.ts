import { ObjectId } from 'mongodb'

interface CartItem {
    product_id: ObjectId
    quantity: number
}

interface CartType {
    _id?: ObjectId
    user_id: ObjectId
    items: CartItem[]
    updatedAt?: Date
}

class Cart {
    _id: ObjectId
    user_id: ObjectId
    items: CartItem[]
    updatedAt: Date

    constructor(cart: CartType) {
        this._id = cart._id || new ObjectId()
        this.user_id = cart.user_id
        this.items = cart.items || []
        this.updatedAt = cart.updatedAt || new Date()
    }
}
export default Cart
