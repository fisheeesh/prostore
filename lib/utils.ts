import { CartItem } from "@/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import qs from "query-string"

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

export const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 2
})

export function formatCurrency(amount: number | string | null) {
  if (typeof amount === 'number') {
    return CURRENCY_FORMATTER.format(amount)
  }
  else if (typeof amount === 'string') {
    return CURRENCY_FORMATTER.format(Number(amount))
  }
  else {
    return 'NaN'
  }
}

//* Format number
const NUMBER_FOMATTER = new Intl.NumberFormat('en-US')

export function formatNumber(number: number) {
  return NUMBER_FOMATTER.format(number)
}

//* Shorten uuid
//* 87338752-b273-4529-8233-082f1778db0c -> ..78db0c
export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`;
}

//* Format data & time
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'en-US',
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    'en-US',
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    'en-US',
    timeOptions
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

// const testDate = new Date('2023-10-25T10:30:00.000Z')
// const formatted = formatDateTime(testDate)
// console.log('DateTime', formatted.dateTime)
// console.log('Date', formatted.dateOnly)
// console.log('Time', formatted.timeOnly)

//* Form the pagination links
export function formURLQurey({ params, key, value }: { params: string, key: string, value: string | null }) {
  //* Turns current params into obj
  const query = qs.parse(params)

  //* Turns the obj with the page we wanna go to
  query[key] = value

  //* Build the url
  return qs.stringifyUrl({
    url: window.location.pathname,
    query
  }, {
    skipNull: true
  })
}
