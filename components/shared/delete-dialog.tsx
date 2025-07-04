"use client"

import { useToast } from "@/hooks/use-toast"
import { useState, useTransition } from "react"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { Button } from "../ui/button"
import { Loader } from "lucide-react"

export default function DeleteDialog({ id, action }: { id: string, action: (id: string) => Promise<{ success: boolean, message: string }> }) {
    const [isPending, startTransition] = useTransition()
    const { toast } = useToast()
    const [open, setOpen] = useState(false)

    const handleDeleteClick = () => {
        startTransition(async () => {
            const res = await action(id)

            if (!res?.success) {
                toast({
                    variant: 'destructive',
                    description: res?.message
                })
            } else {
                setOpen(false)
                toast({
                    description: res?.message
                })
            }
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button size='sm' variant='destructive'>Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-sm w-[90%] mx-auto rounded-xl px-4">
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action can&apos;t be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button variant='destructive' size='sm' disabled={isPending} onClick={handleDeleteClick}>
                        {isPending ? (
                            <>
                                <Loader className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                            </>
                        ) : ('Delete')}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
