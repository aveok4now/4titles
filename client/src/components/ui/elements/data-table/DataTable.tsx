'use client'

import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { cn } from '@/utils/tw-merge'
import { Card } from '../../common/card'
import { Input } from '../../common/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../common/table'
import { Spinner } from '../Spinner'
import { DataTablePagination } from './DataTablePagination'
import { DataTableViewOptions } from './DataTableViewOptions'

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    searchColumn?: string
    searchColumns?: string[]
    searchPlaceholder?: string
    enablePagination?: boolean
    enableColumnVisibility?: boolean
    enableColumnFilters?: boolean
    enableSorting?: boolean
    enableResizing?: boolean
    enableColumnDragging?: boolean
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchColumn,
    searchColumns,
    searchPlaceholder,
    enableResizing = true,
}: DataTableProps<TData, TValue>) {
    const t = useTranslations('components.dataTable')

    const [rowSelection, setRowSelection] = useState({})
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    )
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState('')

    const fuzzyFilter = (row: any, columnId: string, filterValue: string) => {
        const searchValue = String(filterValue).toLowerCase()

        if (searchColumns && searchColumns.length > 0) {
            return searchColumns.some(column => {
                const value = row.getValue(column)
                if (typeof value === 'undefined' || value === null) return false
                return String(value).toLowerCase().includes(searchValue)
            })
        }

        if (searchColumn) {
            const value = row.getValue(searchColumn)
            if (typeof value === 'undefined' || value === null) return false
            return String(value).toLowerCase().includes(searchValue)
        }

        const value = row.getValue(columnId)
        if (typeof value === 'undefined' || value === null) return false
        return String(value).toLowerCase().includes(searchValue)
    }

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            globalFilter,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        enableColumnResizing: enableResizing,
        columnResizeMode: 'onChange',
        globalFilterFn: fuzzyFilter,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
    })

    return (
        <div className='w-full'>
            <div className='flex items-center justify-between gap-2 py-4'>
                {(searchColumn || searchColumns) && (
                    <Input
                        placeholder={searchPlaceholder || t('search')}
                        value={globalFilter}
                        onChange={event => setGlobalFilter(event.target.value)}
                        className='max-w-md bg-background dark:bg-muted/30'
                    />
                )}
                <DataTableViewOptions table={table} />
            </div>
            <div className='rounded-md border bg-background dark:bg-transparent'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            style={{
                                                width: header.getSize(),
                                                position: 'relative',
                                            }}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                            {header.column.getCanResize() && (
                                                <div
                                                    onMouseDown={header.getResizeHandler()}
                                                    onTouchStart={header.getResizeHandler()}
                                                    className={cn(
                                                        'absolute right-0 top-0 h-full w-1 cursor-col-resize touch-none select-none',
                                                        'hover:bg-primary',
                                                    )}
                                                />
                                            )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell
                                            key={cell.id}
                                            style={{
                                                width: cell.column.getSize(),
                                            }}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className='h-24 text-center'
                                >
                                    {t('notFound')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    )
}

export function DataTableSkeleton() {
    return (
        <div className='max-w-screen mx-auto mb-10 w-full'>
            <Card className='mt-6 flex h-[500px] w-full items-center justify-center'>
                <Spinner size='xl' color='border-primary' />
            </Card>
        </div>
    )
}
