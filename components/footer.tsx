import { APP_NAME } from "@/lib/constants"

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t">
            <div className="p-5 flex-center text-center">
                Copyright © {currentYear} {APP_NAME}. All Right reserved.
            </div>
        </footer>
    )
}
