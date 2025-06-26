"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { createOrderAction } from "@/lib/actions/order.actions"
import { Check, Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import React from "react"
import { useFormStatus } from "react-dom"

export default function PlaceOrderForm() {
    const router = useRouter()
    const { toast } = useToast()

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        const res = await createOrderAction()

        if (!res.success) {
            toast({
                variant: 'destructive',
                description: res.message
            })
        }

        if (res.redirectTo) {
            router.push(res.redirectTo)
        }
    }

    const PlaceOrderButton = () => {
        const { pending } = useFormStatus()

        return (
            <Button type="submit" className="w-full" disabled={pending}>
                {pending ? <Loader className="animate-spin w-4 h-4" /> : <Check className="w-4 h-5" />}{' '}
                Place Order
            </Button>
        )
    }

    return (
        <form className="w-full" onSubmit={handleSubmit}>
            <PlaceOrderButton />
        </form>
    )
}
