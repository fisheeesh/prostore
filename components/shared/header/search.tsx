import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getAllCategoriesAction } from '@/lib/actions/product.actions'
import { SearchIcon } from 'lucide-react'
import React from 'react'

export default async function Search() {
    const categories = await getAllCategoriesAction()

    return (
        <form action='/search' method='GET'>
            <div className='flex flex-col md:flex-row md:items-center w-full max-w-sm md:space-x-2 space-y-2 md:space-y-0'>
                <Select name='category'>
                    <SelectTrigger className='lg:w-[180px]'>
                        <SelectValue placeholder='All' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem key='All' value='all'>All</SelectItem>
                        {
                            categories.map(x => (
                                <SelectItem key={x.category} value={x.category}>{x.category}</SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
                <div className='flex items-center space-x-2'>
                    <Input
                        placeholder='Search...'
                        name='q'
                        type='text'
                        className='md:w-[100px] lg:w-[200px]'
                    />
                    <Button>
                        <SearchIcon />
                    </Button>
                </div>
            </div>
        </form>
    )
}   
