"use client"

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip
} from 'recharts'

export default function OverViewChart({ data: { salesData } }: {
    data: {
        salesData: { month: string, totalSales: number }[]
    }
}) {
    return (
        <div className="w-full overflow-x-auto">
            <div style={{ minWidth: `${salesData.length * 70}px`, height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData}>
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey='month'
                            stroke='#888888'
                            fontSize={12}
                            tickLine={true}
                            axisLine={true}
                        />
                        <YAxis
                            stroke='#888888'
                            fontSize={12}
                            tickLine={true}
                            axisLine={true}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                        <Area
                            type="monotone"
                            dataKey="totalSales"
                            stroke="#82ca9d"
                            fillOpacity={1}
                            fill="url(#colorSales)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}