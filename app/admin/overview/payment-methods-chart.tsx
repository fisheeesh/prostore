"use client"

import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

interface PaymentChartProps {
    data: {
        method: string,
        count: number,
        color: string
    }[]
}


export default function PaymentMethodsChart({ data }: PaymentChartProps) {
    return (
        <ResponsiveContainer width='100%' height={330}>
            <PieChart>
                <Pie
                    data={data}
                    nameKey={"method"}
                    dataKey={"count"}
                    innerRadius={70}
                    outerRadius={110}
                    cx={"50%"}
                    cy={"50%"}
                    paddingAngle={3}
                >
                    {data.map((entry) => (
                        <Cell
                            key={entry.method}
                            fill={entry.color}
                            stroke={entry.color}
                        />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    )
}
