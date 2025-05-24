"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import { useState } from "react"

export default function ProductImages({ images }: { images: string[] }) {
    const [current, setCurrent] = useState(0)

    return (
        <div className="wrapper space-y-4">
            <Image
                src={images[current]}
                alt="product image"
                width={1000}
                height={1000}
                priority={true}
                className="min-h-[300px] object-cover object-center" />
            <div className="flex">
                {images.map((image, index) => (
                    <div key={image} className={cn("cursor-pointer border hover:border-yellow-600 mr-2", current === index && " border-yellow-500")} onClick={() => setCurrent(index)}>
                        <Image
                            src={image}
                            alt={`product image ${index}`}
                            width={100}
                            height={100}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
