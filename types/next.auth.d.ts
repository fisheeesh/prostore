import { DefaultSession } from 'next-auth/react'

/**
 * * The default session user type of next auth only has user, email, name and id.
 * * If we want to add role, we have to extend the next auth session user type.
 * * To do that, we have to create next.auth.d.ts (d means defination).
 * * We have to extend user obj to include the role.
 */

declare module 'next-auth' {
    export interface Session {
        user: {
            role: string
        } & DefaultSession['user']
        //* By doin that, we're saying that we are not gonna change any of other properties or overwrite them.
    }
}