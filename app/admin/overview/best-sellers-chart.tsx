"use client"

import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

export default function BestSellerChart({
    data: { bestSellersData },
}: {
    data: {
        bestSellersData: {
            month: string
            productName: string
            totalSold: number
        }[]
    }
}) {
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const { productName, totalSold } = payload[0].payload
            return (
                <div className="rounded bg-white p-2 text-sm shadow text-black">
                    <p className="font-medium">{`${productName}: ${totalSold} sold${totalSold <= 1 ? '' : 's'}`}</p>
                </div>
            )
        }
        return null
    }

    return (
        <div className="w-full overflow-x-auto">
            <div style={{ minWidth: `${bestSellersData.length * 80}px`, height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bestSellersData}>
                        <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="month"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={true}
                            axisLine={true}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey="totalSold"
                            fill="currentColor"
                            radius={[4, 4, 0, 0]}
                            className="fill-primary"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}