import { prisma } from "@/db/prisma"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const { productId } = await request.json()

    if (!productId) {
        return NextResponse.json({ success: false, message: 'productId is required' }, { status: 400 })
    }

    await prisma.product.update({
        where: { id: productId },
        data: {
            isDeal: false,
            discount: 0
        }
    })

    return NextResponse.json({ success: true, message: 'Deal status reset' }, { status: 200 })
}