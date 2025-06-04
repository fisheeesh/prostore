import DeleteDialog from "@/components/shared/delete-dialog"
import Pagination from "@/components/shared/pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getAllUsersAction } from "@/lib/actions/user.actions"
import { formatId } from '@/lib/utils'
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Admin Users"
}

export default async function AdminUsersPage(props: { searchParams: Promise<{ page: string }> }) {
    const { page = '1' } = await props.searchParams

    const users = await getAllUsersAction({ page: Number(page) })

    return (
        <div className='space-y-2'>
            <h2 className="h2-bold">Users</h2>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='whitespace-nowrap'>ID</TableHead>
                            <TableHead className='whitespace-nowrap'>NAME</TableHead>
                            <TableHead className='whitespace-nowrap'>EMAIL</TableHead>
                            <TableHead className='whitespace-nowrap'>ROLE</TableHead>
                            <TableHead className='whitespace-nowrap'>ACTION</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.data.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className='whitespace-nowrap'>{formatId(user.id)}</TableCell>
                                <TableCell className='whitespace-nowrap'>{user.name}</TableCell>
                                <TableCell className='whitespace-nowrap'>{user.email}</TableCell>
                                <TableCell className='whitespace-nowrap'>
                                    {user.role === 'user' ?
                                        (
                                            <Badge variant='secondary'>User</Badge>
                                        ) :
                                        (
                                            <Badge variant='default'>Admin</Badge>
                                        )
                                    }
                                </TableCell>
                                <TableCell className='flex items-center gap-2'>
                                    <Button asChild variant='outline' size='sm'>
                                        <Link href={`/user/${user.id}`}>
                                            Edit
                                        </Link>
                                    </Button>
                                    {/* DELETE */}
                                    {/* <DeleteDialog id={user.id} action={ } /> */}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {
                    users.totalPages > 1 && (
                        <Pagination page={Number(page) || 1} totalPages={users?.totalPages} />
                    )
                }
            </div>
        </div>
    )
}
