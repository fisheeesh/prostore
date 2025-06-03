"use client"

import { useToast } from "@/hooks/use-toast"
import { PRODUCT_DEFAULT_VALUES } from "@/lib/constants"
import { insertProductSchema, updateProductSchema } from "@/lib/validator"
import { Product } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "../ui/form"

export default function ProductForm({ type, product, productId }: { type: 'Create' | 'Update', product?: Product, productId?: string }) {
    const router = useRouter()
    const { toast } = useToast()

    const form = useForm<z.infer<typeof insertProductSchema>>({
        resolver: zodResolver(type === 'Update' ? updateProductSchema : insertProductSchema),
        defaultValues: product && type === 'Update' ? product : PRODUCT_DEFAULT_VALUES,
    })

    return (
        <Form {...form}>
            <form className="space-y-8">
                <div className="flex flex-col gap-5 md:flex-row">
                    {/* name */}
                    {/* slug */}
                </div>
                <div className="flex flex-col gap-5 md:flex-row">
                    {/* category */}
                    {/* brand */}
                </div>
                <div className="flex flex-col gap-5 md:flex-row">
                    {/* price */}
                    {/* stock */}
                </div>
                <div className="upload-field flex flex-col gap-5 md:flex-row">
                    {/* images */}
                </div>
                <div className="upload-field">
                    {/* isFetured */}
                </div>
                <div>
                    {/* description */}
                </div>
                <div>
                    {/* submit */}
                </div>
            </form>
        </Form>
    )
}
