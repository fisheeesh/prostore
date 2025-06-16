import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { APP_NAME } from "@/lib/constants"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import CredentialsSignInForm from "./credentials-signin-form"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
    title: 'Sign In'
}

export default async function SignInPage(props: {
    searchParams: Promise<{ callbackUrl: string }>
}) {
    const { callbackUrl } = await props.searchParams
    const session = await auth()

    if (session) {
        return redirect(callbackUrl || '/')
    }

    return (
        <div className="w-full max-w-lg mx-auto px-4">
            <Card>
                <CardHeader className="space-y-4">
                    <Link href={'/'} className="flex-center">
                        <Image src={'/images/logo.svg'} width={100} height={100} alt={`${APP_NAME} logo`} priority />
                    </Link>
                    <CardTitle className="text-center">Sign In</CardTitle>
                    <CardDescription className="text-center">Nice to see you again.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <CredentialsSignInForm />
                </CardContent>
            </Card>
        </div>
    )
}
