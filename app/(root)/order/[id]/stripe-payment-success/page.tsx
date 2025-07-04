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
            <div className="flex flex-col gap-6 items-center justify-center">
                <h1 className="h1-bold text-center">Thanks for your purchase. 🙌</h1>
                <div className="text-sm text-muted-foreground max-w-xs md:max-w-lg mx-auto text-center">
                    <span className="font-medium text-base text-black dark:text-white">We are processing your order.</span> <br />
                    We’ve emailed your receipt. Check spam if it’s not in your inbox.
                </div>
                <Button asChild>
                    <Link href={`/order/${id}`}>View Order</Link>
                </Button>
            </div>
        </div>
    )
}
