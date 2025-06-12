import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { UserIcon } from 'lucide-react'
import Link from 'next/link'
import SignOutDialog from '../signout-dialog'

export default async function UserButton() {
    const session = await auth()

    if (!session) {
        return (
            <Button asChild>
                <Link href={'/sign-in'}>
                    <UserIcon />Sign In
                </Link>
            </Button>
        )
    }

    const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? ''

    return (
        <div className='flex gap-2 items-center'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="flex items-center">
                        <Button variant='ghost' className='relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-200 dark:text-black dark:hover:bg-gray-400'>
                            {firstInitial}
                        </Button>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56' align='end' forceMount>
                    <DropdownMenuLabel className='font-normal'>
                        <div className="flex flex-col space-y-1">
                            <div className="text-sm font-medium leading-none">{session.user?.name}</div>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <div className="text-sm text-muted-foreground leading-none">{session.user?.email}</div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuItem>
                        <Link href={'/user/profile'} className='w-full'>My Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href={'/user/orders'} className='w-full'>Order History</Link>
                    </DropdownMenuItem>
                    {/* Check next.auth.d.ts */}
                    {session?.user?.role === 'admin' && (
                        <DropdownMenuItem>
                            <Link href='/admin/overview' className='w-full'>Admin</Link>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className='p-0 mb-1' asChild>
                        <SignOutDialog />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}