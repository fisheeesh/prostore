"use client"

import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils"
import { Order } from "@/types"
import Image from "next/image"
import Link from "next/link"
import { approvePayPalOrderAction, createPayPalOrderAction } from "@/lib/actions/order.actions";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";

export default function OrderDetailsTable({ order, paypalClientId }: { order: Order, paypalClientId: string }) {
    const {
        id,
        shippingAddress,
        orderitems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        paymentMethod,
        isPaid,
        isDelivered,
        paidAt,
        deliveredAt
    } = order

    const { toast } = useToast()

    const PrintLoadingState = () => {
        const [{ isPending, isRejected }] = usePayPalScriptReducer()

        if (isPending) return <p className="text-center justify-center flex items-center gap-2 my-4"><Loader className="w-4 h-4 animate-spin" /> Loading PayPal...</p>
        if (isRejected) return <p className="text-center justify-center flex items-center gap-2 my-4"><Loader className="w-4 h-4 animate-spin" />Error loading PayPal.</p>
        return null
    }

    const handleCreatePaypalOrder = async () => {
        const res = await createPayPalOrderAction(order.id)

        if (!res?.success) {
            toast({
                variant: 'destructive',
                description: res?.message
            })
        }

        return res.data
    }

    const handleApprovePaypalOrder = async (data: { orderID: string }) => {
        const res = await approvePayPalOrderAction(order.id, data)

        toast({
            variant: res.success ? 'success' : 'destructive',
            description: res.message
        })
    }

    return (
        <>
            <h1 className="py-4 h2-bold text-2xl">Order {formatId(id)}</h1>
            <div className="grid md:grid-cols-3 md:gap-3">
                <div className="col-span-2 space-y-4 overflow-x-auto">
                    <Card>
                        <CardContent className="p-4 gap-4">
                            <h2 className="text-xl pb-4 font-bold">Payment Method</h2>
                            <p className="mb-2">{paymentMethod}</p>
                            {isPaid ? (
                                <Badge className="bg-green-600 hover:bg-green-500">Paid at {formatDateTime(paidAt!).dateTime}</Badge>
                            ) : (
                                <Badge variant='destructive'>Not Paid</Badge>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 gap-4">
                            <h2 className="text-xl pb-4 font-bold">Shipping Address</h2>
                            <p>{shippingAddress.fullName}</p>
                            <p>{shippingAddress.streetAddress}, {shippingAddress.city}</p>
                            <p className="mb-2">{shippingAddress.postalCode}, {shippingAddress.country}</p>
                            {isDelivered ? (
                                <Badge variant='secondary'>Delivered at {formatDateTime(deliveredAt!).dateTime}</Badge>
                            ) : (
                                <Badge variant='destructive'>Not Delivered</Badge>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 gap-4">
                            <h2 className="text-xl pb-4 font-bold">Order Items</h2>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        orderitems.map(item => (
                                            <TableRow key={item.slug}>
                                                <TableCell>
                                                    <Link className="flex items-center" href={`/product/${item.slug}`}>
                                                        <Image src={item.image} alt={item.name} width={50} height={50} />
                                                        <span className="px-2">{item.name}</span>
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="px-2">{item.qty}</span>
                                                </TableCell>
                                                <TableCell className="text-right">
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
                                <div className="">{formatCurrency(itemsPrice)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Tax</div>
                                <div className="">{formatCurrency(taxPrice)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Shipping</div>
                                <div className="">{formatCurrency(shippingPrice)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Total</div>
                                <div className="font-bold">{formatCurrency(totalPrice)}</div>
                            </div>
                            {/* Paypal payment */}
                            {(!isPaid && paymentMethod === 'PayPal') && (
                                <div>
                                    <PayPalScriptProvider options={{ clientId: paypalClientId, currency: "USD" }}>
                                        <PrintLoadingState />
                                        <PayPalButtons
                                            createOrder={handleCreatePaypalOrder}
                                            onApprove={async (data, actions) => {
                                                await handleApprovePaypalOrder({ orderID: data.orderID })
                                            }}
                                        />
                                    </PayPalScriptProvider>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}
