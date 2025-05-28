"use server"

import { isRedirectError } from "next/dist/client/components/redirect-error"
import { formatErrors } from "../utils"
import { auth } from "@/auth"
import { getMyCart } from "./cart.actions"
import { getUserById } from "./user.actions"
import { insertOrderSchema } from "../validator"
import { prisma } from "@/db/prisma"
import { CartItem } from "@/types"

/**
 * *A database transaction refers to a sequence of read/write operations that are guaranteed 
 * * to either succeed or fail as a whole. This section describes the ways in which 
 * * the Prisma Client API supports transactions.
 * $ ta khu wrong a kone wrong
 */

//* Create order and create orderItem
export async function createOrder() {
    try {
        const session = await auth()
        if (!session) throw new Error('User is not authenticated.')

        const cart = await getMyCart()
        const userId = session?.user?.id

        if (!userId) throw new Error('User not found. Please sign in to continue.')

        const currentUser = await getUserById(userId)

        if (!cart || cart.items.length === 0) return { success: false, message: 'Your cart is emppty.', redirectTo: '/cart' }
        if (!currentUser.address) return { success: false, message: 'No Shipping Address.', redirectTo: '/shipping-address' }
        if (!currentUser.paymentMethod) return { success: false, message: 'No Payment Method.', redirectTo: '/payment-method' }

        //* Create order obj
        const order = insertOrderSchema.parse({
            userId: currentUser.id,
            shippingAddress: currentUser.address,
            paymentMethod: currentUser.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice
        })

        //* Create a transaction to create order and order items in db
        const insertedOrderId = await prisma.$transaction(async (tx) => {
            //* Create order
            const insertedOrder = await tx.order.create({ data: order })

            //* Create order items from cart items
            for (const item of cart.items as CartItem[]) {
                tx.orderItem.create({
                    data: {
                        ...item,
                        price: item.price,
                        orderId: insertedOrder.id
                    }
                })
            }

            //* Clear cart
            await tx.cart.update({
                where: { id: cart.id },
                data: {
                    items: [],
                    totalPrice: 0,
                    taxPrice: 0,
                    shippingPrice: 0,
                    itemsPrice: 0
                }
            })

            return insertedOrder.id
        })

        if (!insertedOrderId) throw new Error('Order was not created.')

        return { success: true, message: 'Order created successfully', redirectTo: `/order/${insertedOrderId}` }

    } catch (error) {
        if (isRedirectError(error)) throw error

        return { success: false, message: formatErrors(error) }
    }
}