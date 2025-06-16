"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { FavoriteItem } from "@/types";
import { revalidatePath } from "next/cache";
import { convertToPlainObject, formatErrors } from "../utils";
import { favoriteItemSchema, insertFavoriteSchema } from "../validator";

export async function toggleFavoriteAction(data: FavoriteItem) {
  try {
    const session = await auth()
    if (!session) throw new Error('User not found. Please sign in to continue.')

    const item = favoriteItemSchema.parse(data)

    const favorites = await getMyFavorites()

    const product = await prisma.product.findFirst({
      where: { id: item.productId }
    })
    if (!product) throw new Error('Product not found.')

    if (!favorites) {
      const newFavorites = insertFavoriteSchema.parse({
        userId: session.user?.id,
        items: [item]
      })

      await prisma.favorite.create({
        data: newFavorites
      })

      revalidatePath(`/product/${product.slug}`)

      return { success: true, message: 'Added to favorites.' }
    } else {
      const exist = favorites.items.find(i => i.productId === item.productId)

      if (exist) {
        const newFavorites = insertFavoriteSchema.parse({
          userId: session.user?.id,
          items: favorites.items.filter(i => i.productId !== item.productId)
        })

        await prisma.favorite.update({
          where: { id: favorites.id },
          data: newFavorites
        })
      }
      else {
        const newFavorites = insertFavoriteSchema.parse({
          userId: session.user?.id,
          items: [...favorites.items, item]
        })

        await prisma.favorite.update({
          where: { id: favorites.id },
          data: newFavorites
        })
      }

      revalidatePath(`/product/${product.slug}`)

      return { success: true, message: exist ? 'Removed from favorites.' : 'Added to favorites.' }
    }
  } catch (error) {
    return { succcess: false, message: formatErrors(error) };
  }
}

export async function removeFromFavoritesAction(id: string) {
  try {
    const session = await auth()
    if (!session) throw new Error('User not found. Please sign in to continue.')

    const favorites = await getMyFavorites()

    if (!favorites) throw new Error('Favorites not found.')

    const newFavorites = insertFavoriteSchema.parse({
      userId: session.user?.id,
      items: favorites.items.filter(i => i.productId !== id)
    })

    await prisma.favorite.update({
      where: { id: favorites.id },
      data: newFavorites
    })

    revalidatePath(`/user/favorites`)

    return { success: true, message: 'Removed from favorites.' }
  } catch (error) {
    return { succcess: false, message: formatErrors(error) };
  }
}

export async function getMyFavorites() {
  const session = await auth()
  if (!session) throw new Error('User not found. Please sign in to continue.')

  const favorites = await prisma.favorite.findFirst({
    where: { userId: session.user?.id }
  })

  if (!favorites) return undefined

  return convertToPlainObject({
    ...favorites,
    items: favorites.items as FavoriteItem[]
  })
}
