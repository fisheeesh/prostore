import ProductCard from '@/components/shared/product/product-card'
import { getAllProductsAction } from '@/lib/actions/product.actions'
import React from 'react'

export default async function SearchPage(props:
    { searchParams: Promise<{ q?: string, category?: string, price?: string, rating?: string, sort?: string, page?: string }> }
) {
    const {
        q = 'all',
        category = 'all',
        price = 'all',
        rating = 'all',
        sort = 'newest',
        page = '1'
    } = await props.searchParams

    const products = await getAllProductsAction({
        query: q,
        category,
        page: Number(page),
        price,
        sort,
        rating
    })

    return (
        <div className='grid md:grid-cols-5 md:gap-5'>
            <div className="filter-links">
                {/* Filter */}
            </div>
            <div className="space-y-4 md:col-span-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {products.data.length === 0 && (
                        <div>No products found.</div>
                    )}
                    {
                        products.data.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
