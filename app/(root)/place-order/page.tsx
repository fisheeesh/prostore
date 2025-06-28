import { auth } from "@/auth"
import CheckOutSteps from "@/components/shared/checkout-step"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getMyCart } from "@/lib/actions/cart.actions"
import { getUserById } from "@/lib/actions/user.actions"
import { formatCurrency } from "@/lib/utils"
import { ShippingAddress } from "@/types"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import PlaceOrderForm from "./place-order-form"

export const metadata: Metadata = {
    title: 'Place Order'
}

export default async function PlaceOrderPage() {
    const cart = await getMyCart()
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) throw new Error('User not found. Please sign in to continue.')

    const currentUser = await getUserById(userId)

    if (!cart || cart.items.length === 0) redirect('/cart')
    if (!currentUser.address) redirect('/shipping-address')
    if (!currentUser.paymentMethod) redirect('/payment-method')

    const userAddress = currentUser.address as ShippingAddress

    return (
        <>
            <CheckOutSteps current={3} />
            <h1 className="py-4 h2-bold mt-4">Place Order</h1>
            <div className="grid md:grid-cols-3 gap-5">
                <div className="md:col-span-2 overflow-x-auto space-y-4">
                    <Card>
                        <CardContent className="p-4 gap-4">
                            <h2 className="text-xl pb-4 font-bold">Shipping Address</h2>
                            <p><span className="font-medium">Name: </span>{userAddress.fullName}</p>
                            <p><span className="font-medium">Phone Number: </span>{userAddress.phone}</p>
                            <p>
                                <span className="font-medium">Address: </span>{userAddress.streetAddress}, {userAddress.city} {' '}
                                {userAddress.postalCode}, {userAddress.country} {' '}
                            </p>
                            <div className="mt-3">
                                <Link href={'/shipping-address'}>
                                    <Button variant='outline'>Edit</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 gap-4">
                            <h2 className="text-xl pb-4 font-bold">Payment Method</h2>
                            <p>{currentUser.paymentMethod}</p>
                            <div className="mt-3">
                                <Link href={'/payment-method'}>
                                    <Button variant='outline'>Edit</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 gap-4">
                            <h2 className="text-xl pb-4 font-bold">Order Items</h2>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[60%]">Item</TableHead>
                                        <TableHead className="w-[20%] text-center">Quantity</TableHead>
                                        <TableHead className="w-[20%] text-right">Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        cart.items.map(item => (
                                            <TableRow key={item.slug}>
                                                <TableCell className="pr-6">
                                                    <Link className="flex items-center" href={`/product/${item.slug}`}>
                                                        <Image src={item.image} alt={item.name} width={50} height={50} />
                                                        <span className="ml-3 whitespace-nowrap">{item.name}</span>
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <span>{item.qty}</span>
                                                </TableCell>
                                                <TableCell className="text-right whitespace-nowrap">
                                                    <span>${item.price}</span>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardContent className="p-4 gap-4 space-y-4">
                            <div className="flex justify-between">
                                <div>Items</div>
                                <div className="">{formatCurrency(cart.itemsPrice)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Tax</div>
                                <div className="">{formatCurrency(cart.taxPrice)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Shipping</div>
                                <div className="">{formatCurrency(cart.shippingPrice)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Total</div>
                                <div className="font-bold">{formatCurrency(cart.totalPrice)}</div>
                            </div>
                            <PlaceOrderForm />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}