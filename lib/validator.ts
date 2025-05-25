import { z } from 'zod'
import { formatNumberWithDecimal } from './utils'

/**
 *  * /^\d+(\.\d{2})?$/ -> regux has to write between //
 *  * ^ means start, \d means a digit, + menas 1 or more, \. means a dot, \d{2} means 2 digits
 *  * ? means optional () is a group
 *  * $ means end
 */

const currency = z
    .string()
    .refine(value => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
        "Price must have exactly 2 decimal places.")

export const insertProductSchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
    slug: z.string().min(3, { message: 'Slug must be at least 3 characters.' }),
    category: z.string().min(3, { message: 'Category must be at least 3 characters.' }),
    brand: z.string().min(3, { message: 'Brand must be at least 3 characters.' }),
    description: z.string().min(3, { message: 'Description must be at least 3 characters.' }),
    stock: z.coerce.number(),
    images: z.array(z.string()).min(1, { message: "Product must have at leat 1 image." }),
    isFeatured: z.boolean(),
    banner: z.string().nullable(),
    price: currency
})

//* schema for signing users in
export const signInFormSchema = z.object({
    email: z.string()
        .email({ message: 'Invalid email address.' }),
    password: z.string()
        .min(6, { message: 'Password must be at least 6 characters.' })
})