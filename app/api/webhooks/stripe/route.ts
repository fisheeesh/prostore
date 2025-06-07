import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateOrderToPaid } from '@/lib/actions/order.actions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
    const buf = await req.arrayBuffer();
    const body = Buffer.from(buf);
    const sig = req.headers.get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error('❌ Webhook signature verification failed:', err.message);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // ⚡ If using PaymentElement, consider switching this to "payment_intent.succeeded"
    if (event.type === 'charge.succeeded') {
        const charge = event.data.object as Stripe.Charge;

        try {
            await updateOrderToPaid({
                orderId: charge.metadata.orderId,
                paymentResult: {
                    id: charge.id,
                    status: 'COMPLETED',
                    email_address: charge.billing_details.email || '',
                    pricePaid: (charge.amount / 100).toFixed(),
                },
            });

            return NextResponse.json({ message: 'Order marked as paid' });
        } catch (err: any) {
            console.error('❌ updateOrderToPaid failed:', err.message);
            return new NextResponse('Order update failed', { status: 500 });
        }
    }

    return NextResponse.json({ received: true });
}