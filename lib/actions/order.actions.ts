"use server"

import { auth } from "@/auth"
import { prisma } from "@/db/prisma"
import { sendDeliveredNotification, sendPurchaseReceipt } from "@/email"
import { CartItem, PaymentResult, ShippingAddress } from "@/types"
import { Decimal } from "@prisma/client/runtime/library"
import { revalidatePath } from "next/cache"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { PAGE_SIZE } from "../constants"
import { paypal } from "../paypal"
import { convertToPlainObject, formatErrors } from "../utils"
import { insertOrderSchema } from "../validator"
import { getMyCart } from "./cart.actions"
import { getUserById } from "./user.actions"

/**
 * *A database transaction refers to a sequence of read/write operations that are guaranteed 
 * * to either succeed or fail as a whole. This section describes the ways in which 
 * * the Prisma Client API supports transactions.
 * $ ta khu wrong a kone wrong
 */

//* Create order and create orderItem
export async function createOrderAction() {
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
                await tx.orderItem.create({
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

//* Get order by id
export async function getOrderByIdAction(orderId: string) {
    const data = await prisma.order.findFirst({
        where: { id: orderId },
        include: {
            orderitems: true,
            user: { select: { name: true, email: true } }
        }
    })

    return convertToPlainObject(data)
}

//* Create new paypal order
export async function createPayPalOrderAction(orderId: string) {
    try {
        //* Get order from db
        const order = await prisma.order.findFirst({
            where: { id: orderId }
        })

        if (order) {
            //* Create paypal order
            const paypalOrder = await paypal.createOrder(Number(order.totalPrice))

            //* Update order with paypal orderId
            await prisma.order.update({
                where: { id: orderId },
                data: {
                    paymentResult: {
                        id: paypalOrder.id,
                        email_address: '',
                        status: '',
                        pricePaid: 0
                    }
                }
            })

            return { success: true, message: 'Item order created successfully', data: paypalOrder.id }
        }
        else {
            throw new Error('Order not found.')
        }
    } catch (error) {
        return { success: false, message: formatErrors(error) }
    }
}

//* Approve paypal order & update order to pay
export async function approvePayPalOrderAction(orderId: string, data: { orderID: string }) {
    try {
        const order = await prisma.order.findFirst({
            where: { id: orderId }
        })

        if (!order) throw new Error('Order not found.')

        const captureData = await paypal.capturePayment(data.orderID)

        if (!captureData || captureData.id !== (order.paymentResult as PaymentResult)?.id || captureData.status !== 'COMPLETED') {
            throw new Error('Error in Paypal payment.')
        }

        //* Update order to paid
        await updateOrderToPaid({
            orderId, paymentResult: {
                id: captureData.id,
                status: captureData.status,
                email_address: captureData.payer.email_address,
                pricePaid: captureData.purchase_units[0].payments?.captures[0].amount.value
            }
        })

        revalidatePath(`/order/${orderId}`)

        return { success: true, message: 'Your order has been paid.' }

    } catch (error) {
        return { success: false, message: formatErrors(error) }
    }
}

export async function updateOrderToPaid({
    orderId,
    paymentResult
}: { orderId: string, paymentResult?: PaymentResult }) {
    const order = await prisma.order.findFirst({
        where: { id: orderId },
        include: { orderitems: true }
    })

    if (!order) throw new Error('Order not found.')

    if (order.isPaid) throw new Error('Order is already paid.')

    //* Transaction to update order and account for product stock
    await prisma.$transaction(async (tx) => {
        //* Iterate over products & update the stock
        for (const item of order.orderitems) {
            await tx.product.update({
                where: { id: item.productId },
                data: {
                    stock: { increment: -item.qty },
                    sold: { increment: +item.qty }
                }
            })
        }

        //* Set the order to paid
        await tx.order.update({
            where: { id: orderId },
            data: {
                isPaid: true,
                paidAt: new Date(),
                paymentResult
            }
        })
    })

    //* Get updated order after transaction
    const updatedOrder = await prisma.order.findFirst({
        where: { id: orderId },
        include: {
            orderitems: true,
            user: { select: { name: true, email: true } }
        },
    })

    if (!updatedOrder) throw new Error('Order not found.')

    //* Send user to order confirmation email after order is purchased
    await sendPurchaseReceipt({
        order: {
            ...updatedOrder,
            shippingAddress: updatedOrder.shippingAddress as ShippingAddress,
            paymentResult: updatedOrder.paymentResult as PaymentResult
        }
    })
}

export async function getOrdersById() {
    const session = await auth()
    if (!session) throw new Error('User not found. Please sign in to continue.')

    const data = await prisma.order.findMany({
        where: {
            userId: session.user?.id,
            isPaid: true
        },
        include: { orderitems: true }
    })

    return data
}

//* Get user orders
export async function getMyOrders({ limit = PAGE_SIZE, page }: { limit?: number, page: number }) {
    const session = await auth()
    if (!session) throw new Error('User not found. Please sign in to continue.')

    const data = await prisma.order.findMany({
        where: { userId: session.user?.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
    })

    const dataCount = await prisma.order.count({
        where: { userId: session.user?.id }
    })

    return { data, totalPages: Math.ceil(dataCount / limit) }
}

type SalesDataType = {
    month: string,
    totalSales: number
}[]

type BestSeller = {
    month: string
    productName: string
    totalSold: bigint
}


//* Get sales data & order summary
export async function getOrderSummary() {
    //* Get counts for each resource (products, orders, users)
    const ordersCount = await prisma.order.count()
    const productsCount = await prisma.product.count()
    const usersCount = await prisma.user.count()

    //* paymentCounts
    const payPalCount = await prisma.order.count({
        where: { paymentMethod: 'PayPal' }
    })
    const stripeCount = await prisma.order.count({
        where: { paymentMethod: 'Stripe' }
    })
    const codCount = await prisma.order.count({
        where: { paymentMethod: 'CashOnDelivery' }
    })

    //* Calculate total sales
    const totalSales = await prisma.order.aggregate({
        _sum: { totalPrice: true }
    })

    //* Get monthly sales with proper ordering
    //* When this get return from db, the totalSales will be the format of Prisma's Decimal and we don't want that
    const salesDataRaw = await prisma.$queryRaw<Array<{
        month: string,
        totalSales: Decimal,
        year: number,
        monthNumber: number
    }>>`
        SELECT 
            to_char("createdAt", 'MM/YY') as "month", 
            sum("totalPrice") as "totalSales",
            EXTRACT(YEAR FROM "createdAt") as "year",
            EXTRACT(MONTH FROM "createdAt") as "monthNumber"
        FROM "Order" 
        GROUP BY 
            to_char("createdAt", 'MM/YY'),
            EXTRACT(YEAR FROM "createdAt"),
            EXTRACT(MONTH FROM "createdAt")
        ORDER BY 
            EXTRACT(YEAR FROM "createdAt") ASC,
            EXTRACT(MONTH FROM "createdAt") ASC
    `

    //* Get that sales data(raw), put it in variable and map through it and convert Decimal to number
    const salesData: SalesDataType = salesDataRaw.map(entry => ({
        month: entry.month,
        totalSales: Number(entry.totalSales)
    }))

    //* Get latest orders
    const latestSales = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } },
        take: 6
    })

    const users = await prisma.user.findMany({
        include: {
            _count: {
                select: {
                    Order: true,
                },
            },
            Order: {
                select: {
                    totalPrice: true,
                },
            },
        },
        take: 6
    });

    const result = users.map(user => {
        const totalSpent = user.Order.reduce((sum, order) => sum + Number(order.totalPrice), 0);

        return {
            ...user,
            totalOrders: user._count.Order,
            totalSpent,
        };
    }).sort((a, b) => b.totalOrders - a.totalOrders);

    const bestSellers = await prisma.$queryRawUnsafe<BestSeller[]>(`
    SELECT DISTINCT ON (month) 
        to_char(o."createdAt", 'MM/YY') AS month,
        oi.name AS "productName",
        SUM(oi.qty) AS "totalSold"
    FROM "OrderItem" oi
    JOIN "Order" o ON o.id = oi."orderId"
    GROUP BY month, oi.name
    ORDER BY month, "totalSold" DESC
`)

    return {
        ordersCount,
        productsCount,
        usersCount,
        totalSales,
        latestSales,
        salesData,
        payments: [
            { method: 'PayPal', count: payPalCount, color: '#009CDE' },
            { method: 'Stripe', count: stripeCount, color: '#635BFF' },
            { method: 'CashOnDelivery', count: codCount, color: '#00C48C' },
        ],
        loyalCustomers: result,
        bestSellers
    }
}

//* Get all orders
export async function getAllOrders({ limit = PAGE_SIZE, page, query }: { limit?: number, page: number, query: string }) {
    const queryFilter = query && query !== 'all' ? {
        user: {
            name: { contains: query, mode: 'insensitive' as const }
        }
    } : {}

    const data = await prisma.order.findMany({
        where: { ...queryFilter },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
        include: { user: { select: { name: true } } }
    })

    const dataCount = await prisma.order.count({
        where: { ...queryFilter }
    })

    return { data, totalPages: Math.ceil(dataCount / limit) }
}

//* Delete an order
export async function deleteOrder(id: string) {
    try {
        await prisma.order.delete({
            where: { id }
        })

        revalidatePath('/admin/orders')

        return { success: true, message: 'Order deleted successfully.' }
    } catch (error) {
        return { success: false, message: formatErrors(error) }
    }
}

//* Update COD order to paid
export async function updateOrderToPaidCOD(orderId: string) {
    try {
        await updateOrderToPaid({ orderId })

        revalidatePath(`/order/${orderId}`)

        return { success: true, message: 'Order marked as paid.' }
    } catch (error) {
        return { success: false, message: formatErrors(error) }
    }
}

//* Update COD order to delivered
export async function deliverOrder(orderId: string) {
    try {
        const order = await prisma.order.findFirst({
            where: { id: orderId }
        })

        if (!order) throw new Error('Order not found.')

        if (!order.isPaid) throw new Error('Order is not paid.')

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                isDelivered: true,
                deliveredAt: new Date()
            },
            include: {
                orderitems: true,
                user: { select: { name: true, email: true } }
            },
        })

        if (!updatedOrder) throw new Error('Order not found.')

        //* Send user to order confirmation email after order is purchased
        await sendDeliveredNotification({
            order: {
                ...updatedOrder,
                shippingAddress: updatedOrder.shippingAddress as ShippingAddress,
                paymentResult: updatedOrder.paymentResult as PaymentResult,
            }
        })

        revalidatePath(`/order/${orderId}`)

        return { success: true, message: 'Order has been marked delivered.' }

    } catch (error) {
        return { success: false, message: formatErrors(error) }
    }
}