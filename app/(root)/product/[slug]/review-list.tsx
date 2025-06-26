"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllReviewsAction } from "@/lib/actions/review.actions"
import { Review } from "@/types"
import { Calendar, User } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import ReviewForm from "./review-form"
import { formatDateTime } from "@/lib/utils"
import Rating from "@/components/shared/product/rating"

export default function ReviewList({ enableReview, userId, productId, productSlug }: { enableReview: boolean, userId: string, productId: string, productSlug: string }) {
    const [reviews, setReviews] = useState<Review[]>([])

    useEffect(() => {
        const loadReviews = async () => {
            const res = await getAllReviewsAction({ productId })

            setReviews(res.data)
        }

        loadReviews()

    }, [productId])

    //* Reload reviews after either updated or created
    const reload = async () => {
        const res = await getAllReviewsAction({ productId })
        setReviews([...res.data])
    }

    return (
        <div className="space-y-4">
            {
                reviews.length === 0 && (
                    <div>No Reviews yet.</div>
                )
            }
            {
                userId ? (
                    <ReviewForm enableReview={enableReview} userId={userId} productId={productId} onReviewSubmitted={reload} />
                ) : (
                    <div>
                        Please<Link className="text-yellow-500 px-1" href={`/sign-in?callbackUrl=/product/${productSlug}`}>Sign In</Link>
                        to write a review.
                    </div >
                )
            }
            <div className="flex flex-col gap-3">
                {
                    reviews.map(review => (
                        <Card key={review.id}>
                            <CardHeader>
                                <div className="flex-between">
                                    <CardTitle>{review.title}</CardTitle>
                                </div>
                                <CardDescription>{review.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 text-sm text-muted-foreground">
                                    {/* Ratings */}
                                    <Rating value={review.rating} />
                                    <div className="flex items-center">
                                        <User className="md:mr-1 h-3 w-3" />
                                        {review.user ? review.user.name : 'User'}
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="md:mr-1 h-3 w-3" />
                                        {formatDateTime(review.createdAt).dateTime}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                }
            </div>
        </div>
    )
}
