"use client"

import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import { signIn } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'

export default function GoogleButton({ callbackUrl }: { callbackUrl: string }) {
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

    return (
        <Button className="w-full flex items-center gap-3" type="button" variant='outline' onClick={() => handleSignIn('google')}>
            <Image src='/images/google.png' alt="google" width={17} height={17} />
            Continue with Google
        </Button>
    )
}
