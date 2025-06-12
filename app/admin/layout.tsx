import Menu from "@/components/shared/header/menu";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import MainNav from "./main-nav";
import AdminSearch from "@/components/admin/admin-search";

export default function UserLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
            <header className="w-full border-b ">
                <div className="wrapper flex-between">
                    <div className="flex-start">
                        <Link href={'/'} className="flex-start">
                            <Image src='/images/logo.svg' alt={`${APP_NAME} logo`} height={48} width={48} priority={true} />
                            {/* <span className="hidden font-bold text-2xl ml-3 lg:block">{APP_NAME}</span> */}
                        </Link>
                        <MainNav className="mx-6" />
                    </div>
                    <div className='flex items-center justify-end gap-3'>
                        <div className="hidden md:block">
                            <AdminSearch />
                        </div>
                        <Menu />
                    </div>
                </div>
            </header>
            <div className="flex-1 wrapper">{children}</div>
        </>
    );
}