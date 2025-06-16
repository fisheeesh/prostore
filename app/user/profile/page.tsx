import { auth } from '@/auth'
import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import ProfileForm from './profile-form'

/**
 * * In client component, we cannot simply say const session = await auth()
 * * Instead we have to use a hook called useSession()
 * * In order to use that wherever that form is embedded, that component -- it has to be wrapped in SessionProvider
 */
export const metadata: Metadata = {
    title: "My Profile"
}

export default async function ProfilePage() {
    const session = await auth()

    return (
        <SessionProvider session={session}>
            <div className="max-w-md mx-auto space-y-4">
                <h2 className="h2-bold">Profile</h2>
                <ProfileForm />
            </div>
        </SessionProvider>
    )
}
