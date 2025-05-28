"use client"

import { useToast } from "@/hooks/use-toast"
import { DEFAULT_PAYMENT_METHOD } from "@/lib/constants"
import { paymentMethodSchema } from "@/lib/validator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export default function PaymentMethodForm({ preferredPaymentMethod }: { preferredPaymentMethod: string | null }) {
    const router = useRouter()
    const [isPending, startTrasition] = useTransition()
    const { toast } = useToast()

    const form = useForm<z.infer<typeof paymentMethodSchema>>({
        resolver: zodResolver(paymentMethodSchema),
        defaultValues: { type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD }
    })

    return (
        <>
            
        </>
    )
}
