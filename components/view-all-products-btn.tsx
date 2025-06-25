import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

export default function ViewAllProductsBtn() {
    return (
        <div className='flex items-center justify-center my-8'>
            <Button className='px-8 py-4 font-semibold' asChild>
                <Link href='/search'>View All Products</Link>
            </Button>
        </div>
    )
}
