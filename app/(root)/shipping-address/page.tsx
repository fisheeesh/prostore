import { auth } from '@/auth'
import { getMyCart } from '@/lib/actions/cart.actions'
import { getUserById } from '@/lib/actions/user.actions'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import React from 'react'
import ShippingAddressForm from './shipping-address-form'
import { ShippingAddress } from '@/types'
import CheckOutSteps from '@/components/shared/checkout-step'

export const metadata: Metadata = {
    title: 'Shipping Address',
    description: 'Enter your shipping address to proceed with the order.'
}

export default async function ShippingAddressPage() {
    const session = await auth()
    const cart = await getMyCart()

    if (!cart || cart.items.length === 0) redirect('/cart')

    const userId = session?.user?.id

    if (!userId) throw new Error('User not found. Please sign in to continue.')

    const user = await getUserById(userId)

    return (
        <>
            <CheckOutSteps current={1} />
            <ShippingAddressForm address={user.address as ShippingAddress} />
        </>
    )
}
