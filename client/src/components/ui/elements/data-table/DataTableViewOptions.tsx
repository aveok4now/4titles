'use client'

import { type Table } from '@tanstack/react-table'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useDeviceSize } from '@/hooks/useDeviceSize'
import { cn } from '@/utils/tw-merge'
import { Button } from '../../common/button'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '../../common/dropdown-menu'

interface DataTableViewOptionsProps<TData> {
    table: Table<TData>
}

export function DataTableViewOptions<TData>({
    table,
}: DataTableViewOptionsProps<TData>) {
    const t = useTranslations('components.dataTable.viewOptions')
    const { isMobile } = useDeviceSize()

    const canHideColumn = (columnId: string) => {
        const visibleColumns = table
            .getAllColumns()
            .filter(
                column =>
                    column.getIsVisible() &&
                    column.getCanHide() &&
                    column.id !== columnId,
            )
        return visibleColumns.length > 0
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='outline'
                    className={cn('ml-auto', isMobile && 'p-2')}
                    size={isMobile ? 'icon' : 'default'}
                >
                    {isMobile ? <SlidersHorizontal /> : t('columns')}{' '}
                    {!isMobile && <ChevronDown className='ml-2 h-4 w-4' />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                {table
                    .getAllColumns()
                    .filter(column => column.getCanHide())
                    .map(column => {
                        const isLastVisible =
                            table
                                .getAllColumns()
                                .filter(col => col.getIsVisible()).length ===
                                1 && column.getIsVisible()

                        return (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                checked={column.getIsVisible()}
                                onCheckedChange={value => {
                                    if (value || canHideColumn(column.id)) {
                                        column.toggleVisibility(!!value)
                                    }
                                }}
                                disabled={isLastVisible}
                            >
                                {(column.columnDef as any).meta?.title ||
                                    column.id}
                            </DropdownMenuCheckboxItem>
                        )
                    })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
