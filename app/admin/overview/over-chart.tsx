"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'

export default function OverViewChart({ data: { salesData } }: {
    data: {
        salesData: { month: string, totalSales: number }[]
    }
}) {
    return (
        <ResponsiveContainer width='100%' height={350}>
            <BarChart data={salesData}>
                <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey='month' stroke='#888888' fontSize={12} tickLine={true} axisLine={true} />
                <YAxis stroke='#888888' fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Bar dataKey='totalSales' fill='currentColor' radius={[4, 4, 0, 0]} className='fill-primary' />
            </BarChart>
        </ResponsiveContainer>
    )
}
