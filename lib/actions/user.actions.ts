"use server"

import { isRedirectError } from "next/dist/client/components/redirect-error"
import { paymentMethodSchema, shippingAddressSchema, signInFormSchema, signUPFormSchema } from "../validator"
import { auth, signIn, signOut } from '@/auth'
import { hashSync } from "bcrypt-ts-edge"
import { prisma } from "@/db/prisma"
import { formatErrors } from "../utils"
import { ShippingAddress } from "@/types"
import { z } from "zod"

//* sign in user with credentials
//? When we use useActionState hook and submit with that, the first value is always gonna be prevState.
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

//* sign up user
export const signUpUserAction = async (prevState: unknown, formData: FormData) => {
    try {
        const user = signUPFormSchema.parse({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        })

        const plainPassword = user.password

        user.password = hashSync(user.password, 10)

        await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password
            }
        })

        await signIn('credentials', {
            email: user.email,
            password: plainPassword
        })

        return { success: true, message: 'User registered successfully.' }
    }
    catch (err) {
        // console.log(err.name)
        // console.log(err.code)
        // console.log(err.errors)
        // console.log(err.meta?.target)

        if (isRedirectError(err)) {
            throw err
        }

        return { success: false, message: formatErrors(err) }
    }
}

//* Get user by id
export const getUserById = async (userId: string) => {
    const user = await prisma.user.findFirst({
        where: { id: userId }
    })

    if (!user) throw new Error('User not found.')

    return user
}

//* Update user address
export async function updateUserAddressAction(data: ShippingAddress) {
    try {
        const session = await auth()
        const currentUser = await prisma.user.findFirst({
            where: { id: session?.user?.id }
        })

        if (!currentUser) throw new Error('User not found. Please sign in to continue.')

        const address = shippingAddressSchema.parse(data)

        await prisma.user.update({
            where: { id: currentUser.id },
            data: { address }
        })

        return { success: true, message: 'User updated sucessfully.' }

    } catch (error) {
        return { success: false, message: formatErrors(error) }
    }
}

//* Update user payment method
export async function updateUserPaymentAction(data: z.infer<typeof paymentMethodSchema>) {
    try {
        const session = await auth()
        const currentUser = await prisma.user.findFirst({
            where: { id: session?.user?.id }
        })

        if (!currentUser) throw new Error('User not found. Please sign in to continue.')

        const paymentMethod = paymentMethodSchema.parse(data)

        await prisma.user.update({
            where: { id: currentUser.id },
            data: { paymentMethod: paymentMethod.type }
        })

        return { success: true, message: 'User updated successfully.' }

    } catch (error) {
        return { success: false, message: formatErrors(error) }
    }
}