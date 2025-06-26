"use client"

import { useLinkedInDetection } from '@/hooks/use-linkedin-detection'
import { useToast } from '@/hooks/use-toast'
import { AlertTriangle, Copy } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { Button } from '../ui/button'

export default function GoogleButton({ callbackUrl }: { callbackUrl: string }) {
    const { toast } = useToast()
    const { isLinkedInApp, isLoading } = useLinkedInDetection()

    const handleSignIn = async (provider: "google") => {
        if (isLinkedInApp) {
            toast({
                variant: 'destructive',
                title: 'Sign-in not available',
                description: 'Google sign-in is not supported in LinkedIn app. Please open in your browser.'
            })
            return
        }

        try {
            await signIn(provider, {
                redirectTo: callbackUrl,
                redirect: true
            })
        } catch (error) {
            console.log(error)

            toast({
                variant: 'destructive',
                description: error instanceof Error ? error.message : 'An error occurred during sign-in'
            })
        }
    }

    const copyCurrentUrl = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            toast({
                description: 'URL copied to clipboard!'
            })
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea')
            textArea.value = window.location.href
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)
            toast({
                description: 'URL copied to clipboard!'
            })
        })
    }


    //* Show loading state while detecting
    if (isLoading) {
        return (
            <Button
                className="w-full flex items-center gap-3"
                type="button"
                variant='outline'
                disabled
            >
                <Image src='/images/google.png' alt="google" width={17} height={17} />
                Continue with Google
            </Button>
        )
    }

    if (isLinkedInApp) {
        return (
            <div className="w-full space-y-3">
                <Button
                    className="w-full flex items-center gap-3 opacity-50 cursor-not-allowed"
                    type="button"
                    variant='outline'
                    disabled
                >
                    <Image src='/images/google.png' alt="google" width={17} height={17} />
                    Continue with Google
                </Button>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-amber-800 mb-1">
                                Google Sign-in Unavailable
                            </h4>
                            <p className="text-sm text-amber-700 mb-3">
                                Google authentication doesn&apos;t work in LinkedIn&apos;s browser.
                                Please use email/password or open this page in your browser.
                            </p>
                            <Button
                                type='button'
                                variant="outline"
                                size="sm"
                                onClick={copyCurrentUrl}
                                className="bg-white hover:bg-gray-50 text-amber-700 border-amber-300"
                            >
                                <Copy className="w-4 h-4 mr-2" />
                                Copy URL
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <Button
            className="w-full flex items-center gap-3"
            type="button"
            variant='outline'
            onClick={() => handleSignIn('google')}
        >
            <Image src='/images/google.png' alt="google" width={17} height={17} />
            Continue with Google
        </Button>
    )
}