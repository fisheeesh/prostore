"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import { useState } from "react"

export default function ProductImages({ images }: { images: string[] }) {
    const [current, setCurrent] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    return (
        <div className="wrapper space-y-4">
            <div className="relative w-full min-h-[300px] rounded-xl overflow-hidden">
                {isLoading && (
                    <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl" />
                )}
                <Image
                    src={images[current]}
                    alt="product image"
                    width={1000}
                    height={1000}
                    quality={80}
                    priority
                    className={cn(
                        "object-cover object-center transition-opacity duration-300 w-full h-full",
                        isLoading ? "opacity-0" : "opacity-100"
                    )}
                    onLoad={() => setIsLoading(false)}
                />
            </div>
            <div className="flex">
                {images.map((image, index) => (
                    <div
                        key={image}
                        className={cn(
                            "cursor-pointer border hover:border-yellow-600 mr-2",
                            current === index && "border-yellow-500"
                        )}
                        onClick={() => {
                            setCurrent(index)
                            setIsLoading(true)
                        }}
                    >
                        <Image
                            src={image}
                            alt={`product image ${index}`}
                            width={100}
                            height={100}
                            className="object-cover object-center"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}