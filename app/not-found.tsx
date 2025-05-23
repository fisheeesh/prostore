"use client"

import { Button } from "@/components/ui/button"
import { APP_NAME } from "@/lib/constants"
import Image from "next/image"

export default function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Image src='/images/logo.svg' alt={`${APP_NAME} logo`} height={48} width={48} priority={true} />
            <div className="p-6 rounded-lg drop-shadow-md shadow mt-4 text-center w-1/3">
                <h1 className="text-3xl font-bold mb-4">Not Found.</h1>
                <p className="text-destructive">Could not find requested page :(</p>
                <Button variant='outline' className="mt-4 ml-2" onClick={() => window.location.href = '/'}>
                    Back to Home.
                </Button>
            </div>
        </div>
    )
}
