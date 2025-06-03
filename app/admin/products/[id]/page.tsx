import ProductForm from "@/components/admin/product-form"
import { getProductByIdAction } from "@/lib/actions/product.actions"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
    title: "Update Product"
}

export default async function AdminProductUpatePage(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params

    const product = await getProductByIdAction(id)

    if (!product) notFound()

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <h1 className="h2-bold">Update Product</h1>
            <ProductForm type="Update" product={product} productId={id} />
        </div>
    )
}
