"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast, useToast } from "@/hooks/use-toast"
import { signInWithCredentialsAction } from "@/lib/actions/user.actions"
import { Loader, OctagonAlert } from "lucide-react"
import { signIn } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"

export default function CredentialsSignInForm() {
    const [data, action] = useActionState(signInWithCredentialsAction, {
        success: false,
        message: ''
    })
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/'
    const { toast } = useToast()

    const handleSignIn = async (provider: "google") => {
        try {
            await signIn(provider, {
                redirectTo: callbackUrl,
                redirect: true
            })
        } catch (error) {
            console.log(error)

            toast({
                variant: 'destructive',
                description: error instanceof Error ? error.message : 'An erorr occured during sign-in'
            })
        }
    }

    const SignInButton = () => {
        const { pending } = useFormStatus()

        return (
            <Button disabled={pending} className="w-full" variant='default'>
                {pending ? (
                    <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" /> Signning in...
                    </>) : 'Sign In'}
            </Button>
        )
    }

    return (
        <form action={action}>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <div className="space-y-4">
                <div>
                    <Label htmlFor="email">Email <span className="text-red-600">*</span></Label>
                    <Input id="email" placeholder="Email, e.g. user@prostore.com" name="email" type="email" autoComplete="email" />
                </div>
                <div>
                    <Label htmlFor="password">Password <span className="text-red-600">*</span></Label>
                    <Input id="password" placeholder="Password" name="password" type="password" autoComplete="password" />
                </div>
                <div className="space-y-3">
                    <SignInButton />
                    <Button className="w-full flex items-center gap-3" type="button" variant='outline' onClick={() => handleSignIn('google')}>
                        <Image src='/images/google.png' alt="google" width={17} height={17} />
                        Continue with Google
                    </Button>
                </div>

                {(data && !data.success && data.message) && (
                    <div className="flex items-center gap-2 font-bold justify-center text-center w-full p-3 bg-red-100 text-red-600">
                        <OctagonAlert className="w-4 h-4" /> {data.message}
                    </div>
                )}

                <div className="text-sm text-center text-muted-foreground">
                    Don&apos;t have an account? {' '}
                    <Link href='/sign-up' target="_self" className="text-black font-bold dark:text-white">Sign Up</Link>
                </div>
            </div>
        </form>
    )
}
