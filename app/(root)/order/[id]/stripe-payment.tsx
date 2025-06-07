import { loadStripe } from '@stripe/stripe-js';
import { Elements, LinkAuthenticationElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useTheme } from 'next-themes';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { SERVER_URL } from '@/lib/constants';

export default function StripePayment({ priceInCents, orderId, clientSecret }: { priceInCents: number, orderId: string, clientSecret: string }) {
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

    const { theme, systemTheme } = useTheme()

    //* Stripe form component
    const StripeForm = () => {
        const stripe = useStripe()
        const elements = useElements()

        const [isLoading, setIsLoading] = useState(false)
        const [errMsg, setErrMsg] = useState('')
        const [email, setEmail] = useState('')

        const handleSubmit = async (e: FormEvent) => {
            e.preventDefault()

            if (stripe == null || elements == null || email == null) return

            setIsLoading(true)

            stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${SERVER_URL}/order/${orderId}/stripe-payment-success`
                }
            }).then(({ error }) => {
                if (error?.type === 'card_error' || error?.type === 'validation_error') {
                    setErrMsg(error.message || "Unknown Error Occurred.")
                }
                else if (error) {
                    setErrMsg(error.message || "Unknown Error Occurred.")
                }
            }).finally(() => setIsLoading(false))
        }

        return (
            <form className='space-y-4' onSubmit={handleSubmit}>
                <div className="text-xl font-bold">Stripe Checkout</div>
                {
                    errMsg && <div className='text-destructive'>{errMsg}</div>
                }
                <PaymentElement />
                <div>
                    <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
                </div>
                <Button className='w-full' size='lg' disabled={stripe == null || elements == null || isLoading}>
                    {
                        isLoading ?
                            <>
                                <Loader className="w-4 h-4 animate-spin" /> Purchasing...
                            </> :
                            <>
                                Purchase {formatCurrency(priceInCents / 100)}
                            </>
                    }
                </Button>
            </form>
        )
    }

    return (
        <Elements options={{
            clientSecret,
            appearance: {
                theme: theme === 'dark' ? 'night' : theme === 'light' ? 'stripe' : systemTheme === 'light' ? 'stripe' : 'night'
            }
        }}
            stripe={stripePromise}
        >
            <StripeForm />
        </Elements>
    )
}
