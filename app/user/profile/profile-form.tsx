"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { updateProfileAction } from "@/lib/actions/user.actions"
import { updateProfileSchema } from "@/lib/validator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { useSession } from "next-auth/react"
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

export default function ProfileForm() {
    const { data: session, update } = useSession()

    const form = useForm<z.infer<typeof updateProfileSchema>>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: session?.user?.name ?? '',
            email: session?.user?.email ?? ''
        }
    })

    const { toast } = useToast()

    const onSubmit: SubmitHandler<z.infer<typeof updateProfileSchema>> = async (values) => {
        const res = await updateProfileAction(values)

        if (!res?.success) {
            return toast({
                variant: 'destructive',
                description: res?.message
            })
        }

        const newSession = {
            ...session,
            user: {
                ...session?.user,
                name: values.name
            }
        }

        await update(newSession)

        toast({
            description: res?.message
        })
    }

    return (
        <Form {...form}>
            <form action="" className="flex flex-col gap-2" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col-gap-5">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof updateProfileSchema>, 'email'> }) => (
                            <FormItem className="w-full">
                                <FormLabel>Email <span className="text-red-600">*</span></FormLabel>
                                <FormControl>
                                    <Input disabled placeholder='Email' className="input-field" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex flex-col gap-5">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof updateProfileSchema>, 'name'> }) => (
                            <FormItem className="w-full">
                                <FormLabel>Name <span className="text-red-600">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder='Name' className="input-field" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button disabled={form.formState.isSubmitting} type="submit" size='lg' className="button mt-3 col-span-2 w-full">
                    {form.formState.isSubmitting ? (
                        <>
                            <Loader className="h-4 w-4 animate-spin" /> Submitting..
                        </>
                    ) : 'Update Profile'}
                </Button>
            </form>
        </Form>
    )
}
