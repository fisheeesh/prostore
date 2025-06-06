import ProductCard from '@/components/shared/product/product-card'
import { Button } from '@/components/ui/button'
import { getAllCategoriesAction, getAllProductsAction } from '@/lib/actions/product.actions'
import Link from 'next/link'
import React from 'react'

const prices = [
    {
        name: '$1 to $50',
        value: '1-50'
    },
    {
        name: '$51 to $100',
        value: '51-100'
    },
    {
        name: '$101 to $200',
        value: '101-200'
    },
    {
        name: '$201 to $500',
        value: '201-500'
    },
    {
        name: '$501 to $1000',
        value: '501-1000'
    },
]

const ratings = [4, 3, 2, 1]

const sortOrders = ['newest', 'lowest', 'highest', 'rating']

export async function generateMetadata(props: {
    searchParams: Promise<{
        q: string,
        category: string,
        price: string,
        rating: string
    }>,
}) {
    const {
        q = 'all',
        category = 'all',
        price = 'all',
        rating = 'all'
    } = await props.searchParams

    const isQuerySet = q && q !== 'all' && q.trim() !== ''
    const isCategorySet = category && category !== 'all' && category.trim() !== ''
    const isPriceSet = price && price !== 'all' && price.trim() !== ''
    const isRatingSet = rating && rating !== 'all' && rating.trim() !== ''

    if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
        return {
            title: `Search 
            ${isQuerySet ? q : ''} 
            ${isCategorySet ? `Category ${category}` : ''}
            ${isPriceSet ? `Price ${price}` : ''}
            ${isRatingSet ? `Rating ${rating}` : ''}
            `
        }
    } else {
        return {
            title: 'Search Products'
        }
    }

}

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
    const getFilterUrl = ({ c, s, p, r, pg }: { c?: string, s?: string, p?: string, r?: string, pg?: string }) => {
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

    const categories = await getAllCategoriesAction()

    return (
        <div className='grid md:grid-cols-5 md:gap-5'>
            <div className="filter-links">
                {/* Categories Links */}
                <div className='text-xl mb-2 mt-3'>Department</div>
                <div>
                    <ul className="space-y-1">
                        <li>
                            <Link href={getFilterUrl({ c: 'all' })} className={`${(category === 'all' || category === '') && 'font-bold'}`}>
                                Any
                            </Link>
                        </li>
                        {
                            categories.map(x => (
                                <li key={x.category}>
                                    <Link href={getFilterUrl({ c: x.category })} className={`${category === x.category && 'font-bold'}`} >
                                        {x.category}
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                {/* Price Links */}
                <div className='text-xl mb-2 mt-8'>Price</div>
                <div>
                    <ul className="space-y-1">
                        <li>
                            <Link href={getFilterUrl({ p: 'all' })} className={`${price === 'all' && 'font-bold'}`}>
                                Any
                            </Link>
                        </li>
                        {
                            prices.map(p => (
                                <li key={p.name}>
                                    <Link href={getFilterUrl({ p: p.value })} className={`${price === p.value && 'font-bold'}`} >
                                        {p.name}
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                {/* Ratings Links */}
                <div className='text-xl mb-2 mt-8'>Customer Ratings</div>
                <div>
                    <ul className="space-y-1">
                        <li>
                            <Link href={getFilterUrl({ r: 'all' })} className={`${rating === 'all' && 'font-bold'}`}>
                                Any
                            </Link>
                        </li>
                        {
                            ratings.map(r => (
                                <li key={r}>
                                    <Link href={getFilterUrl({ r: `${r}` })} className={`${rating === r.toString() && 'font-bold'}`} >
                                        {`${r} star${r > 1 ? 's' : ''} & up`}
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
            <div className="space-y-4 md:col-span-4">
                <div className="flex-between flex-col my-4 md:flex-row">
                    {/* Filters value display */}
                    <div className="flex items-center">
                        {q !== 'all' && q !== '' &&
                            <>
                                <strong>Query: </strong> <span className='pr-2'>{q}</span>
                            </>
                        }
                        {category !== 'all' && category !== '' &&
                            <>
                                <strong>Category: </strong> <span className='pr-2'>{category}</span>
                            </>
                        }
                        {
                            price !== 'all' &&
                            <>
                                <strong>Price: </strong> <span className='pr-2'>{price}</span>
                            </>
                        }
                        {
                            rating !== 'all' &&
                            <>
                                <strong>Rating: </strong> <span className='pr-2'>{rating} star{Number(rating) > 1 ? 's' : ''} & up</span>
                            </>
                        }
                        &nbsp;
                        {
                            (q !== 'all' && q !== '') ||
                                (category !== 'all' && category !== '') ||
                                (rating !== 'all') ||
                                (price !== 'all') ? (
                                <Button variant='link' asChild>
                                    <Link href='/search'>Clear</Link>
                                </Button>
                            ) : null
                        }
                    </div>
                    {/* Sort */}
                    <div>
                        Sort by {' '}
                        {sortOrders.map(s => (
                            <Link href={getFilterUrl({ s })} key={s} className={`mx-2 ${sort === s && 'font-bold'}`}>{s}</Link>
                        ))}
                    </div>
                </div>
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
        </div >
    )
}
