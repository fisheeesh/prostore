import { getAllProductsAction } from '@/lib/actions/product.actions'
import React from 'react'

export default async function AdminProductsPage(props: { searchParams: Promise<{ page: string, query: string, category: string }> }) {
    const searchParams = await props.searchParams
    const page = Number(searchParams.page) || 1
    const searchText = searchParams.query || ''
    const cateogry = searchParams.category || ''

    const products = await getAllProductsAction({
        query: searchText,
        page,
        category: cateogry
    })

    console.log(products)

    return (
        <div className='space-y-2'>
            <div className="flex-between">
                <h1 className="h2-bold">Products</h1>
            </div>
        </div>
    )
}
