import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";

export const config = {
    secret: process.env.NEXT_AUTH_SECRET,
    pages: {
        signIn: '/sign-in',
        error: '/sign-in',
    },
    session: {
        strategy: 'jwt',
        //* It will last 30 days
        maxAge: 30 * 24 * 60 * 60,
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            credentials: {
                email: { type: 'email' },
                password: { type: 'password' }
            },
            //* credentials is the obj with the data that comes from our form
            async authorize(credentials) {
                if (credentials === null) return null

                //* Find user in db
                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email as string
                    }
                })

                //* If user exist and if password matches
                if (user && user.password) {
                    const isMatch = compareSync(credentials.password as string, user.password as string)

                    //* if password is correct return user
                    if (isMatch) return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                }

                //* If user does not exist or the password does not match return null
                return null
            }
        })
    ],
    callbacks: {
        async session({ session, user, trigger, token }: any) {
            //* Set user id from token
            //? jwt token has a subject property(sub). By default that is userId
            session.user.id = token.sub

            //* If there is an update, set the user name
            if (trigger === 'update') {
                session.user.name = user.name
            }

            return session
        },
    }
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)