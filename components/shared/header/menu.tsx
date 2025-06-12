import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { EllipsisVertical, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import ModeToggle from './mode-toggle'
import Search from './search'
import UserButton from './user-button'
import { auth } from '@/auth'
import AdminSearch from '@/components/admin/admin-search'

export default async function Menu() {
    const session = await auth()

    return (
        <div className='flex items-center justify-end gap-3'>
            <nav className='hidden md:flex w-full max-w-xs gap-1'>
                <ModeToggle />
                <Button asChild variant='ghost'>
                    <Link href='/cart'>
                        <ShoppingCart /> Cart
                    </Link>
                </Button>
                <UserButton />
            </nav>
            <nav className='md:hidden'>
                <Sheet>
                    <SheetTrigger className='align-middle'>
                        <EllipsisVertical />
                    </SheetTrigger>
                    <SheetContent className='flex flex-col items-start'>
                        <SheetTitle>Menu</SheetTitle>
                        <div className='flex items-center space-x-2'>
                            <ModeToggle />
                            <Button asChild variant='ghost'>
                                <Link href='/cart'>
                                    <ShoppingCart /> Cart
                                </Link>
                            </Button>
                            <UserButton />
                        </div>
                        {
                            session?.user?.role === 'admin' &&
                            <>
                                <SheetDescription>Admin Search</SheetDescription>
                                <AdminSearch />
                            </>
                        }
                        <SheetDescription>Products Search</SheetDescription>
                        <Search />
                    </SheetContent>
                </Sheet>
            </nav>
        </div>
    )
}
