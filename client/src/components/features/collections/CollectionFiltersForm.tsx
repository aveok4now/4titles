'use client'

import { Button } from '@/components/ui/common/button'
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/common/form'
import { Input } from '@/components/ui/common/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/common/select'
import { Switch } from '@/components/ui/common/switch'
import { FormWrapper } from '@/components/ui/elements/FormWrapper'
import { CollectionSortType, CollectionType } from '@/graphql/generated/output'
import {
    CollectionFilterSchemaType,
    collectionFilterSchema,
    defaultFilterValues,
} from '@/schemas/collections-filter.schema'
import {
    parseQueryToFilter,
    serializeFilterToQuery,
} from '@/utils/collection/collection-filter-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { Filter, Loader2, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'

interface CollectionFiltersFormProps {
    onFilter: (values: CollectionFilterSchemaType) => void
    initialFilter?: Partial<CollectionFilterSchemaType>
}

export function CollectionFiltersForm({
    onFilter,
    initialFilter = {},
}: CollectionFiltersFormProps) {
    const t = useTranslations('collections.filters')
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm({
        resolver: zodResolver(collectionFilterSchema),
        defaultValues: {
            ...defaultFilterValues,
            ...initialFilter,
        },
    })

    const { setValue, reset } = form

    useEffect(() => {
        const parsedFilter = parseQueryToFilter(searchParams)

        if (Object.keys(parsedFilter).length > 0) {
            Object.entries(parsedFilter).forEach(([key, value]) => {
                // @ts-ignore - dynamic key setting
                setValue(key, value)
            })
        }
    }, [searchParams, setValue])

    const updateUrlAndFilter = useCallback(
        (data: CollectionFilterSchemaType) => {
            const queryParams = serializeFilterToQuery(data)

            const params = new URLSearchParams(searchParams.toString())

            const filterParamsToRemove = ['type', 'mine', 'sort', 'search']
            filterParamsToRemove.forEach(param => {
                params.delete(param)
            })

            Object.entries(queryParams).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.set(key, value)
                }
            })

            const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`
            router.replace(newUrl, { scroll: false })

            onFilter(data)
            setIsSubmitting(false)
        },
        [searchParams, pathname, router, onFilter],
    )

    const onSubmit = useCallback(
        (data: FieldValues) => {
            setIsSubmitting(true)
            updateUrlAndFilter(data as CollectionFilterSchemaType)
        },
        [updateUrlAndFilter],
    )

    const handleReset = useCallback(() => {
        setIsSubmitting(true)

        reset(defaultFilterValues)

        const params = new URLSearchParams()

        const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`
        router.replace(newUrl, { scroll: false })

        onFilter(defaultFilterValues)
        setIsSubmitting(false)
    }, [reset, router, onFilter, searchParams, pathname])

    return (
        <FormWrapper showHeader={false}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-4 p-1 md:p-4'
                >
                    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                        <FormField
                            control={form.control}
                            name='type'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('type.label')}</FormLabel>
                                    <Select
                                        value={field.value || 'ALL'}
                                        onValueChange={value => {
                                            field.onChange(
                                                value === 'ALL'
                                                    ? undefined
                                                    : value,
                                            )
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={t(
                                                    'type.placeholder',
                                                )}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='ALL'>
                                                {t('type.all')}
                                            </SelectItem>
                                            <SelectItem
                                                value={CollectionType.Title}
                                            >
                                                {t('type.title')}
                                            </SelectItem>
                                            <SelectItem
                                                value={CollectionType.Location}
                                            >
                                                {t('type.location')}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='search'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('search.label')}</FormLabel>
                                    <Input
                                        placeholder={t('search.placeholder')}
                                        {...field}
                                        value={field.value || ''}
                                        className='bg-background'
                                    />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='sort'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('sort.label')}</FormLabel>
                                    <Select
                                        value={field.value || 'ALL'}
                                        onValueChange={value => {
                                            field.onChange(
                                                value === 'ALL'
                                                    ? undefined
                                                    : value,
                                            )
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={t(
                                                    'sort.placeholder',
                                                )}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='ALL'>
                                                {t('sort.default')}
                                            </SelectItem>
                                            {Object.values(
                                                CollectionSortType,
                                            ).map(option => (
                                                <SelectItem
                                                    key={option}
                                                    value={option}
                                                >
                                                    {t(
                                                        `sort.${option.toLowerCase()}`,
                                                    )}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='flex flex-col items-end justify-between gap-y-4 pt-0 md:flex-row md:items-center md:pt-4'>
                        <FormField
                            control={form.control}
                            name='mine'
                            render={({ field }) => (
                                <div className='flex items-center space-x-2 place-self-start md:place-self-auto'>
                                    <Switch
                                        id='mine-only'
                                        checked={!!field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                    <FormLabel
                                        htmlFor='mine-only'
                                        className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                                    >
                                        {t('mine.label')}
                                    </FormLabel>
                                </div>
                            )}
                        />

                        <div className='flex flex-row justify-end gap-x-4'>
                            <Button
                                type='button'
                                size='icon'
                                variant='outline'
                                onClick={handleReset}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <Loader2 className='size-4 animate-spin' />
                                ) : (
                                    <Trash2 className='size-4' />
                                )}
                            </Button>

                            <Button type='submit' disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <Loader2 className='mr-2 size-4 animate-spin' />
                                ) : (
                                    <Filter className='mr-2 size-4' />
                                )}
                                <span>{t('actions.apply')}</span>
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </FormWrapper>
    )
}
