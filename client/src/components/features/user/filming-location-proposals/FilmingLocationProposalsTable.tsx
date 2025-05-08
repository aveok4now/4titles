'use client'

import { Badge } from '@/components/ui/common/badge'
import { Button } from '@/components/ui/common/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/common/dropdown-menu'
import { ConfirmDialog } from '@/components/ui/elements/ConfirmDialog'
import { DataTableColumnHeader } from '@/components/ui/elements/data-table'
import {
    DataTable,
    DataTableSkeleton,
} from '@/components/ui/elements/data-table/DataTable'
import { Heading } from '@/components/ui/elements/Heading'
import {
    FilmingLocationProposalStatus,
    FilmingLocationProposalType,
    FindUserFilmingLocationProposalsQuery,
    Title,
    useDeleteFilmingLocationProposalMutation,
    useFindUserFilmingLocationProposalsQuery,
} from '@/graphql/generated/output'
import { formatDate } from '@/utils/format-date'
import { ColumnDef } from '@tanstack/react-table'
import { Copy, Eye, MoreHorizontal, Trash } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { getLocalizedTitleName } from '../../../../utils/localization/title-localization'

export function FilmingLocationProposalsTable() {
    const t = useTranslations('dashboard.filmingLocationProposals')
    const locale = useLocale()

    const [proposalIdToDelete, setProposalIdToDelete] = useState<string | null>(
        null,
    )
    const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] =
        useState(false)

    const {
        data,
        loading: isLoadingProposals,
        refetch,
    } = useFindUserFilmingLocationProposalsQuery()
    const proposals = data?.findUserFilmingLocationProposals ?? []

    const [deleteProposal, { loading: isLoadingProposalDelete }] =
        useDeleteFilmingLocationProposalMutation({
            onCompleted() {
                toast.success(t('messages.proposalDeletedSuccess'))
                refetch()
            },
            onError() {
                toast.error(t('messages.proposalDeletedError'))
            },
        })

    const handleOpenDeleteConfirmDialog = useCallback((proposalId: string) => {
        setProposalIdToDelete(proposalId)
        setIsDeleteConfirmDialogOpen(true)
    }, [])

    const handleDeleteProposal = useCallback(() => {
        if (proposalIdToDelete) {
            deleteProposal({
                variables: {
                    id: proposalIdToDelete,
                },
            })
        }
        setIsDeleteConfirmDialogOpen(false)
    }, [proposalIdToDelete, deleteProposal])

    const handleCopy = async (
        text: string | null | undefined,
        message: string,
    ) => {
        if (!text?.trim()) return
        await navigator.clipboard.writeText(text)
        toast.success(message)
    }

    const getTypeColor = (type: FilmingLocationProposalType) => {
        switch (type) {
            case FilmingLocationProposalType.Add:
                return 'bg-green-100 text-green-800 border-green-200'
            case FilmingLocationProposalType.Edit:
                return 'bg-blue-100 text-blue-800 border-blue-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const getStatusColor = (status: FilmingLocationProposalStatus) => {
        switch (status) {
            case FilmingLocationProposalStatus.Pending:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case FilmingLocationProposalStatus.Approved:
                return 'bg-green-100 text-green-800 border-green-200'
            case FilmingLocationProposalStatus.Rejected:
                return 'bg-red-100 text-red-800 border-red-200'
            case FilmingLocationProposalStatus.InProgress:
                return 'bg-blue-100 text-blue-800 border-blue-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const proposalColumns: ColumnDef<
        FindUserFilmingLocationProposalsQuery['findUserFilmingLocationProposals'][0]
    >[] = [
        {
            id: 'createdAt',
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
            enableResizing: true,
            meta: { title: t('columns.date') },
        },
        {
            id: 'type',
            accessorKey: 'type',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('columns.type.heading')}
                />
            ),
            cell: ({ row }) => {
                const type = row.original.type
                return (
                    <Badge className={getTypeColor(type)} variant='secondary'>
                        {type === FilmingLocationProposalType.Add
                            ? t('columns.type.values.add')
                            : t('columns.type.values.edit')}
                    </Badge>
                )
            },
            enableSorting: true,
            filterFn: 'equals',
            enableResizing: true,
            meta: { title: t('columns.type.heading') },
        },
        {
            id: 'status',
            accessorKey: 'status',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('columns.status.heading')}
                />
            ),
            cell: ({ row }) => {
                const status = row.original.status
                return (
                    <Badge
                        className={getStatusColor(status)}
                        variant='secondary'
                    >
                        {t(`columns.status.values.${status.toLowerCase()}`)}
                    </Badge>
                )
            },
            enableSorting: true,
            filterFn: 'equals',
            enableResizing: true,
            meta: { title: t('columns.status.heading') },
        },
        {
            id: 'title',
            accessorKey: 'title.originalName',
            accessorFn: row =>
                getLocalizedTitleName(row.title as Title, locale),
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('columns.title')}
                />
            ),
            cell: ({ row }) =>
                getLocalizedTitleName(row.original.title as Title, locale),
            enableSorting: true,
            enableColumnFilter: true,
            enableResizing: true,
            meta: { title: t('columns.title') },
        },
        {
            id: 'address',
            accessorKey: 'address',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('columns.address')}
                />
            ),
            cell: ({ row }) => row.original.address,
            enableSorting: true,
            enableColumnFilter: true,
            enableResizing: true,
            meta: { title: t('columns.address') },
        },
        {
            id: 'description',
            accessorKey: 'description',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('columns.description')}
                />
            ),
            cell: ({ row }) => (
                <div
                    className='max-w-xs truncate'
                    title={row.original.description ?? ''}
                >
                    {row.original.description ?? ''}
                </div>
            ),
            enableColumnFilter: true,
            enableResizing: true,
            meta: { title: t('columns.description') },
        },
        {
            id: 'reason',
            accessorKey: 'reason',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('columns.reason')}
                />
            ),
            cell: ({ row }) => (
                <div className='max-w-xs truncate' title={row.original.reason}>
                    {row.original.reason}
                </div>
            ),
            enableColumnFilter: true,
            enableResizing: true,
            meta: { title: t('columns.reason') },
        },
        {
            id: 'reviewMessage',
            accessorKey: 'reviewMessage',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('columns.reviewMessage')}
                />
            ),
            cell: ({ row }) => (
                <div
                    className='max-w-xs truncate'
                    title={row.original.reviewMessage ?? ''}
                >
                    {row.original.reviewMessage ?? ''}
                </div>
            ),
            enableColumnFilter: true,
            enableResizing: true,
            meta: { title: t('columns.reviewMessage') },
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
                            href={`/titles/${row.original.title?.slug}`}
                            target='_blank'
                        >
                            <DropdownMenuItem>
                                <Eye className='mr-2 size-4' />
                                {t('columns.actions.viewTitle')}
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <Copy className='mr-2 size-4' />
                                {t('columns.actions.copy.heading')}
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                {row.original.address && (
                                    <DropdownMenuItem
                                        onClick={() =>
                                            handleCopy(
                                                row.original.address,
                                                t('messages.addressCopied'),
                                            )
                                        }
                                    >
                                        {t('columns.actions.copy.copyAddress')}
                                    </DropdownMenuItem>
                                )}
                                {row.original.description && (
                                    <DropdownMenuItem
                                        onClick={() =>
                                            handleCopy(
                                                row.original.description,
                                                t('messages.descriptionCopied'),
                                            )
                                        }
                                    >
                                        {t(
                                            'columns.actions.copy.copyDescription',
                                        )}
                                    </DropdownMenuItem>
                                )}
                                {row.original.reason && (
                                    <DropdownMenuItem
                                        onClick={() =>
                                            handleCopy(
                                                row.original.reason,
                                                t('messages.reasonCopied'),
                                            )
                                        }
                                    >
                                        {t('columns.actions.copy.copyReason')}
                                    </DropdownMenuItem>
                                )}
                                {row.original.reviewMessage && (
                                    <DropdownMenuItem
                                        onClick={() =>
                                            handleCopy(
                                                row.original.reviewMessage,
                                                t(
                                                    'messages.reviewMessageCopied',
                                                ),
                                            )
                                        }
                                    >
                                        {t(
                                            'columns.actions.copy.copyReviewMessage',
                                        )}
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>

                        {row.original.status ===
                            FilmingLocationProposalStatus.Pending && (
                            <DropdownMenuItem
                                onClick={() =>
                                    handleOpenDeleteConfirmDialog(
                                        row.original.id,
                                    )
                                }
                                disabled={isLoadingProposalDelete}
                                className='text-destructive focus:text-destructive'
                            >
                                <Trash className='mr-2 size-4' />
                                {t('columns.actions.deleteProposal')}
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            enableSorting: false,
            enableHiding: false,
            enableResizing: true,
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
                {isLoadingProposals ? (
                    <DataTableSkeleton />
                ) : (
                    <DataTable
                        columns={proposalColumns}
                        data={proposals}
                        searchColumns={[
                            'title',
                            'address',
                            'reason',
                            'description',
                            'reviewMessage',
                        ]}
                        searchPlaceholder={t('search.placeholder')}
                    />
                )}
            </div>

            <ConfirmDialog
                open={isDeleteConfirmDialogOpen}
                onOpenChange={setIsDeleteConfirmDialogOpen}
                heading={t('deleteProposalConfirmDialog.heading')}
                message={t('deleteProposalConfirmDialog.message')}
                onConfirm={handleDeleteProposal}
            />
        </div>
    )
}
