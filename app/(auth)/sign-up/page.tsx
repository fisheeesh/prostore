import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { APP_NAME } from "@/lib/constants"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import SignUpForm from "./sign-up-form"

export const metadata: Metadata = {
    title: 'Sign Up'
}

export default async function SignUpPage(props: {
    searchParams: Promise<{ callbackUrl: string }>
}) {
    const { callbackUrl } = await props.searchParams
    const session = await auth()

    if (session) {
        return redirect(callbackUrl || '/')
    }

    return (
        <div className="w-full max-w-lg mx-auto p-4">
            <Card>
                <CardHeader className="space-y-4">
                    <Link href={'/'} className="flex-center">
                        <Image src={'/images/logo.svg'} width={100} height={100} alt={`${APP_NAME} logo`} priority />
                    </Link>
                    <CardTitle className="text-center">Sign Up</CardTitle>
                    <CardDescription className="text-center">Welcome to {APP_NAME}.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <SignUpForm />
                </CardContent>
            </Card>
        </div>
    )
}
