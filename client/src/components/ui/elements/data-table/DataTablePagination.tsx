'use client'

import { type Table } from '@tanstack/react-table'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useDeviceSize } from '@/hooks/useDeviceSize'
import { Button } from '../../common/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../common/select'

interface DataTablePaginationProps<TData> {
    table: Table<TData>
}

export function DataTablePagination<TData>({
    table,
}: DataTablePaginationProps<TData>) {
    const t = useTranslations('components.dataTable.pagination')
    const { isMobile } = useDeviceSize()

    const totalRows = table.getFilteredRowModel().rows.length
    const shouldShowNavigation = table.getPageCount() > 1

    const startRow =
        table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
        1
    const endRow = Math.min(
        (table.getState().pagination.pageIndex + 1) *
            table.getState().pagination.pageSize,
        totalRows,
    )

    const selectComponent = (
        <div className='flex items-center space-x-2'>
            {!isMobile && (
                <p className='text-sm font-medium'>{t('rowsPerPage')}</p>
            )}
            <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={value => {
                    table.setPageSize(Number(value))
                }}
            >
                <SelectTrigger className='h-8 w-[70px]'>
                    <SelectValue
                        placeholder={table.getState().pagination.pageSize}
                    />
                </SelectTrigger>
                <SelectContent side='top'>
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                            {pageSize}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )

    return (
        <div className='py-4'>
            <div className='flex items-center justify-between'>
                <div className='text-xs text-muted-foreground md:text-sm'>
                    {totalRows > 0 && (
                        <div>
                            {t('showing')} {t('from')}{' '}
                            <strong>{startRow}</strong> {t('to')}{' '}
                            <strong>{endRow}</strong> {t('of')}{' '}
                            <strong>{totalRows}</strong> {t('entries')}
                        </div>
                    )}
                </div>

                {!isMobile && selectComponent}

                {shouldShowNavigation && (
                    <div className='flex items-center space-x-4'>
                        <div className='flex shrink-0 space-x-2'>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                {isMobile ? (
                                    <ChevronLeft className='h-4 w-4' />
                                ) : (
                                    t('previousPage')
                                )}
                            </Button>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                {isMobile ? (
                                    <ChevronRight className='h-4 w-4' />
                                ) : (
                                    t('nextPage')
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            {isMobile && (
                <div className='mt-2 flex justify-end'>{selectComponent}</div>
            )}
        </div>
    )
}
