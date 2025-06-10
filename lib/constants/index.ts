export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Prostore'
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'A modern e-commerce platform built with Next.js'
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
export const LATEST_PRODUCTS_LIMIT = Number(process.env.NEXT_LATEST_PRODUCTS_LIMIT) || 4
export const SIGN_IN_DEFAULT_VALUES = {
    email: 'admin@prostore.com',
    password: '123456'
}
export const SIGN_UP_DEFAULT_VALUES = {
    name: 'test',
    email: 'test@example.com',
    password: '123456',
    confirmPassword: '123456'
}
export const SHIPPING_ADDRESS_DEFAULT_VALUES = {
    fullName: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    country: '',
}

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS ? (process.env.PAYMENT_METHODS.split(', ')) : ['PayPal', 'Stripe', 'CashOnDelivery']
export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD || 'PayPal'

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12

export const PRODUCT_DEFAULT_VALUES = {
    name: '',
    slug: '',
    category: '',
    images: [],
    brand: '',
    description: '',
    price: '0',
    stock: 0,
    rating: '0',
    numReviews: '0',
    isFeatured: false,
    banner: null
}

export const USER_ROLES = process.env.USER_ROLES ? (process.env.USER_ROLES.split(', ')) : ['admin', 'user']

export const REVIEW_FORM_DEFAULT_VALUES = {
    title: '',
    description: '',
    rating: 0
}

export const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev'

// sb-unrvc43207158@personal.example.com
// .q?lg3=X

// sb-vf2fb43008178@business.example.com
// qv-$HJ1t
