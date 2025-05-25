import { ObjectId } from 'mongodb'

interface FeatureType {
    title: string
    description: string
    image: string
}

interface ProductType {
    _id?: ObjectId
    name: string
    price: number
    description: string
    category: string
    image: string
    count_in_stock: number
    sold: number
    brand: string
    createdAt?: Date
    updatedAt?: Date
    parentCategory?: string
    additionalImages?: string[]
    features?: FeatureType[]
    type?: string
}

class Product {
    _id?: ObjectId
    name: string
    price: number
    description: string
    category: string
    image: string
    count_in_stock: number
    sold: number
    brand: string
    createdAt?: Date
    updatedAt?: Date
    parentCategory?: string
    additionalImages?: string[]
    features?: FeatureType[]
    type?: string

    constructor(product: ProductType) {
        const date = new Date()
        this._id = product._id || new ObjectId()
        this.name = product.name
        this.price = Number(product.price)
        this.description = product.description
        this.category = product.category
        this.image = product.image
        this.count_in_stock = Number(product.count_in_stock)
        this.sold = Number(product.sold)
        this.brand = product.brand || ''
        this.createdAt = product.createdAt || date
        this.updatedAt = product.updatedAt || date
        this.parentCategory = product.parentCategory
        this.additionalImages = product.additionalImages || []
        this.features = product.features || []
        this.type = product.type
    }
}

export default Product
