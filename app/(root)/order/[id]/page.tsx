import { getOrderByIdAction } from "@/lib/actions/order.actions"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import OrderDetailsTable from "./order-details-table"
import { ShippingAddress } from "@/types"
import { auth } from "@/auth"
import Stripe from 'stripe'

export const metadata: Metadata = {
    title: 'Order Details'
}

export default async function OrderDetailsPage(props: { params: Promise<{ id: string }> }) {
    const session = await auth()
    const { id } = await props.params

    const order = await getOrderByIdAction(id)

    if (!order) notFound()

    let client_secret = null

    //* Check if it is not paid and using Stripe
    if (order.paymentMethod === 'Stripe' && !order.isPaid) {
        //* init stripe instance
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

        //* Create a payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(Number(order.totalPrice) * 100),
            currency: 'USD',
            metadata: { orderId: order.id }
        })

        client_secret = paymentIntent.client_secret
    }

    return (
        <>
            <OrderDetailsTable order={{
                ...order,
                shippingAddress: order.shippingAddress as ShippingAddress
            }}
                stripeClientSecret={client_secret}
                paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
                isAdmin={session?.user?.role === 'admin' || false}
            />
        </>
    )
}
