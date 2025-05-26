"use server"

import { CartItem } from "@/types"

export async function addItemToCartAction(data: CartItem) {

    return { success: true, message: 'Item added to cart.' }
}