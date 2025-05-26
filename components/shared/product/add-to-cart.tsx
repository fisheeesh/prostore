"use client"

import { Button } from "@/components/ui/button"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { addItemToCartAction, removeItemFromCartAction } from "@/lib/actions/cart.actions"
import { Cart, CartItem } from "@/types"
import { Loader, Minus, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

export default function AddToCart({ cart, item }: { cart?: Cart, item: CartItem }) {
    const router = useRouter()
    const { toast } = useToast()
    const [isPending, startTransition] = useTransition()

    const handleAddToCart = async () => {
        startTransition(async () => {
            const res = await addItemToCartAction(item)

            if (!res?.success) {
                toast({
                    variant: 'destructive',
                    description: res?.message,
                })
                return
            }

            //* handle success add to cart
            toast({
                description: res?.message,
                action: (
                    <ToastAction className="bg-primary text-white dark:bg-white dark:text-slate-900 dark:hover:bg-gray-200 hover:bg-gray-800" altText="Go to cart" onClick={() => router.push('/cart')} >
                        Go to cart
                    </ToastAction>
                )
            })
        })
    }

    const handleRemoveFromCart = async () => {
        startTransition(async () => {
            const res = await removeItemFromCartAction(item.productId)

            toast({
                variant: res?.success ? 'default' : 'destructive',
                description: res?.message
            })
            return
        })
    }

    const existItem = cart && cart.items.find(i => i.productId === item.productId)

    return existItem ? (
        <div className="flex items-center justify-center gap-2">
            <Button type="button" variant='outline' onClick={handleRemoveFromCart}>
                {isPending ? <Loader className="h-4 w-4 animate-spin" /> : <Minus className="h-4 w-4" />}
            </Button>
            <span className="px-2 font-bold text-lg">{existItem.qty}</span>
            <Button type="button" variant='outline' onClick={handleAddToCart}>
                {isPending ? <Loader className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            </Button>
        </div>
    ) : (
        <Button className="w-full" type="button" onClick={handleAddToCart}>
            {isPending ? <Loader className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}  Add to Cart
        </Button>
    )
}


