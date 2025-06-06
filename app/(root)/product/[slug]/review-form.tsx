"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { createUpdateReviewAction } from "@/lib/actions/review.actions"
import { REVIEW_FORM_DEFAULT_VALUES } from "@/lib/constants"
import { insertReviewSchema } from "@/lib/validator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader, StarIcon } from "lucide-react"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

export default function ReviewForm({ userId, productId, onReviewSubmitted }:
    { userId: string, productId: string, onReviewSubmitted: () => void }
) {
    const [open, setOpen] = useState(false)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof insertReviewSchema>>({
        defaultValues: REVIEW_FORM_DEFAULT_VALUES,
        resolver: zodResolver(insertReviewSchema)
    })

    //* Open form handler
    const handleOpenForm = () => {
        /**
         * * Without this, the action will not be validated with insertReviewSchema
         * * We are not submitting productId and userId which is part of insertReviewSchema
         */
        // form.setValue('userId', userId)
        // form.setValue('productId', productId)

        setOpen(true)
    }

    //* Submit form handler
    const onSubmit: SubmitHandler<z.infer<typeof insertReviewSchema>> = async (values) => {
        const res = await createUpdateReviewAction({
            ...values,
            productId
        })

        if (!res.success) {
            return toast({
                variant: 'destructive',
                description: res.message,
            })
        }

        setOpen(false)

        onReviewSubmitted()

        toast({
            description: res.message
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button onClick={handleOpenForm} variant='default'>
                Write a review
            </Button>
            <DialogContent className="sm:max-w-[425px]">
                <Form {...form}>
                    <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>Write a review</DialogTitle>
                            <DialogDescription>Share your thoughts with other customers.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title <span className="text-red-600">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Title" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description <span className="text-red-600">*</span></FormLabel>
                                        <FormControl>
                                            <Textarea className="resize-none" placeholder="Enter Description" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="rating"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rating <span className="text-red-600">*</span></FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value.toString()}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a rating" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    Array.from({ length: 5 }).map((_, index) => (
                                                        <SelectItem key={index} value={(index + 1).toString()}>
                                                            {Array.from({ length: index + 1 }).map((_, i) => (
                                                                <StarIcon key={i} className="inline w-4 h-4 mr-1" />
                                                            ))}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting} size='lg'>
                                {
                                    form.formState.isSubmitting ? (
                                        <>
                                            <Loader className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                                        </>
                                    ) : 'Submit'
                                }
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
