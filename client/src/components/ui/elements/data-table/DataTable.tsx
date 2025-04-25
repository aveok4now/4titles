'use client'

import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

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
    searchPlaceholder?: string
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchColumn,
    searchPlaceholder,
}: DataTableProps<TData, TValue>) {
    const t = useTranslations('components.dataTable')

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    )

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
    })

    return (
        <div className='w-full'>
            <div className='flex items-center justify-between gap-2 py-4'>
                {searchColumn && (
                    <Input
                        placeholder={searchPlaceholder || t('search')}
                        value={
                            (table
                                .getColumn(searchColumn)
                                ?.getFilterValue() as string) ?? ''
                        }
                        onChange={event =>
                            table
                                .getColumn(searchColumn)
                                ?.setFilterValue(event.target.value)
                        }
                        className='max-w-md'
                    />
                )}
                <DataTableViewOptions table={table} />
            </div>
            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
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
                                        <TableCell key={cell.id}>
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
