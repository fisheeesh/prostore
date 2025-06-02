import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { EllipsisVertical, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import ModeToggle from './mode-toggle'
import UserButton from './user-button'
import { Input } from '@/components/ui/input'

export default function Menu() {
    return (
        <div className='flex justify-end gap-3'>
            <div>
                <Input type="search" placeholder="Search..." className="md:w-[100px] lg:w-[300px]" />
            </div>
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
                        <ModeToggle />
                        <Button asChild variant='ghost'>
                            <Link href='/cart'>
                                <ShoppingCart /> Cart
                            </Link>
                        </Button>
                        <UserButton />
                        <SheetDescription></SheetDescription>
                    </SheetContent>
                </Sheet>
            </nav>
        </div>
    )
}
