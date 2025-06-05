"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { updateUserAction } from "@/lib/actions/user.actions"
import { USER_ROLES } from "@/lib/constants"
import { updateUserSchema } from "@/lib/validator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

export default function UpdateUserForm({ user }: { user: z.infer<typeof updateUserSchema> }) {
    const router = useRouter()
    const { toast } = useToast()

    const form = useForm<z.infer<typeof updateUserSchema>>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: user
    })

    const onSubmit: SubmitHandler<z.infer<typeof updateUserSchema>> = async (values) => {
        try {
            const res = await updateUserAction({
                ...values,
                id: user.id
            })

            if (!res?.success) {
                return toast({
                    variant: 'destructive',
                    description: res?.message
                })
            }

            toast({
                description: res?.message
            })

            form.reset()
            router.push('/admin/users')
        } catch (error) {
            toast({
                variant: 'destructive',
                description: (error as Error).message
            })
        }
    }

    return (
        <Form {...form}>
            <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
                {/* email */}
                <div>
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof updateUserSchema>, 'email'> }) => (
                            <FormItem className="w-full">
                                <FormLabel>Email <span className="text-red-600">*</span></FormLabel>
                                <FormControl>
                                    <Input disabled={true} placeholder="Enter user email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* name */}
                <div>
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof updateUserSchema>, 'name'> }) => (
                            <FormItem className="w-full">
                                <FormLabel>Name <span className="text-red-600">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter user name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* role */}
                <div>
                    <FormField
                        control={form.control}
                        name='role'
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof updateUserSchema>, 'role'> }) => (
                            <FormItem className="w-full">
                                <FormLabel>Role <span className="text-red-600">*</span></FormLabel>
                                <Select onValueChange={field.onChange} value={field.value.toString()}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select user role" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {USER_ROLES.map((role) => (
                                            <SelectItem key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex-between mt-4">
                    <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                        {form.formState.isSubmitting ?
                            <>
                                <Loader className="mr-2 h-4 w-4 animate-spin" /> Updating...
                            </> : 'Update User'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
