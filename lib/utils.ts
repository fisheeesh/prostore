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
export async function formatErrors(error: any) {
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