"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { updateUserAddressAction } from "@/lib/actions/user.actions"
import { SHIPPING_ADDRESS_DEFAULT_VALUES } from "@/lib/constants"
import { shippingAddressSchema } from "@/lib/validator"
import { ShippingAddress } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

export default function ShippingAddressForm({ address }: { address: ShippingAddress }) {
    const router = useRouter()
    const { toast } = useToast()
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof shippingAddressSchema>>({
        defaultValues: {
            ...SHIPPING_ADDRESS_DEFAULT_VALUES,
            ...address,
        },
        resolver: zodResolver(shippingAddressSchema)
    })

    const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = (values) => {
        startTransition(async () => {
            const res = await updateUserAddressAction(values)

            if (!res?.success) {
                toast({
                    variant: 'destructive',
                    description: res?.message
                })

                return
            }

            router.push('/payment-method')
        })
    }

    return (
        <>
            <div className="max-w-md mx-auto space-y-4">
                <h1 className="h2-bold mt-4">Shipping Address</h1>
                <p className="text-sm text-muted-foreground">Please enter address to ship to.</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} method="POST" className="space-y-4 ">
                        <div className="flex flex-col gap-5 md:flex-row">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }: { field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'fullName'> }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Full Name <span className="text-red-600">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter FullName" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-col gap-5 md:flex-row">
                            <FormField
                                control={form.control}
                                name="streetAddress"
                                render={({ field }: { field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'streetAddress'> }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Address <span className="text-red-600">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Address" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-col gap-5 md:flex-row">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }: { field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'city'> }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>City <span className="text-red-600">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter City" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-col gap-5 md:flex-row">
                            <FormField
                                control={form.control}
                                name="postalCode"
                                render={({ field }: { field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'postalCode'> }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>PostalCode <span className="text-red-600">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter PostalCode" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-col gap-5 md:flex-row">
                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }: { field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'country'> }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Country <span className="text-red-600">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Country" {...field} />
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
