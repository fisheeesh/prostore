import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { EllipsisVertical, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import ModeToggle from './mode-toggle'
import Search from './search'
import UserButton from './user-button'
import { auth } from '@/auth'
import AdminSearch from '@/components/admin/admin-search'
import { Badge } from '@/components/ui/badge'
import { getMyCart } from '@/lib/actions/cart.actions'

export default async function Menu() {
    const session = await auth()
    const myCart = await getMyCart()

    return (
        <div className='flex items-center justify-end gap-3'>
            <nav className='hidden md:flex w-full max-w-xs gap-2.5'>
                <ModeToggle />
                <Button variant='outline' size='icon' className='relative' asChild>
                    <Link href='/cart' className='relative'>
                        {
                            !!myCart?.items.length &&
                            <Badge variant='destructive' className="absolute z-30 -right-2 -top-2 h-5 w-5 rounded-full text-xs p-1 flex items-center justify-center">
                                {myCart?.items.length}
                            </Badge>
                        }
                        <ShoppingCart />
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
                            <Button variant='outline' size='icon' className='relative' asChild>
                                <Link href='/cart' className='relative'>
                                    {
                                        !!myCart?.items.length &&
                                        <Badge variant='destructive' className="absolute z-30 -right-2 -top-2 h-5 w-5 rounded-full text-xs p-1 flex items-center justify-center">
                                            {myCart?.items.length}
                                        </Badge>
                                    }
                                    <ShoppingCart />
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
