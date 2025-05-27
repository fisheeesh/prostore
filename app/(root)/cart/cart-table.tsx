"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { addItemToCartAction, removeItemFromCartAction } from "@/lib/actions/cart.actions"
import { Cart, CartItem } from "@/types"
import { Loader, Minus, Plus } from "lucide-react"
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
                    Cart is empty. <Link href='/'>Go Shopping</Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-4 md:gap-5">
                    <div className="overflow-x-auto md:col-span-3">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead className="text-center">Quantity</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cart.items.map((item) => (
                                    <TableRow key={item.slug}>
                                        <TableCell>
                                            <Link href={`/product/${item.slug}`} className="flex items-center">
                                                <Image src={item.image} alt={item.name} width={50} height={50} />
                                                <span className="px-2">{item.name}</span>
                                            </Link>
                                        </TableCell>
                                        <TableCell className="flex-center gap-2">
                                            <Button disabled={isPending} variant='outline' type="button" onClick={() => handleRemoveItem(item.productId)}>
                                                {isPending ? <Loader className="h-4 w-4 animate-spin" /> : <Minus className="h-4 w-4" />}
                                            </Button>
                                            <span>{item.qty}</span>
                                            <Button disabled={isPending} type="button" variant='outline' onClick={() => handleAddToCart(item)}>
                                                {isPending ? <Loader className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-right">$ {item.price}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}
        </>
    )
}
