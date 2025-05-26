import AddToCart from "@/components/shared/product/add-to-cart"
import ProductImages from "@/components/shared/product/product-images"
import ProductPrice from "@/components/shared/product/product-price"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getLatestProductsAction, getProductBySlugAction } from "@/lib/actions/product.actions"
import { notFound } from "next/navigation"

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

    const product = await getProductBySlugAction(slug)

    if (!product) notFound()

    return (
        <section className="">
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
                        <p>{product.rating} of {product.numReviews} Reviews.</p>
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
                                        <AddToCart item={{
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
    )
}
