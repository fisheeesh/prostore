"use client"

import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { toggleFavoriteAction } from '@/lib/actions/favorite.actions'
import { Favorite, FavoriteItem } from '@/types'
import { Heart, Loader } from 'lucide-react'
import { useTransition } from 'react'

export default function FavoriteButton({ favorites, item }: { favorites?: Favorite, item: FavoriteItem }) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const isFavorited = favorites && favorites.items.find(i => i.productId === item.productId)

  const handleToogleFavorite = () => {
    startTransition(async () => {
      const res = await toggleFavoriteAction(item)

      toast({
        variant: res?.success ? 'default' : 'destructive',
        description: res?.message
      })
    })
  }

  return (
    <Button onClick={handleToogleFavorite} disabled={isPending} type="button" variant='outline' className="rounded-full flex items-center gap-2">
      {isPending ? <Loader className="w-4 h-4 animate-spin" /> : isFavorited ? <Heart className="w-4 h-4" fill='red' stroke='red' /> : <Heart className="w-4 h-4" />}
      {/* <span>1</span> */}
    </Button>
  )
}
