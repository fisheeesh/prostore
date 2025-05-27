import { CartItem } from "@/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//* convert prisma object into plain object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

//* format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [intValue, decimalValue] = num.toString().split('.')

  return decimalValue ? `${intValue}.${decimalValue.padEnd(2, '0')}` : `${intValue}.00`
}

//* format errors
// [
//   {
//     code: 'too_small',
//     minimum: 3,
//     type: 'string',
//     inclusive: true,
//     exact: false,
//     message: 'Name must be at least 3 characters.',
//     path: [ 'name' ]
//   },
//   {
//     validation: 'email',
//     code: 'invalid_string',
//     message: 'Invalid email address.',
//     path: [ 'email' ]
//   }
// ]
export function formatErrors(error: any) {
  if (error.name === 'ZodError') {
    //* Handle Zod errors
    const fieldErrors = Object.keys(error.errors).map(field => error.errors[field].message)

    return fieldErrors.join(' ')
  }
  else if (error.name === 'PrismaClientKnownRequestError' && error.code === 'P2002') {
    //* Handle Prisma errors
    const field = error.meta?.target ? error.meta.target[0] : 'Field'

    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`
  }
  else {
    //* Handle other errors
    return typeof error.message === 'string' ? error.message : JSON.stringify(error.message)
  }
}

//* Round number to 2 decimal places
//* 12.345 => 1234.5 => 1235 => 12.35
export function round2(value: number | string) {
  if (typeof value === 'number') {
    return Math.round((value + Number.EPSILON) * 100) / 100
  }
  else if (typeof value === 'string') {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100
  }
  else {
    throw new Error('Value is not a number or string')
  }
}

export function calcPrice(items: CartItem[]) {
  const itemsPrice = round2(items.reduce((acc, item) => acc + (Number(item.price) * item.qty), 0)),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(0.15 * itemsPrice),
    totalPrice = round2(itemsPrice + shippingPrice + taxPrice)

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  }
}