import { deleteOrder, getAllOrders } from '@/lib/actions/order.actions'
import { requireAdmin } from '@/lib/auth-guard'
import { Metadata } from 'next'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils'
import Link from 'next/link'
import Pagination from '@/components/shared/pagination'
import { Button } from '@/components/ui/button'
import DeleteDialog from '@/components/shared/delete-dialog'

export const metadata: Metadata = {
    title: 'Admin Orders'
}

export default async function AdminOrdersPage(props: { searchParams: Promise<{ page: string }> }) {
    await requireAdmin()
    const { page = '1' } = await props.searchParams

    const orders = await getAllOrders({ page: Number(page) })

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
                                <TableCell className='flex items-center gap-2'>
                                    <Button asChild variant='outline' size='sm'>
                                        <Link href={`/order/${order.id}`}>
                                            Details
                                        </Link>
                                    </Button>
                                    {/* DELETE */}
                                    <DeleteDialog id={order.id} action={deleteOrder} />
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
