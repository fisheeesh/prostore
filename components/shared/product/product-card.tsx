"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Product } from "@/types"
import Image from "next/image"
import Link from "next/link"
import ProductPrice from "./product-price"
import { cn } from "@/lib/utils"

export default function ProductCard({ product }: { product: Product }) {
    const [isLoading, setIsLoading] = useState(true)

    return (
        <Card className="w-full max-w-lg sm:max-w-sm h-full flex flex-col justify-between">
            <CardHeader className="p-1.5">
                <Link href={`/product/${product.slug}`}>
                    <div className="relative w-full h-[350px] rounded-xl overflow-hidden">
                        {isLoading && (
                            <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700" />
                        )}
                        <Image
                            className={cn(
                                "w-full h-full object-contain object-center transition-opacity duration-300",
                                isLoading ? "opacity-0" : "opacity-100"
                            )}
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            priority
                            onLoad={() => setIsLoading(false)}
                        />
                    </div>
                </Link>
            </CardHeader>
            <CardContent className="p-4 grid gap-4">
                <div className="text-xs">{product.brand}</div>
                <Link href={`/product/${product.slug}`}>
                    <h2 className="text-sm font-medium line-clamp-1">{product.name}</h2>
                </Link>
                <div className="flex-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 border px-2 py-1 border-yellow-400/50 dark:border-yellow-400 bg-yellow-100/70 dark:bg-yellow-100 text-sm">
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='text-yellow-500 w-4 h-auto fill-current'
                                viewBox='0 0 16 16'
                            >
                                <path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z' />
                            </svg>
                            <span className="text-black">{product.rating}</span>
                        </div>
                        <span className="text-sm font-medium block md:hidden xl:block">
                            {product.sold} sold
                        </span>
                    </div>
                    {product.stock > 0 ? (
                        <ProductPrice
                            discount={Number(product.discount)}
                            value={Number(product.price)}
                            className=""
                        />
                    ) : (
                        <p className="text-destructive line-clamp-1">Out of Stock</p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}