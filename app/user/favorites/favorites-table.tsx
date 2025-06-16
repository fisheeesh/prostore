"use client"
import { Button } from '@/components/ui/button'
import { TableHeader, Table, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { toast } from '@/hooks/use-toast'
import { removeFromFavoritesAction } from '@/lib/actions/favorite.actions'
import { Favorite } from '@/types'
import { Loader } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useTransition } from 'react'

export default function FavoritesTable({ favorites }: { favorites?: Favorite }) {
    const [isPending, startTransition] = useTransition()

    const handleRemove = (id: string) => {
        startTransition(async () => {
            const res = await removeFromFavoritesAction(id)

            toast({
                variant: res?.success ? 'default' : 'destructive',
                description: res?.message
            })
        })
    }

    return (
        <>
            {!favorites || favorites.items.length === 0 ? (
                <div>
                    No Favorites Item. {' '}
                    <Link
                        href="/"
                        className="font-bold text-yellow-500 group transition-all"
                    >
                        Go Find Some. <span className="inline-block transform transition-transform duration-200 group-hover:translate-x-2">→</span>
                    </Link>
                </div>
            ) :
                (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="">Item</TableHead>
                                    <TableHead className="">Price</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {favorites.items.map((item) => (
                                    <TableRow key={item.slug}>
                                        <TableCell className="py-4">
                                            <Link href={`/product/${item.slug}`} className="flex items-center gap-3">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={50}
                                                    height={50}
                                                    className="rounded-md flex-shrink-0"
                                                />
                                                <span className="font-medium truncate">{item.name}</span>
                                            </Link>
                                        </TableCell>
                                        <TableCell className="">
                                            ${item.price}
                                        </TableCell>
                                        <TableCell className=" text-right">
                                            <Button onClick={() => handleRemove(item.productId)} disabled={isPending} type='button' variant='destructive'>
                                                {
                                                    isPending ?
                                                        <>
                                                            <Loader className="w-4 h-4 animate-spin" /> Remove
                                                        </> : 'Remove'
                                                }
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>)
            }
        </>
    )
}
