"use server"

import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants"
import { prisma } from '@/db/prisma'
import { convertToPlainObject } from "../utils"

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

//* Get All products
export async function getAllProductsAction({
    query,
    limit = PAGE_SIZE,
    page,
    category
}: {
    query: string,
    limit?: number,
    page: number,
    category?: string
}) {
    const data = await prisma.product.findMany({
        skip: (page - 1) * limit,
        take: limit
    })

    const dataCount = await prisma.product.count()

    return {
        data,
        totalPages: Math.ceil(dataCount / limit)
    }
}