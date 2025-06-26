"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Product } from "@/types"

//* Function to calculate the time remaining
const calculateTimeRemaining = (targetDate: Date) => {
    const currentTime = new Date()
    const timeDifferent = Math.max(Number(targetDate) - Number(currentTime), 0)

    return {
        days: Math.floor(timeDifferent / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
            (timeDifferent % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor(
            (timeDifferent % (1000 * 60 * 60)) / (1000 * 60)
        ),
        seconds: Math.floor(
            (timeDifferent % (1000 * 60)) / (1000)
        ),
    }
}

export default function DealCountdown({ data }: { data: Product }) {
    const [time, setTime] = useState<ReturnType<typeof calculateTimeRemaining>>()

    useEffect(() => {
        //* Calculate initial time on client
        setTime(calculateTimeRemaining(new Date(data.endDate ?? "")))

        const timerInterval = setInterval(() => {
            const newTime = calculateTimeRemaining(new Date(data.endDate ?? ""))
            setTime(newTime)

            if (newTime.days === 0 && newTime.hours === 0 && newTime.minutes === 0 && newTime.seconds === 0) {
                clearInterval(timerInterval)

                fetch("/api/set-deal-status", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ productId: data.id }),
                }).then(res => {
                    if (!res.ok) console.error("Failed to update deal status")
                }).catch(err => {
                    console.error("Error updating deal:", err)
                })
            }

            return () => clearInterval(timerInterval)
        }, 1000)
    }, [data.endDate, data.id])

    if (!time) {
        return (
            <section className="grid grid-cols-1 md:grid-cols-2 my-20">
                <div className="flex flex-col gap-2 justify-center">
                    <h3 className="text-3xl font-bold">Loading Countdown...</h3>
                </div>
            </section>
        )
    }

    if (time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
        return (
            <section className="grid grid-cols-1 md:grid-cols-2 my-20">
                <div className="flex flex-col gap-2 justify-center">
                    <h3 className="text-3xl font-bold">Deal Has Ended.</h3>
                    <p>
                        This deal is no longer available. Check back soon for the next deal!
                    </p>
                    <div className="text-center">
                        <Button asChild>
                            <Link href='/search'>View Products</Link>
                        </Button>
                    </div>
                </div>
                <div className="flex justify-center">
                    <Image
                        src={'/images/promo.jpg'}
                        alt="Promotions"
                        width={300}
                        height={200}
                    />
                </div>
            </section>
        )
    }
    return (
        <section className="grid grid-cols-1 gap-8 md:grid-cols-2 my-20">
            <div className="flex flex-col gap-4 justify-center">
                <h3 className="text-3xl font-bold">Deal of The Month</h3>
                <p>
                    {data.dealDescription}
                </p>
                <ul className="grid grid-cols-4">
                    <StatBox label='Days' value={time.days} />
                    <StatBox label='Hours' value={time.hours} />
                    <StatBox label='Minutes' value={time.minutes} />
                    <StatBox label='Seconds' value={time.seconds} />
                </ul>
                <div className="text-center">
                    <Button asChild>
                        <Link href={`/product/${data.slug}`}>View Product</Link>
                    </Button>
                </div>
            </div>
            <div className="flex justify-center">
                <Image
                    src={'/images/promo.jpg'}
                    alt="Promotions"
                    width={300}
                    height={200}
                />
            </div>
        </section>
    )
}

const StatBox = ({ label, value }: { label: string, value: number }) => (
    <li className="p-4 w-full text-center">
        <p className="text-3xl font-bold">{value}</p>
        <p>{label}</p>
    </li>
)
