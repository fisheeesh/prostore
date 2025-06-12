"use client"

import { Button } from "@/components/ui/button"
import { APP_NAME } from "@/lib/constants"
import Image from "next/image"

export default function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
            <div className="text-center space-y-6 max-w-md mx-auto">
                <Image
                    src='/images/logo.svg'
                    alt={`${APP_NAME} logo`}
                    height={64}
                    width={64}
                    priority={true}
                    className="mx-auto"
                />

                <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-foreground">404</h1>
                    <h2 className="text-xl font-semibold text-destructive">Page Not Found</h2>
                    <p className="text-muted-foreground max-w-xs md:max-w-full mx-auto">
                        Sorry, we couldn&apos;t find the page you&apos;re looking for.
                    </p>
                </div>

                <Button
                    variant="default"
                    className="mt-6"
                    onClick={() => window.location.href = '/'}
                >
                    Back to Home
                </Button>
            </div>
        </div>
    )
}