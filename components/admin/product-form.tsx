"use client"

import { useToast } from "@/hooks/use-toast"
import { PRODUCT_DEFAULT_VALUES } from "@/lib/constants"
import { insertProductSchema, updateProductSchema } from "@/lib/validator"
import { Product } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { ControllerRenderProps, useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import slugify from "slugify"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Loader } from "lucide-react"

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
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'name'> }) => (
                            <FormItem className="w-full">
                                <FormLabel>Name <span className="text-red-600">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter product name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* slug */}
                    <FormField
                        control={form.control}
                        name='slug'
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'slug'> }) => (
                            <FormItem className="w-full">
                                <FormLabel>Slug <span className="text-red-600">*</span></FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input placeholder="Enter slug" {...field} />
                                        <Button type="button" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 mt-2" onClick={() => {
                                            form.setValue('slug', slugify(form.getValues('name'), { lower: true }))
                                        }}>Generate</Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex flex-col gap-5 md:flex-row">
                    {/* category */}
                    <FormField
                        control={form.control}
                        name='category'
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'category'> }) => (
                            <FormItem className="w-full">
                                <FormLabel>Category <span className="text-red-600">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter category" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* brand */}
                    <FormField
                        control={form.control}
                        name='brand'
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'brand'> }) => (
                            <FormItem className="w-full">
                                <FormLabel>Brand <span className="text-red-600">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter brand" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex flex-col gap-5 md:flex-row">
                    {/* price */}
                    <FormField
                        control={form.control}
                        name='price'
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'price'> }) => (
                            <FormItem className="w-full">
                                <FormLabel>Price <span className="text-red-600">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter product price" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* stock */}
                    <FormField
                        control={form.control}
                        name='stock'
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'stock'> }) => (
                            <FormItem className="w-full">
                                <FormLabel>Stock <span className="text-red-600">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter stock" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="upload-field flex flex-col gap-5 md:flex-row">
                    {/* images */}
                </div>
                <div className="upload-field">
                    {/* isFetured */}
                </div>
                <div>
                    {/* description */}
                    <FormField
                        control={form.control}
                        name='description'
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'description'> }) => (
                            <FormItem className="w-full">
                                <FormLabel>Description <span className="text-red-600">*</span></FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Enter product description" {...field} className="resize-none" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div>
                    <Button type="submit" size='lg' disabled={form.formState.isSubmitting} className="button col-span-2 w-full">
                        {form.formState.isSubmitting ?
                            <>
                                <Loader className="mr-2 h-4 w-4 animate-spin" />{' '} Submitting...
                            </> : `${type} Product`}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
