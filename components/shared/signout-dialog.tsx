"use client"

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { signOutUserAction } from '@/lib/actions/user.actions'
import { Button } from '../ui/button'
import { useTransition } from 'react'
import { Loader, LogOut } from 'lucide-react'

export default function SignOutDialog() {
    const [isPending, startTransition] = useTransition()

    const handleSignOut = () => {
        startTransition(async () => {
            await signOutUserAction()
        })
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant='ghost' className='w-full py-4 px-2 h-4 justify-start flex items-center gap-3'>
                    <LogOut />
                    Sign Out
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-sm w-[90%] mx-auto rounded-xl px-4">
                <AlertDialogHeader>
                    <AlertDialogTitle>Sign Out Confirmation.</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are your sure you want to sign out?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>No</AlertDialogCancel>
                    <form action={handleSignOut}>
                        <Button disabled={isPending} type="submit" size='default' className='w-full'>
                            {
                                isPending
                                    ?
                                    <>
                                        <Loader className="animate-spin w-4 h-4" /> Signing out...
                                    </>
                                    : 'Confirm'
                            }
                        </Button>
                    </form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
