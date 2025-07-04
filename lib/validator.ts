import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constants";

/**
 *  * /^\d+(\.\d{2})?$/ -> regux has to write between //
 *  * ^ means start, \d means a digit, + menas 1 or more, \. means a dot, \d{2} means 2 digits
 *  * ? means optional () is a group
 *  * $ means end
 */

const currency = z
    .string()
    .refine(
        (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
        "Price must have exactly 2 decimal places."
    );

const baseInsertSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters." }),
    slug: z.string().min(3, { message: "Slug must be at least 3 characters." }),
    category: z.string().min(3, { message: "Category must be at least 3 characters." }),
    brand: z.string().min(3, { message: "Brand must be at least 3 characters." }),
    description: z.string().min(3, { message: "Description must be at least 3 characters." }),
    stock: z.coerce.number(),
    images: z.array(z.string()).min(1, { message: "Product must have at least 1 image." }),
    isFeatured: z.boolean(),
    banner: z.string().nullable().optional(),
    isDeal: z.boolean().optional(),
    dealDescription: z.string().nullable().optional(),
    endDate: z.string().nullable().optional(),
    price: currency,
    discount: currency,
});

export const insertProductSchema = baseInsertSchema.refine(
    data => Number(data.discount) <= Number(data.price),
    {
        message: "Discount must be less than or equal to the price.",
        path: ["discount"],
    }
);

export const updateProductSchema = baseInsertSchema.extend({
    id: z.string().min(1, { message: "Product ID is required." }),
}).refine(
    data => Number(data.discount) <= Number(data.price),
    {
        message: "Discount must be less than or equal to the price.",
        path: ["discount"],
    }
);

//* schema for signing users in
export const signInFormSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters." }),
});

//* schema for signing up a user
export const signUPFormSchema = z
    .object({
        name: z.string().min(3, { message: "Name must be at least 3 characters." }),
        email: z.string().email({ message: "Invalid email address." }),
        password: z
            .string()
            .min(6, { message: "Password must be at least 6 characters." }),
        confirmPassword: z
            .string()
            .min(6, { message: "ConfirmP assword must be at least 6 characters." }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match.",
        path: ["confirmPassword"],
    });

//* cart schemas
export const cartItemSchema = z.object({
    productId: z.string().min(1, { message: "Product is required." }),
    name: z.string().min(1, { message: "Name is required." }),
    slug: z.string().min(1, { message: "Slug is required." }),
    qty: z
        .number()
        .int()
        .nonnegative({ message: "Quantity must be a positive integer." }),
    image: z.string().min(1, { message: "Image is required." }),
    discount: currency,
    price: currency,
});

export const insertCartSchema = z.object({
    items: z.array(cartItemSchema),
    itemsPrice: currency,
    totalPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    sessionCartId: z.string().min(1, { message: "Session Cart ID is required." }),
    userId: z.string().optional().nullable(),
});

//* schema for shipping address
export const shippingAddressSchema = z.object({
    fullName: z
        .string()
        .min(3, { message: "Name must be at least 3 characters." }),
    phone: z.string().regex(/^0[1-9]\d{7,9}$/g, { message: "Invalid phone number." }),
    streetAddress: z
        .string()
        .min(3, { message: "Address must be at least 3 characters." }),
    city: z.string().min(3, { message: "City must be at least 3 characters." }),
    postalCode: z
        .string()
        .min(3, { message: "PostalCode must be at least 3 characters." }),
    country: z
        .string()
        .min(3, { message: "Country must be at least 3 characters." }),
    lat: z.number().optional(),
    lng: z.number().optional(),
});

//* schema for payment method
export const paymentMethodSchema = z
    .object({
        type: z.string().min(1, { message: "Payment method is required." }),
    })
    .refine((data) => PAYMENT_METHODS.includes(data.type), {
        message: "Invalid payment method.",
        path: ["type"],
    });

//* schema for inserting order
export const insertOrderSchema = z.object({
    userId: z.string().min(1, { message: "User ID is required." }),
    itemsPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    totalPrice: currency,
    paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
        message: "Invalid payment method.",
    }),
    shippingAddress: shippingAddressSchema,
});

//* schema for inserting orderItem
export const insertOrderItemSchema = z.object({
    productId: z.string(),
    slug: z.string(),
    image: z.string(),
    name: z.string(),
    price: currency,
    discount: currency,
    qty: z.number(),
});

//* schema for payment result
export const paymentResultSchema = z.object({
    id: z.string(),
    status: z.string(),
    email_address: z.string(),
    pricePaid: z.string(),
});

//* schema for updating user profile
export const updateProfileSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters." }),
    email: z
        .string()
        .email()
        .min(3, { message: "Email must be at least 3 characters." }),
});

//* schema to update user
export const updateUserSchema = updateProfileSchema.extend({
    id: z.string().min(1, { message: "User ID is required." }),
    role: z.string().min(1, { message: "Role is required." }),
});

//* schema for insert review
export const insertReviewSchema = z.object({
    userId: z.string().min(1, { message: "User ID is required." }),
    productId: z.string().min(1, { message: "Product ID is required." }),
    rating: z.coerce
        .number()
        .int()
        .min(1, { message: "Rating must be at least 1." })
        .max(5, { message: "Rating must be at most 5." }),
    title: z.string().min(3, { message: "Title must be at least 3 characters." }),
    description: z
        .string()
        .min(3, { message: "Description must be at least 3 characters." }),
});

//* schema for favoriteItemSchema
export const favoriteItemSchema = z.object({
    productId: z.string().min(1, { message: "Product ID is required." }),
    name: z.string().min(1, { message: "Name is required." }),
    slug: z.string().min(1, { message: "Slug is required." }),
    image: z.string().min(1, { message: "Image is required." }),
    price: currency,
});

//* schema for insert favorirte
export const insertFavoriteSchema = z.object({
    userId: z.string().min(1, { message: "User ID is required." }),
    items: z.array(favoriteItemSchema),
});
