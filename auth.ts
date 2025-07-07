import { PrismaAdapter } from "@auth/prisma-adapter";
import { compareSync } from "bcrypt-ts-edge";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { prisma, prismaAuth } from "./db/prisma";
import { cookies } from "next/headers";
import { authConfig } from "./auth.config";

export const config = {
    secret: process.env.NEXT_AUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
    pages: {
        signIn: '/sign-in',
        error: '/sign-in',
    },
    session: {
        strategy: 'jwt' as const,
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
        ...authConfig.callbacks,
        async signIn({ user, account, profile }: any) {
            if (account?.provider === "google") {
                try {
                    const existingUser = await prismaAuth.user.findFirst({
                        where: { email: user.email! }
                    });

                    if (existingUser) {
                        //* Check if this Google account is already linked
                        const existingAccount = await prismaAuth.account.findFirst({
                            where: {
                                provider: account.provider,
                                providerAccountId: account.providerAccountId,
                            }
                        });

                        //* If Google account not linked to any user, link it to existing user
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
                                }
                            });
                        }
                        return true;
                    }

                    //* If user doesn't exist, create new user (your existing logic)
                    const newUser = await prismaAuth.user.create({
                        data: {
                            email: user.email!,
                            name: user.name || user.email!.split('@')[0],
                            role: 'user',
                        }
                    });

                    await prismaAuth.account.create({
                        data: {
                            userId: newUser.id,
                            type: account.type,
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            refresh_token: account.refresh_token,
                            access_token: account.access_token,
                            expires_at: account.expires_at,
                            token_type: account.token_type,
                            scope: account.scope,
                            id_token: account.id_token,
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
                    token.name = user.name
                }

                /**
                 * * user ka login ma lope pl item twy ko add to cart lyk ml p dok shipping address go yin sign in lope khine ml
                 * * dr pay mae nga dok ka cart to user.id nae u htr dr sessionCartId nae ma hote dok user sign in phyit yin thu item twy ka lose twr ml
                 * * ae lo ma phyit ya ag sign in phyit yin cookies htl mr sessionCartId shi ma shi sit ml, shi mr pl shi ag lope htr loh
                 * * shi yin ae sessionCardId nae cart shi lr sit, shi yin a khun win lr tae user yae id nae shi tae cart ko delete lyk ml
                 * * p yin khu na ka sessionCartId nae ya lr tae cart yae id nae cart yae userId ko win lr tae user yae id nae update lyk ml
                 * * ae lo so cart ll new ma phyit dok ta lo item twy ll pyouk ma twr vu
                 * * delete dr ka new user so ma sai dok, exisiting user twy so mha delete dr
                 */
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
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)