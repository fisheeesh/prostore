"use server"

import { CartItem } from "@/types"
import { calcPrice, convertToPlainObject, formatErrors } from "../utils"
import { cookies } from "next/headers"
import { auth } from "@/auth"
import { prisma } from "@/db/prisma"
import { cartItemSchema, insertCartSchema } from "../validator"
import { revalidatePath } from "next/cache"

export async function addItemToCartAction(data: CartItem) {
    try {
        //* Check for cart cookie
        const sessionCartId = (await cookies()).get('sessionCartId')?.value
        if (!sessionCartId) throw new Error('Cart session not found.')

        //* Get session and user Id
        const session = await auth()
        const userId = session?.user?.id ? (session.user.id as string) : undefined

        //* Get Cart
        const cart = await getMyCart()

        //* Parse invalid item
        const item = cartItemSchema.parse(data)

        //* Find product in database
        const product = await prisma.product.findFirst({
            where: { id: item.productId }
        })

        if (!product) throw new Error('Product not found.')

        if (!cart) {
            //* Create new cart obj
            const newCart = insertCartSchema.parse({
                userId: userId,
                items: [item],
                sessionCartId: sessionCartId,
                ...calcPrice([item])
            })

            // console.log(newCart)
            //* Add to database
            await prisma.cart.create({
                data: newCart
            })

            //* Revalidate product page
            revalidatePath(`/prodcut/${product.slug}`)

            return { success: true, message: 'Item added to cart.' }
        }
        else{
            
        }

        //$ TESTING PURPOSES
        // console.log({ sessionCartId: sessionCartId, userId: userId, itemsRequested: item, productFound: product })
    }
    catch (err) {
        return { success: true, message: formatErrors(err) }
    }
}

export async function getMyCart() {
    //* Check for cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value
    if (!sessionCartId) throw new Error('Cart session not found.')

    //* Get session and user Id
    const session = await auth()
    const userId = session?.user?.id ? (session.user.id as string) : undefined

    //* Get user cart from database
    const cart = await prisma.cart.findFirst({
        where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
    })

    if (!cart) return undefined

    //* Convert decimal and return
    return convertToPlainObject({
        ...cart,
        items: cart.items as CartItem[],
        itemsPrice: cart.itemsPrice.toString(),
        totalPrice: cart.totalPrice.toString(),
        shippingPrice: cart.shippingPrice.toString(),
        taxPrice: cart.taxPrice.toString(),

    })
}