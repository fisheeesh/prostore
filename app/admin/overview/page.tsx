import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getOrderSummary } from "@/lib/actions/order.actions"
import { requireAdmin } from "@/lib/auth-guard"
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/utils"
import { BadgeDollarSign, Barcode, CreditCard, Loader, Users } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import OverviewChart from "./over-chart"
import PaymentMethodsChart from "./payment-methods-chart"

export const metadata: Metadata = {
    title: 'Admin Dashboard'
}

export default async function AdminOverviewPage() {
    await requireAdmin()

    const summary = await getOrderSummary()

    return (
        <div className="space-y-4 w-full">
            <h2 className="h2-bold">Dashboard</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <BadgeDollarSign />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(summary.totalSales._sum.totalPrice?.toString() || 0)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sales</CardTitle>
                        <CreditCard />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatNumber(summary.ordersCount)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Customers</CardTitle>
                        <Users />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatNumber(summary.usersCount)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Products</CardTitle>
                        <Barcode />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatNumber(summary.productsCount)}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
                <Card className="lg:col-span-4 min-w-0">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto p-0">
                        <div className="p-6">
                            <OverviewChart data={{ salesData: summary.salesData }} />
                        </div>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3 w-full min-w-0">
                    <CardHeader>
                        <CardTitle>Payment Methods</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto p-0">
                        <div className="flex flex-col items-center justify-center gap-6 p-6">
                            <div className="flex flex-wrap justify-center gap-3">
                                {summary.payments.map((entry) => (
                                    <div
                                        key={entry.method}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: entry.color }}
                                        ></div>
                                        <span>{entry.method}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="w-full max-w-xs">
                                <PaymentMethodsChart data={summary.payments} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Card className="w-full min-w-0">
                <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="whitespace-nowrap">BUYERS</TableHead>
                                <TableHead className="whitespace-nowrap">DATE</TableHead>
                                <TableHead className="whitespace-nowrap">PAYMENT TYPE</TableHead>
                                <TableHead className="whitespace-nowrap">PAID</TableHead>
                                <TableHead className="whitespace-nowrap">DELIVERED</TableHead>
                                <TableHead className="whitespace-nowrap">STATUS</TableHead>
                                <TableHead className="whitespace-nowrap">TOTAL</TableHead>
                                <TableHead className="whitespace-nowrap">ACTIONS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                summary.latestSales.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="whitespace-nowrap">
                                            {order?.user?.name ? order.user.name : 'Deleted User'}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            {formatDateTime(order.createdAt).dateOnly}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            {order.paymentMethod}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            {order.isPaid ? 'Paid' : 'Unpaid'}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            {order.isDelivered ? 'Delivered' : 'Not Delivered'}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            {
                                                order.isPaid && order.isDelivered ? (
                                                    <Badge variant="outline" className="flex items-center text-muted-foreground gap-2 w-fit">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" className="size-3.5">
                                                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                        </svg>
                                                        Done
                                                    </Badge>
                                                )
                                                    : (
                                                        <Badge variant="outline" className="flex text-muted-foreground items-center gap-2 w-fit">
                                                            <Loader className="size-3" />
                                                            In Process
                                                        </Badge>
                                                    )
                                            }
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            {formatCurrency(order.totalPrice)}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            <Button asChild variant='outline'>
                                                <Link href={`/order/${order.id}`}>
                                                    <span className="px-2">Details</span>
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}