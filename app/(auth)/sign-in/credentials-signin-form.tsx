"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInWithCredentials } from "@/lib/actions/user.actions"
import { SIGN_IN_DEFAULT_VALUES } from "@/lib/constants"
import Link from "next/link"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"

export default function CredentialsSignInForm() {
    const [data, action] = useActionState(signInWithCredentials, {
        success: false,
        message: ''
    })

    const SignInButton = () => {
        const { pending } = useFormStatus()

        return (
            <Button disabled={pending} className="w-full" variant='default'>
                {pending ? 'Signing in...' : 'Sign In'}
            </Button>
        )
    }

    return (
        <form action={action}>
            <div className="space-y-6">
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="Email, e.g. user@prostore.com" name="email" type="email" required autoComplete="email" defaultValue={SIGN_IN_DEFAULT_VALUES.email} />
                </div>
                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" placeholder="Password" name="password" type="password" required autoComplete="password" defaultValue={SIGN_IN_DEFAULT_VALUES.password} />
                </div>
                <div>
                    <SignInButton />
                </div>

                {data && !data.success && (
                    <div className="text-center text-destructive">
                        {data.message}
                    </div>
                )}

                <div className="text-sm text-center text-muted-foreground">
                    Don&apos; t have an account? {' '}
                    <Link href='/sign-up' target="_self" className="link">Sign Up</Link>
                </div>
            </div>
        </form>
    )
}
