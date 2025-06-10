import DeleteDialog from '@/components/shared/delete-dialog'
import Pagination from '@/components/shared/pagination'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getAllProductsAction, deleteProductAction } from '@/lib/actions/product.actions'
import { requireAdmin } from '@/lib/auth-guard'
import { formatCurrency, formatId } from '@/lib/utils'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

export const metadata: Metadata = {
    title: "Admin Products"
}

export default async function AdminProductsPage(props: { searchParams: Promise<{ page: string, query: string, category: string }> }) {
    await requireAdmin()
    const searchParams = await props.searchParams
    const page = Number(searchParams.page) || 1
    const searchText = searchParams.query || ''
    const cateogry = searchParams.category || ''

    const products = await getAllProductsAction({
        query: searchText,
        page,
        category: cateogry
    })

    return (
        <div className='space-y-2'>
            <div className="flex-between">
                <div className="flex items-center gap-3">
                    <h1 className="h2-bold">Products</h1>
                    {
                        searchText && (
                            <div>
                                Filtered by: <i>&quot;{searchText}&quot;</i>{' '}
                                <Link href='/admin/products'>
                                    <Button variant='outline' size='sm'>Remove Filter</Button>
                                </Link>
                            </div>
                        )
                    }
                </div>
                <Button asChild variant='default'>
                    <Link href='/admin/products/create'>Create Product</Link>
                </Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='whitespace-nowrap'>ID</TableHead>
                        <TableHead className='whitespace-nowrap'>NAME</TableHead>
                        <TableHead className='text-right whitespace-nowrap'>PRICE</TableHead>
                        <TableHead className='whitespace-nowrap'>CATEGORY</TableHead>
                        <TableHead className='whitespace-nowrap'>STOCK</TableHead>
                        <TableHead className='whitespace-nowrap'>RATING</TableHead>
                        <TableHead className='w-[100px] whitespace-nowrap'>ACTIONS</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.data.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className='whitespace-nowrap'>{formatId(product.id)}</TableCell>
                            <TableCell className='whitespace-nowrap'>{product.name}</TableCell>
                            <TableCell className='text-right whitespace-nowrap'>{formatCurrency(product.price)}</TableCell>
                            <TableCell className='whitespace-nowrap'>{product.category}</TableCell>
                            <TableCell className='whitespace-nowrap'>{product.stock}</TableCell>
                            <TableCell className='whitespace-nowrap'>{product.rating}</TableCell>
                            <TableCell className='flex items-center gap-1'>
                                <Button asChild variant='outline' size='sm'>
                                    <Link href={`/admin/products/${product.id}`}>Edit</Link>
                                </Button>
                                {/* Delete  Button*/}
                                <DeleteDialog id={product.id} action={deleteProductAction} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {!!products.totalPages && products.totalPages > 1 && <Pagination page={page} totalPages={products.totalPages} />}
        </div>
    )
}
