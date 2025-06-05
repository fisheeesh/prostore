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

    //* Construct filter url
    const getFilteredUrl = ({ c, s, p, r, pg }: { c?: string, s?: string, p?: string, r?: string, pg?: string }) => {
        const params = { q, category, price, rating, sort, page }

        if (c) params.category = c
        if (p) params.price = p
        if (s) params.sort = s
        if (r) params.rating = r
        if (pg) params.page = pg

        return `/search?${new URLSearchParams(params).toString()}`
    }

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
                
                URL : {getFilteredUrl({c: 'Mens Sweet Shirt'})}
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
