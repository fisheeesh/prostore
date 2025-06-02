import Pagination from '@/components/shared/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getMyOrders } from '@/lib/actions/order.actions'
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'My Orders'
}

export default async function OrdersPage(props: { searchParams: Promise<{ page: string }> }) {
    const { page } = await props.searchParams

    const orders = await getMyOrders({ page: Number(page) || 1 })

    return (
        <div className='space-y-2'>
            <h2 className="h2-bold">Orders</h2>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='whitespace-nowrap'>ORDER ID</TableHead>
                            <TableHead className='whitespace-nowrap'>DATE</TableHead>
                            <TableHead className='whitespace-nowrap'>TOTAL</TableHead>
                            <TableHead className='whitespace-nowrap'>PAID</TableHead>
                            <TableHead className='whitespace-nowrap'>DELIVERED</TableHead>
                            <TableHead className='whitespace-nowrap'>ACTION</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.data.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className='whitespace-nowrap'>{formatId(order.id)}</TableCell>
                                <TableCell className='whitespace-nowrap'>{formatDateTime(order.createdAt).dateTime}</TableCell>
                                <TableCell className='whitespace-nowrap'>{formatCurrency(order.totalPrice)}</TableCell>
                                <TableCell className='whitespace-nowrap'>{order.isPaid && order.paidAt ? formatDateTime(order.paidAt).dateTime : 'Not Paid'}</TableCell>
                                <TableCell className='whitespace-nowrap'>{order.isDelivered && order.deliveredAt ? formatDateTime(order.deliveredAt).dateTime : 'Not Delivered'}</TableCell>
                                <TableCell>
                                    <Link href={`/order/${order.id}`}>
                                        <span className='px-2'>Details</span>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {
                    orders.totalPages > 1 && (
                        <Pagination page={Number(page) || 1} totalPages={orders?.totalPages} />
                    )
                }
            </div>
        </div>
    )
}
