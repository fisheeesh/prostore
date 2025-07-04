"use server"

import { prisma } from '@/db/prisma'
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants"
import { convertToPlainObject, formatErrors } from "../utils"
import { insertProductSchema, updateProductSchema } from "../validator"
import { Prisma } from '../generated/prisma'

export const getLatestProductsAction = async () => {
    const data = await prisma.product.findMany({
        take: LATEST_PRODUCTS_LIMIT,
        orderBy: { createdAt: 'desc' }
    })

    //* Prisma object need to be converted into plain object
    return convertToPlainObject(data)

    // //* Map over the query result and convert Decimal's to Strings
    // return data.map((product) => ({
    //     ...product,
    //     price: product.price.toString(),
    //     rating: product.rating.toString(),
    // }));
}

//* Get single product by it's slug
export const getProductBySlugAction = async (slug: string) => {
    return await prisma.product.findFirst({
        where: { slug: slug }
    })
}

//* Get single product by it's id
export const getProductByIdAction = async (productId: string) => {
    const data = await prisma.product.findFirst({
        where: { id: productId }
    })

    return convertToPlainObject(data)
}

//* Get All products
export async function getAllProductsAction({
    query,
    limit = PAGE_SIZE,
    page,
    category,
    price,
    rating,
    sort
}: {
    query: string,
    limit?: number,
    page: number,
    category?: string,
    price?: string,
    rating?: string,
    sort?: string
}) {
    //* Query Filter
    const queryFilter: Prisma.ProductWhereInput = query && query !== 'all' ? {
        name: { contains: query, mode: 'insensitive' } as Prisma.StringFilter
    } : {}

    //* Category Filter
    const categoryFilter: Prisma.ProductWhereInput = category && category !== 'all' ?
        { category } : {}

    //* Price Filter
    const priceFilter: Prisma.ProductWhereInput = price && price !== 'all' ? {
        price: {
            gte: Number(price.split('-')[0]),
            lte: Number(price.split('-')[1])
        }
    } : {}

    //* Rating Filter
    const ratingFilter: Prisma.ProductWhereInput = rating && rating !== 'all' ? {
        rating: {
            gte: Number(rating),
        }
    } : {}

    const data = await prisma.product.findMany({
        where: {
            ...queryFilter,
            ...categoryFilter,
            ...priceFilter,
            ...ratingFilter
        },
        orderBy: sort === 'lowest' ? {
            price: 'asc'
        } : sort === 'highes' ? {
            price: 'desc'
        } : sort === 'rating' ? {
            rating: 'desc'
        } : {
            createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
    })

    const dataCount = await prisma.product.count({
        where: {
            ...queryFilter,
            ...categoryFilter,
            ...priceFilter,
            ...ratingFilter
        }
    })

    return {
        data: convertToPlainObject(data),
        totalPages: Math.ceil(dataCount / limit)
    }
}

//* Delete a product
export async function deleteProductAction(id: string) {
    try {
        const productExists = await prisma.product.findFirst({
            where: { id }
        })
        if (!productExists) throw new Error('Product not found.')

        await prisma.product.delete({
            where: { id }
        })

        revalidatePath('/admin/products')

        return { success: true, message: 'Product deleted successfully.' }

    } catch (error) {
        return { success: false, message: formatErrors(error) }
    }
}

//* Create a product
export async function createProductAction(data: z.infer<typeof insertProductSchema>) {
    try {
        const product = insertProductSchema.parse(data)

        await prisma.product.create({ data: product })

        revalidatePath('/admin/products')

        return { success: true, message: 'Product created successfully.' }
    } catch (error) {
        return { success: false, message: formatErrors(error) }
    }
}

//* Update a product
export async function updateProductAction(data: z.infer<typeof updateProductSchema>) {
    try {
        const product = updateProductSchema.parse(data)

        const productExits = await prisma.product.findFirst({
            where: { id: product.id }
        })

        if (!productExits) throw new Error('Product not found.')

        await prisma.product.update({
            where: { id: product.id },
            data: product
        })

        revalidatePath('/admin/products')

        return { success: true, message: 'Product updated successfully.' }
    } catch (error) {
        return { success: false, message: formatErrors(error) }
    }
}

//* Get all categories
export async function getAllCategoriesAction() {
    const data = await prisma.product.groupBy({
        by: ['category'],
        _count: true
    })

    return data
}

//* Get featured product
export async function getFeaturedProductsAction() {
    const data = await prisma.product.findMany({
        where: { isFeatured: true },
        orderBy: { createdAt: 'desc' },
        take: 4
    })

    return convertToPlainObject(data)
}

export async function getDealProductAction() {
    const data = await prisma.product.findFirst({
        where: { isDeal: true },
    })

    return convertToPlainObject(data)
}