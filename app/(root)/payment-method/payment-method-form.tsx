"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { updateUserPaymentAction } from "@/lib/actions/user.actions"
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants"
import { paymentMethodSchema } from "@/lib/validator"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

export default function PaymentMethodForm({ preferredPaymentMethod }: { preferredPaymentMethod: string | null }) {
    const router = useRouter()
    const [isPending, startTrasition] = useTransition()
    const { toast } = useToast()

    const form = useForm<z.infer<typeof paymentMethodSchema>>({
        resolver: zodResolver(paymentMethodSchema),
        defaultValues: { type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD }
    })

    const onSubmit: SubmitHandler<z.infer<typeof paymentMethodSchema>> = async (values) => {
        startTrasition(async () => {
            const res = await updateUserPaymentAction(values)

            if (!res?.success) {
                toast({
                    variant: 'destructive',
                    description: res?.message
                })

                return
            }

            router.push('/place-order')
        })
    }

    return (
        <>
            <div className="max-w-md mx-auto space-y-4">
                <h1 className="h2-bold mt-4">Payment Method</h1>
                <p className="text-sm text-muted-foreground">Please select the payment method.</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} method="POST" className="space-y-4 ">
                        <div className="flex flex-col gap-5 md:flex-row">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }: { field: ControllerRenderProps<z.infer<typeof paymentMethodSchema>, 'type'> }) => (
                                    <FormItem className="space-y-3">
                                        <FormControl>
                                            <RadioGroup className="flex flex-col space-y-2" onValueChange={field.onChange}>
                                                {PAYMENT_METHODS.map(method => (
                                                    <FormItem key={method} className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value={method} checked={field.value == method} />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">{method}</FormLabel>
                                                    </FormItem>
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}

                            />
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" disabled={isPending}>
                                {isPending ? <Loader className="animate-spin w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    )
}
