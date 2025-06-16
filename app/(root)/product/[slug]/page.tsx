import { auth } from "@/auth"
import AddToCart from "@/components/shared/product/add-to-cart"
import ProductImages from "@/components/shared/product/product-images"
import ProductPrice from "@/components/shared/product/product-price"
import Rating from "@/components/shared/product/rating"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getMyCart } from "@/lib/actions/cart.actions"
import { getMyFavorites } from "@/lib/actions/favorite.actions"
import { getLatestProductsAction, getProductBySlugAction } from "@/lib/actions/product.actions"
import { Heart } from "lucide-react"
import { notFound } from "next/navigation"
import FavoriteButton from "./favorite-button"
import ReviewList from "./review-list"
import Link from "next/link"

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
    const { slug } = await props.params

    const product = await getProductBySlugAction(slug)

    return { title: `${product?.name}` }
}

export const generateStaticParams = async () => {
    const products = await getLatestProductsAction()

    const slugs = products.map(product => ({ slug: product.slug }))

    return slugs
}

export default async function ProductDetailPage(props: { params: Promise<{ slug: string }> }) {
    const { slug } = await props.params
    const session = await auth()
    const userId = session?.user?.id

    const product = await getProductBySlugAction(slug)

    if (!product) notFound()

    const cart = await getMyCart()

    const favorites = await getMyFavorites()

    return (
        <>
            <section className="pb-3 border-b">
                <div className="grid grid-cols-1 md:grid-cols-5">
                    {/* Images Column */}
                    <div className="col-span-2">
                        <ProductImages images={product.images} />
                    </div>
                    {/* Detials Column */}
                    <div className="col-span-2 p-5">
                        <div className="flex flex-col gap-6">
                            <p>{product.brand} {product.category}</p>
                            <h3 className="h3-bold">{product.name}</h3>
                            <div className="flex items-center justify-between gap-2">
                                <Rating value={Number(product.rating)} />
                                {userId ?
                                    <FavoriteButton
                                        favorites={favorites}
                                        item={{
                                            productId: product.id,
                                            slug,
                                            image: product.images![0],
                                            name: product.name,
                                            price: product.price
                                        }} /> :
                                    <Link href={`/sign-in?callbackUrl=/product/${slug}`} type="button" className="border hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full p-3 px-4">
                                        <Heart className="w-4 h-4" />
                                    </Link>
                                }
                            </div>
                            <p>{product.numReviews} Reviews</p>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <ProductPrice value={Number(product.price)} className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2" />
                            </div>
                        </div>
                        <div className="mt-10">
                            <p className="font-semibold">Description</p>
                            <p>{product.description}</p>
                        </div>
                    </div>
                    {/* Action Column */}
                    <div className="col-span-1">
                        <Card>
                            <CardContent className="p-4">
                                <div className="mb-2 flex justify-between items-center">
                                    <div>Price</div>
                                    <div>
                                        <ProductPrice value={Number(product.price)} />
                                    </div>
                                </div>
                                <div className="mb-2 flex justify-between items-center">
                                    <div>Status</div>
                                    {
                                        product.stock > 0 ? (
                                            <Badge variant='outline'>In Stock</Badge>
                                        ) : (
                                            <Badge variant='destructive'>Out of Stock</Badge>
                                        )
                                    }
                                </div>
                                {
                                    product.stock > 0 && (
                                        <div className="flex-center mt-5">
                                            <AddToCart
                                                cart={cart}
                                                item={{
                                                    productId: product.id,
                                                    name: product.name,
                                                    slug: product.slug,
                                                    qty: 1,
                                                    image: product.images![0],
                                                    price: product.price
                                                }} />
                                        </div>
                                    )
                                }
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
            <section className="mt-5 space-y-4">
                <h2 className="h2-bold">Customer Reviews</h2>
                <ReviewList userId={userId || ''} productId={product.id} productSlug={slug} />
            </section>
        </>
    )
}
