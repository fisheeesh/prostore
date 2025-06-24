import { PrismaAdapter } from "@auth/prisma-adapter";
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { NextResponse } from "next/server";
import { prisma, prismaAuth } from "./db/prisma";
import { cookies } from "next/headers";

export const config = {
    secret: process.env.NEXT_AUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
    pages: {
        signIn: '/sign-in',
        error: '/sign-in',
    },
    session: {
        strategy: 'jwt',
        //* It will last 30 days
        maxAge: 30 * 24 * 60 * 60,
    },
    adapter: PrismaAdapter(prismaAuth),
    providers: [
        Google,
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
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                try {
                    const existingUser = await prismaAuth.user.findFirst({
                        where: { email: user.email! }
                    });

                    if (existingUser) {
                        // Check if this Google account is already linked
                        const existingAccount = await prismaAuth.account.findFirst({
                            where: {
                                provider: account.provider,
                                providerAccountId: account.providerAccountId,
                            }
                        });

                        // If Google account not linked to any user, link it to existing user
                        if (!existingAccount) {
                            await prismaAuth.account.create({
                                data: {
                                    userId: existingUser.id,
                                    type: account.type,
                                    provider: account.provider,
                                    providerAccountId: account.providerAccountId,
                                    refresh_token: account.refresh_token,
                                    access_token: account.access_token,
                                    expires_at: account.expires_at,
                                    token_type: account.token_type,
                                    scope: account.scope,
                                    id_token: account.id_token,
                                    // session_state: account.session_stat,
                                }
                            });
                        }
                        return true;
                    }

                    // If user doesn't exist, create new user (your existing logic)
                    await prismaAuth.user.create({
                        data: {
                            email: user.email!,
                            name: user.name || user.email!.split('@')[0],
                            role: 'user',
                        }
                    });
                    return true;
                } catch (error) {
                    console.error("Error during Google sign-in:", error);
                    return false;
                }
            }
            return true;
        },
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
        async jwt({ token, user, trigger, session, account }: any) {
            //* Assign user fields to token
            if (user) {
                //* For Google sign-in, get user data from database
                if (account?.provider === "google") {
                    const dbUser = await prisma.user.findFirst({
                        where: { email: user.email }
                    });
                    if (dbUser) {
                        token.id = dbUser.id;
                        token.role = dbUser.role;
                        token.name = dbUser.name;
                    }
                } else {
                    //* For credentials sign-in
                    token.id = user.id
                    token.role = user.role

                    //* If user has not name, use email
                    if (user.name === 'NO_NAME') {
                        token.name = user.email.split('@')[0]

                        //* Update the database to reflect the token name
                        await prisma.user.update({
                            where: { id: user.id },
                            data: { name: token.name }
                        })
                    }
                }

                if (trigger === 'signIn' || trigger === 'signUp') {
                    const cookiesObj = await cookies()
                    const sessionCartId = cookiesObj.get('sessionCartId')?.value

                    if (sessionCartId) {
                        const sessionCart = await prisma.cart.findFirst({
                            where: { sessionCartId }
                        })

                        if (sessionCart) {
                            //* Delete current user cart
                            await prisma.cart.deleteMany({
                                where: { userId: user.id }
                            })

                            //* Assign new cart
                            await prisma.cart.update({
                                where: { id: sessionCart.id },
                                data: { userId: user.id }
                            })
                        }
                    }
                }
            }

            //* Handle session update
            if (session?.user.name && trigger === 'update') {
                token.name = session.user.name
            }

            return token
        },
        //* We have to create middleeare.ts to work this function 
        // ** -----
        authorized({ request, auth }: any) {
            //* Array of regex patterns of paths we want to protect
            const protectedPaths = [
                /\/shipping-address/,
                /\/payment-method/,
                /\/place-order/,
                /\/user\/(.*)/,
                /\/order\/(.*)/,
                /\/profile/,
                /\/admin/,
            ]

            //* Get pathname from request url obj
            const { pathname } = request.nextUrl

            //* Check if user is not authenticated and try to access protected paths
            if (!auth && protectedPaths.some(p => p.test(pathname))) return false

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