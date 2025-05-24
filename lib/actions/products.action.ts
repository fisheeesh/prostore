"use server"

import { LATEST_PRODUCTS_LIMIT } from "../constants"
import { prisma } from '@/db/prisma'
import { convertToPlainObject } from "../utils"

export const getLatestProducts = async () => {
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