import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export const authConfig = {
    secret: process.env.NEXT_AUTH_SECRET,
    providers: [],
    callbacks: {
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

            //? Check for session cart cookie
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

// * ----- 
/**
 * * user log in or not add to cart loh ya ml so sessionCartId lo ml 
 * * so dok website ko win lr dr nae ae dr ko create py lyk ml p mha ae dr nae manipulate br nyar
 * * authorized function ko use p create ml ae kg ka response to return pyn ya ml
 * * a yin sone req htl ka cookies htl mr sessionCartId ko check ml
 * * shi yin return true htet create ma ny dok vu cuz pages tine mr run ny mr moh
 * * ma shi yin sessionCartId ko create ml uuid format a tine so use crypto.randomUUID()
 * * p yin headers ko clone new response lope ae response.cookies htl ko sessionCartId set.
 */