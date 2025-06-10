import { Button } from "@/components/ui/button";
import { getOrderByIdAction } from "@/lib/actions/order.actions";
import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export const metadata: Metadata = {
    title: 'Payment Success'
}

export default async function SuccessPage(props: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ payment_intent: string }>
}) {
    const { id } = await props.params
    const { payment_intent: paymentIntentId } = await props.searchParams

    //* Fetch order
    const order = await getOrderByIdAction(id)
    if (!order) notFound()

    //* Retrieve the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    //* Check if paymentIntent is valid
    if (paymentIntent.metadata.orderId == null || paymentIntent.metadata.orderId !== order.id.toString()) {
        return notFound()
    }

    //* Check if payment is successful
    const isSuccess = paymentIntent.status === 'succeeded'

    if (!isSuccess) {
        return redirect(`/order/${id}`)
    }


    return (
        <div className="max-w-4xl w-full mx-auto space-y-8 py-28">
            <div className="flex flex-col gap-4 items-center justify-center">
                <h1 className="h1-bold text-center">Thanks for your purchase. 🙌</h1>
                <div>We are processing your order.</div>
                <Button asChild>
                    <Link href={`/order/${id}`}>View Order</Link>
                </Button>
            </div>
        </div>
    )
}
