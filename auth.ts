import { PrismaAdapter } from "@auth/prisma-adapter";
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextResponse } from "next/server";
import { prisma } from "./db/prisma";

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
            session.user.role = token.role
            session.user.name = token.name

            //* If there is an update, set the user name
            if (trigger === 'update') {
                session.user.name = user.name
            }

            return session
        },
        async jwt({ token, user, trigger, session }: any) {
            //* assign user fields to token
            if (user) {
                token.role = user.role

                //* If user has not name, use email
                if (user.name === 'NO_NAME') {
                    token.name = user.email.split('@')
                }

                //* Update the database to reflect the token name
                await prisma.user.update({
                    where: { id: user.id },
                    data: { name: token.name }
                })
            }

            return token
        },
        //* We have to create middleeare.ts to work this function 
        // ** -----
        authorized({ request, auth }: any) {
            //* Check for session cart cookie
            if (!request.cookies.get('sessionCartId')) {
                const sessionCartId = crypto.randomUUID()

                //* Clone request headers
                const newRequestHeaders = new Headers(request.headers)

                //* Create new response and add new headers
                const response = NextResponse.next({
                    request: {
                        headers: newRequestHeaders
                    }
                })

                //* Set newly generated session cart id in the response cookies
                response.cookies.set('sessionCartId', sessionCartId)

                return response
            }
            else {
                return true
            }
        }
    }
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)

// * ----- 
/**
 * * user log in or not add to cart loh ya ml so sessionCartId so ml 
 * * so dok website ko win lr dr nae ae dr ko create py lyk ml p mha ae dr nae manipulate br nyar
 * * authorized function ko use ml p create ml ae kg ka response to return pyn ya ml
 * * a yin sone req htl ka cookies htl mr sessionCartId ko check ml
 * * shi yin return true htet create ma ny dok vu cuz pages tine mr run ny mr moh
 * * ma shi yin sessionCartId ko create ml uuid format a tine so use crypto.randomUUID()
 * * p yin headers ko clone new response lope ae response.cookies htl ko sessionCartId set.
 */