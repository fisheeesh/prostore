"use server"

import { auth } from "@/auth"
import { prisma } from "@/db/prisma"
import { Cart, CartItem } from "@/types"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { calcPrice, convertToPlainObject, formatErrors } from "../utils"
import { cartItemSchema, insertCartSchema } from "../validator"

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
            revalidatePath(`/product/${product.slug}`)

            return { success: true, message: `${product.name} added to cart.` }
        }
        else {
            //* Check if item is already in cart
            const existItem = (cart.items as CartItem[]).find(i => i.productId === item.productId)
            if (existItem) {
                //* Check stock
                if (product.stock < existItem.qty + 1) {
                    throw new Error('Not enough stock.')
                }

                //* Increase quantity
                (cart.items as CartItem[]).find(i => i.productId === item.productId)!.qty = existItem.qty + 1
            }
            else {
                //* If item does not exit in cart, check stock
                if (product.stock < 1) throw new Error('Not enough stock.')

                //* Add items to cart.items
                cart.items.push(item)
            }
            //* Save to database
            await prisma.cart.update({
                where: { id: cart.id },
                data: {
                    items: cart.items as CartItem[],
                    ...calcPrice(cart.items as CartItem[])
                }
            })

            //* Revalidate product page
            revalidatePath(`/product/${product.slug}`)

            return { success: true, message: `${product.name} ${!!existItem ? 'updated in' : 'added to'} cart.` }
        }

        //$ TESTING PURPOSES
        // console.log({ sessionCartId: sessionCartId, userId: userId, itemsRequested: item, productFound: product })
    }
    catch (err) {
        return { success: false, message: formatErrors(err) }
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

export async function removeItemFromCartAction(productId: string) {
    try {
        //* Check for cart cookie
        const sessionCartId = (await cookies()).get('sessionCartId')?.value
        if (!sessionCartId) throw new Error('Cart session not found.')

        //* Get the product
        const product = await prisma.product.findFirst({
            where: { id: productId }
        })

        if (!product) throw new Error('Product not found.')

        //* Get user cart
        const cart = await getMyCart()
        if (!cart) throw new Error('Cart not found.')

        //* Check for item
        const exist = (cart.items as CartItem[]).find(i => i.productId === productId)
        if (!exist) throw new Error('Item not found in cart.')

        //* Check if only one in quantity
        if (exist.qty === 1) {
            //* Remove from cart
            cart.items = (cart.items as CartItem[]).filter(i => i.productId !== exist.productId)
        } else {
            //* Decrease qty
            (cart.items as CartItem[]).find(i => i.productId === productId)!.qty = exist.qty - 1
        }

        //* Update cart in database
        await prisma.cart.update({
            where: { id: cart.id },
            data: {
                items: cart.items as CartItem[],
                ...calcPrice(cart.items as CartItem[])
            }
        })

        //* Revalidate product page
        revalidatePath(`/product/${product.slug}`)
        return {
            success: true, message: `${product.name} was removed from cart.`
        }
    }
    catch (err) {
        return { success: false, message: formatErrors(err) }
    }
}