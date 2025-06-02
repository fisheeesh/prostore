"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

const navLinks = [
    {
        title: "Overview",
        href: '/admin/overview'
    },
    {
        title: 'Products',
        href: '/admin/products'
    },
    {
        title: 'Orders',
        href: '/admin/orders'
    },
    {
        title: 'Users',
        href: '/admin/users'
    },
]

export default function MainNav({ className, ...props }: React.HtmlHTMLAttributes<HTMLElement>) {
    const pathname = usePathname()

    return (
        <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
            {navLinks.map((link) => (
                <Link className={cn('text-sm font-medium transition-colors duration-300 hover:text-primary', pathname.includes(link.href) ? '' : 'text-muted-foreground')} key={link.href} href={link.href}>
                    {link.title}
                </Link>
            ))}
        </nav>
    )
}
