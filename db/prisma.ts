import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@/lib/generated/prisma';
import ws from 'ws';

//* Sets up WebSocket connections, which enables Neon to use WebSocket communication.
neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;

//* Instantiates the Prisma adapter using the Neon connection pool to handle the connection between Prisma and Neon.
const adapter = new PrismaNeon({ connectionString });

/**
 ** WHY TWO SEPARATE PRISMA CLIENTS?
 * 
 ** NextAuth's PrismaAdapter Requirements:
 ** - NextAuth's PrismaAdapter needs a CLEAN, UNMODIFIED Prisma client
 ** - It manages its own tables: User, Account, Session, VerificationToken
 ** - Extensions can interfere with the adapter's internal operations
 ** - Custom result transformers can cause type conflicts with NextAuth's expected data structure
 ** - If NextAuth used extended client, it might try to transform auth-related fields that don't exist
 ** - This could break the adapter's internal queries and cause authentication failures
 */

//* Standard Prisma client for NextAuth (without extensions)
//* PURPOSE: Handles NextAuth's authentication tables ONLY
//* USAGE: User creation, account linking, session management in auth callbacks
export const prismaAuth = new PrismaClient({ adapter });

//* Extended PrismaClient with custom result transformers for your application
//* PURPOSE: Handles your business logic with price transformations, cart operations, etc.
//* USAGE: Product queries, cart operations, order management in your app logic
export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      //* Convert Decimal prices to strings for frontend consumption
      price: {
        compute(product) {
          return product.price.toString();
        },
      },
      discount: {
        compute(product) {
          return product.discount.toString();
        },
      },
      rating: {
        compute(product) {
          return product.rating.toString();
        },
      },
    },
    cart: {
      itemsPrice: {
        needs: { itemsPrice: true },
        compute(cart) {
          return cart.itemsPrice.toString()
        }
      },
      shippingPrice: {
        needs: { shippingPrice: true },
        compute(cart) {
          return cart.shippingPrice.toString()
        }
      },
      taxPrice: {
        needs: { taxPrice: true },
        compute(cart) {
          return cart.taxPrice.toString()
        }
      },
      totalPrice: {
        needs: { totalPrice: true },
        compute(cart) {
          return cart.totalPrice.toString()
        }
      },
    },
    order: {
      itemsPrice: {
        needs: { itemsPrice: true },
        compute(order) {
          return order.itemsPrice.toString()
        }
      },
      shippingPrice: {
        needs: { shippingPrice: true },
        compute(order) {
          return order.shippingPrice.toString()
        }
      },
      taxPrice: {
        needs: { taxPrice: true },
        compute(order) {
          return order.taxPrice.toString()
        }
      },
      totalPrice: {
        needs: { totalPrice: true },
        compute(order) {
          return order.totalPrice.toString()
        }
      },
    },
    orderItem: {
      price: {
        compute(orderItem) {
          return orderItem.price.toString()
        }
      },
      discount: {
        compute(orderItem) {
          return orderItem.discount.toString()
        }
      },
    }
  },
});