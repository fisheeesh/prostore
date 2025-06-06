import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import ProductPrice from "./product-price";
import Rating from "./rating";

export default function ProductCard({ product }: { product: Product }) {
    return (
        <Card className="w-full max-w-lg sm:max-w-sm h-full flex flex-col justify-between">
            <CardHeader className="p-0 items-center">
                <Link href={`/product/${product.slug}`}>
                    <Image className="w-full h-full object-cover object-center rounded-xl p-1.5" src={product.images[0]} alt={product.name} width={300} height={300} priority={true} />
                </Link>
            </CardHeader>
            <CardContent className="p-4 grid gap-4">
                <div className="text-xs">{product.brand}</div>
                <Link href={`/product/${product.slug}`}>
                    <h2 className="text-sm font-medium">{product.name}</h2>
                </Link>
                <div className="flex-between gap-4">
                    <Rating value={Number(product.rating)} />
                    {
                        product.stock > 0 ? (
                            <ProductPrice value={Number(product.price)} className="" />
                        ) : (
                            <p className="text-destructive">Out of Stock</p>
                        )
                    }
                </div>
            </CardContent>
        </Card>
    )
}
