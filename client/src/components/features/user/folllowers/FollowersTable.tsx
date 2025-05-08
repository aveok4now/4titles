'use client'

import { Button } from '@/components/ui/common/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/common/dropdown-menu'
import { ConfirmDialog } from '@/components/ui/elements/ConfirmDialog'
import {
    DataTable,
    DataTableSkeleton,
} from '@/components/ui/elements/data-table/DataTable'
import { DataTableColumnHeader } from '@/components/ui/elements/data-table/DataTableColumnHeader'
import { Heading } from '@/components/ui/elements/Heading'
import { ProfileAvatar } from '@/components/ui/elements/ProfileAvatar'
import {
    FindFollowersQuery,
    useFindFollowersQuery,
    useRemoveFollowerMutation,
} from '@/graphql/generated/output'
import { formatDate } from '@/utils/format-date'
import { ColumnDef } from '@tanstack/react-table'
import { Copy, MoreHorizontal, User, UserMinus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

export function FollowersTable() {
    const t = useTranslations('dashboard.followers')

    const [followerToRemove, setFollowerToRemove] = useState<string | null>(
        null,
    )
    const [
        isRemoveFollowerConfirmDialogOpen,
        setIsRemoveFollowerConfirmDialogOpen,
    ] = useState(false)

    const {
        data,
        loading: isLoadingFollowers,
        refetch,
    } = useFindFollowersQuery()
    const followers = data?.findUserFollowers ?? []

    const [removeFollower, { loading: isLoadingFollowerRemove }] =
        useRemoveFollowerMutation({
            onCompleted() {
                toast.success(t('messages.followerRemovedMessage'))
                refetch()
            },
            onError() {
                toast.error(t('messages.followerRemoveErrorMessage'), {
                    description: t(
                        'messages.followerRemoveErrorMessageDescription',
                    ),
                })
            },
        })

    const handleOpenConfirmDialog = useCallback((followerId: string) => {
        setFollowerToRemove(followerId)
        setIsRemoveFollowerConfirmDialogOpen(true)
    }, [])

    const handleRemoveFollower = useCallback(() => {
        if (followerToRemove) {
            removeFollower({
                variables: {
                    followerId: followerToRemove,
                },
            })
        }
        setIsRemoveFollowerConfirmDialogOpen(false)
    }, [followerToRemove, removeFollower])

    const followersColumns: ColumnDef<
        FindFollowersQuery['findUserFollowers'][0]
    >[] = [
        {
            id: 'date',
            accessorKey: 'createdAt',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('columns.date')}
                />
            ),
            cell: ({ row }) => formatDate(row.original.createdAt, true),
            enableSorting: true,
            enableHiding: true,
            meta: { title: t('columns.date') },
        },
        {
            id: 'user',
            accessorFn: row => row.follower?.username,
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('columns.user')}
                />
            ),
            cell: ({ row }) => (
                <div className='flex items-center gap-x-2'>
                    <ProfileAvatar profile={row.original.follower!} size='sm' />
                    <h2>{row.original.follower?.username}</h2>
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
            meta: { title: t('columns.user') },
        },
        {
            id: 'actions',
            accessorKey: 'actions',
            header: t('columns.actions.header'),
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='size-8 p-0'>
                            <MoreHorizontal className='size-4' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side='right'>
                        <Link
                            href={`/${row.original.follower?.username}`}
                            target='_blank'
                        >
                            <DropdownMenuItem>
                                <User className='mr-2 size-4' />
                                {t('columns.actions.viewProfile')}
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                            onClick={() =>
                                handleOpenConfirmDialog(
                                    row.original.follower?.id!,
                                )
                            }
                            disabled={isLoadingFollowerRemove}
                        >
                            <UserMinus className='mr-2 size-4' />
                            {t('columns.actions.removeFollower')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={async () => {
                                await navigator.clipboard.writeText(
                                    row.original.follower?.username || '',
                                )
                                toast.success(
                                    t('messages.followerUsernameCopied'),
                                )
                            }}
                        >
                            <Copy className='mr-2 size-4' />
                            {t('columns.actions.copyUsername')}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            enableSorting: false,
            enableHiding: false,
        },
    ]

    return (
        <div className='lg:px-10'>
            <Heading
                title={t('header.heading')}
                description={t('header.description')}
                size='lg'
            />
            <div className='mt-5'>
                {isLoadingFollowers ? (
                    <DataTableSkeleton />
                ) : (
                    <DataTable
                        columns={followersColumns}
                        data={followers}
                        searchColumn='user'
                        searchPlaceholder={t('search.placeholder')}
                        enableResizing={false}
                    />
                )}
            </div>

            <ConfirmDialog
                open={isRemoveFollowerConfirmDialogOpen}
                onOpenChange={setIsRemoveFollowerConfirmDialogOpen}
                heading={t('removeFollowerConfirmDialog.heading')}
                message={t('removeFollowerConfirmDialog.message')}
                onConfirm={handleRemoveFollower}
            />
        </div>
    )
}
