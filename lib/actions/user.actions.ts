"use server"

import { isRedirectError } from "next/dist/client/components/redirect-error"
import { signInFormSchema } from "../validator"
import { signIn, signOut } from '@/auth'

//* sign in user with credentials
export const signInWithCredentialsAction = async (prevState: unknown, formData: FormData) => {
    try {
        const user = signInFormSchema.parse({
            email: formData.get('email'),
            password: formData.get('password')
        })

        await signIn('credentials', user)

        return { success: true, message: 'SignIn successfully.' }
    }
    catch (err) {
        if (isRedirectError(err)) {
            throw err
        }

        return { success: false, message: 'Invalid email or password.' }
    }
}

//* sign user out
export const signOutUserAction = async () => {
    await signOut()
}