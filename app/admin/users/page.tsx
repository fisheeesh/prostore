import DeleteDialog from "@/components/shared/delete-dialog"
import Pagination from "@/components/shared/pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { deleteUserByIdAction, getAllUsersAction } from "@/lib/actions/user.actions"
import { formatId } from '@/lib/utils'
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Admin Users"
}

export default async function AdminUsersPage(props: { searchParams: Promise<{ page: string, query: string }> }) {
    const { page = '1', query: searchText } = await props.searchParams

    const users = await getAllUsersAction({ page: Number(page), query: searchText })

    return (
        <div className='space-y-2'>
            <div className="flex items-center gap-3">
                <h1 className="h2-bold">Users</h1>
                {
                    searchText && (
                        <div>
                            Filtered by: <i>&quot;{searchText}&quot;</i>{' '}
                            <Link href='/admin/products'>
                                <Button variant='outline' size='sm'>Remove Filter</Button>
                            </Link>
                        </div>
                    )
                }
            </div>
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
                                        <Link href={`/admin/users/${user.id}`}>
                                            Edit
                                        </Link>
                                    </Button>
                                    {/* DELETE */}
                                    <DeleteDialog id={user.id} action={deleteUserByIdAction} />
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
