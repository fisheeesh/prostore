"use client"

import { Button } from "@/components/ui/button"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { addItemToCartAction } from "@/lib/actions/cart.actions"
import { CartItem } from "@/types"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AddToCart({ item }: { item: CartItem }) {
    const router = useRouter()
    const { toast } = useToast()

    const handleAddToCart = async () => {
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
    }

    return (
        <Button className="w-full" type="button" onClick={handleAddToCart}>
            <Plus />  Add to Cart
        </Button>
    )
}
