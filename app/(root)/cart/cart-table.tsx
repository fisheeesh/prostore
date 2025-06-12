"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { addItemToCartAction, removeItemFromCartAction } from "@/lib/actions/cart.actions"
import { formatCurrency } from "@/lib/utils"
import { Cart, CartItem } from "@/types"
import { ArrowRight, Loader, Minus, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

export default function CartTable({ cart }: { cart?: Cart }) {
    const router = useRouter()
    const { toast } = useToast()
    const [isPending, startTransition] = useTransition()

    const handleRemoveItem = (productId: string) => {
        startTransition(async () => {
            const res = await removeItemFromCartAction(productId)

            if (!res?.success) {
                toast({
                    variant: 'destructive',
                    description: res?.message,
                })
            }
        })
    }

    const handleAddToCart = (item: CartItem) => {
        startTransition(async () => {
            const res = await addItemToCartAction(item)

            if (!res?.success) {
                toast({
                    variant: 'destructive',
                    description: res?.message,
                })
            }
        })
    }

    return (
        <>
            <h1 className="py-4 h2-bold">Shopping Cart</h1>
            {!cart || cart.items.length === 0 ? (
                <div>
                    Cart is empty. {' '}
                    <Link
                        href="/"
                        className="font-bold text-yellow-500 group transition-all"
                    >
                        Go Shopping <span className="inline-block transform transition-transform duration-200 group-hover:translate-x-2">→</span>
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-4 md:gap-5">
                    <div className="overflow-x-auto md:col-span-3">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50%] min-w-[300px]">Item</TableHead>
                                    <TableHead className="text-center w-[30%] min-w-[180px]">Quantity</TableHead>
                                    <TableHead className="text-right w-[20%] min-w-[100px]">Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cart.items.map((item) => (
                                    <TableRow key={item.slug}>
                                        <TableCell className="py-4">
                                            <Link href={`/product/${item.slug}`} className="flex items-center gap-3">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={50}
                                                    height={50}
                                                    className="rounded-md flex-shrink-0"
                                                />
                                                <span className="font-medium truncate">{item.name}</span>
                                            </Link>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex items-center justify-center gap-3">
                                                <Button
                                                    disabled={isPending}
                                                    variant='outline'
                                                    size="sm"
                                                    type="button"
                                                    onClick={() => handleRemoveItem(item.productId)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    {isPending ? <Loader className="h-4 w-4 animate-spin" /> : <Minus className="h-4 w-4" />}
                                                </Button>
                                                <span className="font-medium text-center min-w-[20px]">{item.qty}</span>
                                                <Button
                                                    disabled={isPending}
                                                    type="button"
                                                    variant='outline'
                                                    size="sm"
                                                    onClick={() => handleAddToCart(item)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    {isPending ? <Loader className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-medium py-4">
                                            ${item.price}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <Card className="h-fit">
                        <CardContent className="p-4 gap-4 flex flex-col">
                            <div className="text-xl ">
                                Subtotal ({cart.items.reduce((acc, item) => acc + item.qty, 0)}):
                                <span className="font-bold">{formatCurrency(cart.itemsPrice)}</span>
                            </div>
                            <Button
                                className="w-full"
                                disabled={isPending}
                                onClick={() => startTransition(() => router.push('/shipping-address'))}
                            >
                                {isPending ? <Loader className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                                Proceed to Checkout
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    )
}