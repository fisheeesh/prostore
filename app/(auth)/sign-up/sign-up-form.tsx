"use client"

import GoogleButton from "@/components/shared/google-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signUpUserAction } from "@/lib/actions/user.actions"
import { Loader, OctagonAlert } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"

export default function SignUpForm() {
    const [data, action] = useActionState(signUpUserAction, {
        success: false,
        message: ''
    })
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/'

    const SignUpButton = () => {
        const { pending } = useFormStatus()

        return (
            <Button disabled={pending} className="w-full" variant='default'>
                {pending ? (
                    <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                    </>) : 'Sign Up'}
            </Button>
        )
    }

    return (
        <form action={action}>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <div className="space-y-4">
                <div>
                    <Label htmlFor="name">Name <span className="text-red-600">*</span></Label>
                    <Input id="name" placeholder="Name, e.g. user@prostore.com" name="name" type="text" autoComplete="name" />
                </div>
                <div>
                    <Label htmlFor="email">Email <span className="text-red-600">*</span></Label>
                    <Input id="email" placeholder="Email, e.g. user@prostore.com" name="email" type="text" autoComplete="email" />
                    <span className="text-muted-foreground text-xs leading-tight">
                        Use an existing email to ensure you receive your order confirmation.
                    </span>
                </div>
                <div>
                    <Label htmlFor="password">Password <span className="text-red-600">*</span></Label>
                    <Input id="password" placeholder="Password" name="password" type="password" autoComplete="password" />
                </div>
                <div>
                    <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-600">*</span></Label>
                    <Input id="confirmPassword" placeholder="Confirm Password" name="confirmPassword" type="password" autoComplete="confirmPassword" />
                </div>
                <div className="space-y-3">
                    <SignUpButton />
                    <GoogleButton callbackUrl={callbackUrl} />
                </div>

                {(data && !data.success && data.message) && (
                    <div className="flex items-center gap-2 font-bold justify-center text-center w-full p-3 bg-red-100 text-red-600">
                        <OctagonAlert className="w-4 h-4" /> {data.message}
                    </div>
                )}

                <div className="text-sm text-center text-muted-foreground">
                    Already have an account? {' '}
                    <Link href='/sign-in' target="_self" className="text-black font-bold dark:text-white">Sign In</Link>
                </div>
            </div>
        </form>
    )
}
