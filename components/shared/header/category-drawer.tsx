import { Button } from '@/components/ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { getAllCategoriesAction } from '@/lib/actions/product.actions'
import { MenuIcon } from 'lucide-react'
import Link from 'next/link'

export default async function CategoryDrawer() {
    const categories = await getAllCategoriesAction()

    return (
        <Drawer direction='left'>
            <DrawerTrigger asChild>
                <Button variant='outline'>
                    <MenuIcon />
                </Button>
            </DrawerTrigger>
            <DrawerContent className="h-full max-w-sm rounded-none">
                <DrawerHeader>
                    <DrawerTitle>Select Category</DrawerTitle>
                    <div className="space-y-1 mt-4">
                        {categories.map(x => (
                            <Button asChild variant='ghost' key={x.category} className='w-full justify-start'>
                                <DrawerClose asChild>
                                    <Link href={`/search?category=${x.category}`}>{x.category} ({x._count})</Link>
                                </DrawerClose>
                            </Button>
                        ))}
                    </div>
                </DrawerHeader>
            </DrawerContent>
        </Drawer>
    )
}
