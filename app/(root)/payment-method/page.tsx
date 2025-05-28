import { auth } from "@/auth"
import { getUserById } from "@/lib/actions/user.actions"
import { Metadata } from "next"
import PaymentMethodForm from "./payment-method-form"
import CheckOutSteps from "@/components/shared/checkout-step"

export const metadata: Metadata = {
    title: 'PayMent Method'
}

export default async function PaymentMethodPage() {
    const session = await auth()

    const userId = session?.user?.id

    if (!userId) throw new Error('User not found. Please sign in to continue.')

    const currentUser = await getUserById(userId)

    return (
        <>
            <CheckOutSteps current={2} />
            <PaymentMethodForm preferredPaymentMethod={currentUser.paymentMethod} />
        </>
    )
}
