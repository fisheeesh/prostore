import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getOrderSummary } from "@/lib/actions/order.actions"
import { requireAdmin } from "@/lib/auth-guard"
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/utils"
import { BadgeDollarSign, Barcode, CreditCard, Users } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import Charts from "./charts"

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
                <Card className="lg:col-span-4 w-full min-w-0">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto p-0">
                        <div className="min-w-[400px] p-6">
                            <Charts data={{ salesData: summary.salesData }} />
                        </div>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3 min-w-0">
                    <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="whitespace-nowrap">BUYERS</TableHead>
                                    <TableHead className="whitespace-nowrap">DATE</TableHead>
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
                                                {formatCurrency(order.totalPrice)}
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">
                                                <Link href={`/order/${order.id}`}>
                                                    <span className="px-2">Details</span>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}