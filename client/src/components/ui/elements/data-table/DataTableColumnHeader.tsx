'use client'

import { type Column } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import { cn } from '@/utils/tw-merge'
import { Button } from '../../common/button'

interface DataTableColumnHeaderProps<TData, TValue> {
    column: Column<TData, TValue>
    title: string
    className?: string
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
}: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>
    }

    return (
        <div className='flex items-center justify-start'>
            <Button
                variant='ghost'
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }
                className={cn('font-medium', className)}
            >
                {title}
                <ArrowUpDown className='ml-2 h-4 w-4' />
            </Button>
        </div>
    )
}
