'use client'

import { Badge } from '@/components/ui/common/badge'
import { Button } from '@/components/ui/common/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/common/dropdown-menu'
import { ConfirmDialog } from '@/components/ui/elements/ConfirmDialog'
import {
    DataTable,
    DataTableSkeleton,
} from '@/components/ui/elements/data-table/DataTable'
import { DataTableColumnHeader } from '@/components/ui/elements/data-table/DataTableColumnHeader'
import { Heading } from '@/components/ui/elements/Heading'
import {
    FeedbackSource,
    FeedbackStatus,
    FeedbackType,
    FindUserFeedbacksQuery,
    useDeleteFeedbackMutation,
    useFindUserFeedbacksQuery,
} from '@/graphql/generated/output'
import { formatDate } from '@/utils/format-date'
import { ColumnDef } from '@tanstack/react-table'
import { Copy, MoreHorizontal, Trash } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

export function FeedbacksTable() {
    const t = useTranslations('dashboard.feedbacks')

    const [feedbackToDelete, setFeedbackToDelete] = useState<string | null>(
        null,
    )
    const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] =
        useState(false)

    const {
        data,
        loading: isLoadingFeedbacks,
        refetch,
    } = useFindUserFeedbacksQuery()
    const feedbacks = data?.findMyFeedbacks ?? []

    const [deleteFeedback, { loading: isLoadingFeedbackDelete }] =
        useDeleteFeedbackMutation({
            onCompleted() {
                toast.success(t('messages.feedbackDeletedMessage'))
                refetch()
            },
            onError() {
                toast.error(t('messages.feedbackDeleteErrorMessage'), {
                    description: t(
                        'messages.feedbackDeleteErrorMessageDescription',
                    ),
                })
            },
        })

    const handleOpenConfirmDialog = useCallback((feedbackId: string) => {
        setFeedbackToDelete(feedbackId)
        setIsDeleteConfirmDialogOpen(true)
    }, [])

    const handleDeleteFeedback = useCallback(() => {
        if (feedbackToDelete) {
            deleteFeedback({
                variables: {
                    deleteFeedbackId: feedbackToDelete,
                },
            })
        }
        setIsDeleteConfirmDialogOpen(false)
    }, [feedbackToDelete, deleteFeedback])

    const handleCopyContent = useCallback(
        async (content: string, message: string) => {
            if (!content) return

            try {
                await navigator.clipboard.writeText(content)
                toast.success(message)
            } catch (error) {
                toast.error(t('messages.copyErrorMessage'))
            }
        },
        [t],
    )

    const getStatusBadge = (status: FeedbackStatus) => {
        const variant = {
            [FeedbackStatus.New]: 'default',
            [FeedbackStatus.InProgress]: 'secondary',
            [FeedbackStatus.Resolved]: 'default',
            [FeedbackStatus.Closed]: 'secondary',
            [FeedbackStatus.Rejected]: 'destructive',
        }[status] as 'default' | 'secondary' | 'destructive' | 'outline'

        return (
            <Badge variant={variant}>
                {t(`status.${status.toLowerCase()}`)}
            </Badge>
        )
    }

    const getTypeBadge = (type: FeedbackType) => {
        const variant = {
            [FeedbackType.General]: 'default',
            [FeedbackType.BugReport]: 'destructive',
            [FeedbackType.FeatureRequest]: 'secondary',
            [FeedbackType.ContentIssue]: 'outline',
            [FeedbackType.Other]: 'secondary',
        }[type] as 'default' | 'secondary' | 'destructive' | 'outline'

        return (
            <Badge variant={variant}>{t(`type.${type.toLowerCase()}`)}</Badge>
        )
    }

    const getSourceBadge = (source: FeedbackSource) => {
        const variant = {
            [FeedbackSource.Website]: 'default',
            [FeedbackSource.Telegram]: 'secondary',
            [FeedbackSource.Email]: 'outline',
            [FeedbackSource.Other]: 'secondary',
        }[source] as 'default' | 'secondary' | 'destructive' | 'outline'

        return (
            <Badge variant={variant}>
                {t(`source.${source.toLowerCase()}`)}
            </Badge>
        )
    }

    const feedbacksColumns: ColumnDef<
        FindUserFeedbacksQuery['findMyFeedbacks'][0]
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
            id: 'type',
            accessorKey: 'type',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('columns.type')}
                />
            ),
            cell: ({ row }) => getTypeBadge(row.original.type),
            enableSorting: true,
            enableHiding: true,
            meta: { title: t('columns.type') },
        },
        {
            id: 'status',
            accessorKey: 'status',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('columns.status')}
                />
            ),
            cell: ({ row }) => getStatusBadge(row.original.status),
            enableSorting: true,
            enableHiding: true,
            meta: { title: t('columns.status') },
        },
        {
            id: 'source',
            accessorKey: 'source',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('columns.source')}
                />
            ),
            cell: ({ row }) => getSourceBadge(row.original.source),
            enableSorting: true,
            enableHiding: true,
            meta: { title: t('columns.source') },
        },
        {
            id: 'message',
            accessorKey: 'message',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('columns.message')}
                />
            ),
            cell: ({ row }) => (
                <div className='max-w-[300px] truncate'>
                    {row.original.message}
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
            meta: { title: t('columns.message') },
        },
        {
            id: 'responseMessage',
            accessorKey: 'responseMessage',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('columns.responseMessage')}
                />
            ),
            cell: ({ row }) => (
                <div className='max-w-[300px] truncate'>
                    {row.original.responseMessage || t('noResponse')}
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
            meta: { title: t('columns.responseMessage') },
        },
        {
            id: 'respondedAt',
            accessorKey: 'respondedAt',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('columns.respondedAt')}
                />
            ),
            cell: ({ row }) =>
                row.original.respondedAt
                    ? formatDate(row.original.respondedAt, true)
                    : '-',
            enableSorting: true,
            enableHiding: true,
            meta: { title: t('columns.respondedAt') },
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
                    <DropdownMenuContent side='right' align='end'>
                        <DropdownMenuLabel>
                            {t('columns.actions.options')}
                        </DropdownMenuLabel>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <Copy className='mr-2 size-4' />
                                {t('columns.actions.copy')}
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem
                                    onClick={() =>
                                        handleCopyContent(
                                            row.original.message,
                                            t('messages.messageCopied'),
                                        )
                                    }
                                >
                                    {t('columns.actions.copyMessage')}
                                </DropdownMenuItem>
                                {row.original.responseMessage && (
                                    <DropdownMenuItem
                                        onClick={() =>
                                            handleCopyContent(
                                                row.original.responseMessage ||
                                                    '',
                                                t('messages.responseCopied'),
                                            )
                                        }
                                    >
                                        {t('columns.actions.copyResponse')}
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        {row.original.status === FeedbackStatus.New &&
                            !row.original.responseMessage && (
                                <DropdownMenuItem
                                    onClick={() =>
                                        handleOpenConfirmDialog(row.original.id)
                                    }
                                    disabled={isLoadingFeedbackDelete}
                                    className='text-destructive focus:bg-destructive focus:text-destructive-foreground'
                                >
                                    <Trash className='mr-2 size-4' />
                                    {t('columns.actions.delete')}
                                </DropdownMenuItem>
                            )}
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
                {isLoadingFeedbacks ? (
                    <DataTableSkeleton />
                ) : (
                    <DataTable
                        columns={feedbacksColumns}
                        data={feedbacks}
                        searchColumns={[
                            'message',
                            'responseMessage',
                            'type',
                            'status',
                            'source',
                        ]}
                        searchPlaceholder={t('search.placeholder')}
                        enableResizing={true}
                    />
                )}
            </div>

            <ConfirmDialog
                open={isDeleteConfirmDialogOpen}
                onOpenChange={setIsDeleteConfirmDialogOpen}
                heading={t('deleteConfirmDialog.heading')}
                message={t('deleteConfirmDialog.message')}
                onConfirm={handleDeleteFeedback}
            />
        </div>
    )
}
