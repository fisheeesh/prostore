"use client"

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button'
import { formURLQurey } from '@/lib/utils'

type PaginationProps = {
    page: number | string,
    totalPages: number,
    urlParamName?: string
}

export default function Pagination({ page, totalPages, urlParamName }: PaginationProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathName = usePathname()

    // const handleClick = (btnType: string) => {
    //     const pageValue = btnType === 'next' ? Number(page) + 1 : Number(page) - 1

    //     const params = new URLSearchParams(searchParams.toString())
    //     params.set('page', pageValue.toString())
    //     router.replace(`${pathName}?${params.toString()}`, { scroll: false })

    // }

    const handleClick = (btnType: string) => {
        const pageValue = btnType === 'next' ? Number(page) + 1 : Number(page) - 1
        const newURL = formURLQurey({
            params: searchParams.toString(),
            key: urlParamName || 'page',
            value: pageValue.toString()
        })

        router.push(newURL)
    }

    if (totalPages === 1) return null

    return (
        <div className='flex gap-2 items-center'>
            <Button size='lg' variant='outline' className='w-28' disabled={Number(page) <= 1} onClick={() => handleClick('prev')}>
                Previous
            </Button>
            <Button size='lg' variant='outline' className='w-28' disabled={Number(page) >= totalPages} onClick={() => handleClick('next')}>
                Next
            </Button>
        </div>
    )
}
