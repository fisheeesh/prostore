"use server"

import { auth } from "@/auth"
import { prisma } from "@/db/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { formatErrors } from "../utils"
import { insertReviewSchema } from "../validator"

//* Create & Update Review
export async function createUpdateReviewAction(data: z.infer<typeof insertReviewSchema>) {
    try {
        const session = await auth()
        if (!session) throw new Error('User not found. Please sign in to continue.')

        //* Validate and store the review
        const review = insertReviewSchema.parse({
            ...data,
            userId: session.user?.id,
        })

        //* Get product that is being reviewed
        const product = await prisma.product.findFirst({
            where: { id: review.productId }
        })
        if (!product) throw new Error('Product not found.')

        //* Check the user already reviewed
        const reviewExists = await prisma.review.findFirst({
            where: { productId: review.productId, userId: review.userId }
        })

        await prisma.$transaction(async (tx) => {
            if (reviewExists) {
                //* Update the review
                await tx.review.update({
                    where: { id: reviewExists.id },
                    data: {
                        title: review.title,
                        description: review.description,
                        rating: review.rating
                    }
                })
            }
            else {
                //* Create the review
                await tx.review.create({
                    data: review
                })
            }

            //* Get average rating
            const averageRating = await tx.review.aggregate({
                _avg: { rating: true },
                where: { productId: review.productId }
            })

            //* Get numbers of reviews
            const numReviews = await tx.review.count({
                where: { productId: review.productId }
            })

            //* Update the rating and numReviews in product table
            await tx.product.update({
                where: { id: review.productId },
                data: {
                    numReviews,
                    rating: averageRating._avg.rating || 0
                }
            })
        })

        revalidatePath(`/product/${product.slug}`)

        return { success: true, message: reviewExists ? 'Your Review has been updated successfully.' : 'Thanks for your review.' }

    } catch (error) {
        return { success: false, message: formatErrors(error) }
    }
}