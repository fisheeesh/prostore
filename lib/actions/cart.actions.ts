"use server"

import { auth } from "@/auth"
import { prisma } from "@/db/prisma"
import { CartItem } from "@/types"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { calcPrice, convertToPlainObject, formatErrors } from "../utils"
import { cartItemSchema, insertCartSchema } from "../validator"

/**
 * * Cart htl add moh so cart loh ml add mae product lo ml
 * * Cart ko u ml so sessionCartId or userId ko use p u ml
 * * Prodcut ko ka add like tae item nae u ml ma u khin item and valid phyit ma phyit test ml
 * * Cart ma shi yin cart create py ml validate lope p p yin db htl insert ml revalidate path ml return ml
 * * Cart htl mr shi p thr so existing item lr check ml
 * * Exist item so stock check ok yin qty increase ml
 * * Exist ma hote yin item ko add ml cart htl
 */
export async function addItemToCartAction(data: CartItem) {
    try {
        const sessionCartId = (await cookies()).get('sessionCartId')?.value
        if (!sessionCartId) throw new Error('Cart session not found.')

        const session = await auth()
        const userId = session?.user?.id ? (session.user.id as string) : undefined

        const cart = await getMyCart()

        const item = cartItemSchema.parse(data)

        const product = await prisma.product.findFirst({ where: { id: item.productId } })

        if (!product) throw new Error('Product not found.')

        if (!cart) {
            const newCart = insertCartSchema.parse({
                userId: userId,
                sessionCartId: sessionCartId,
                items: [item],
                ...calcPrice([item])
            })

            await prisma.cart.create({
                data: newCart
            })

            revalidatePath(`/product/${product.slug}`)

            return { success: true, message: `${product.name} added to cart.` }
        }
        else {
            const existItem = cart.items.find(i => i.productId === item.productId)

            if (existItem) {
                if (product.stock < existItem.qty + 1) {
                    throw new Error('Product out of stock.')
                }

                (cart.items as CartItem[]).find(i => i.productId === item.productId)!.qty = existItem.qty + 1
            } else {
                if (product.stock < 1) throw new Error('Product out of stock.')

                cart.items.push(item)
            }

            await prisma.cart.update({
                where: { id: cart.id },
                data: {
                    items: cart.items as CartItem[],
                    ...calcPrice(cart.items as CartItem[])
                }
            })

            revalidatePath(`/product/${product.slug}`)

            return { success: true, message: `${product.name} ${existItem ? 'was updated in' : "added to"} cart.` }
        }
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

/**
 * * Remove from cart moh so yin cart and remove mae product ko lo ml
 * * Cart ko u ml so sessionCartId or user Id ko use ml
 * * Product ko productId nae u ml
 * * Ae product ka cart html me shi ma shi check ml
 * * Shi yin remove ml a yin sone stock ko check 1 khn htl so remove ma hote yin qty decrease
 */
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