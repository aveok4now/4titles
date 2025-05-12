'use client'

import { Button } from '@/components/ui/common/button'
import { DateRangePicker } from '@/components/ui/common/date-range-picker'
import { DualRangeSlider } from '@/components/ui/common/dual-range-slider'
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/common/form'
import { Input } from '@/components/ui/common/input'
import {
    ComboboxOption,
    ResponsiveCombobox,
} from '@/components/ui/common/responsive-combobox'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/common/select'
import { Switch } from '@/components/ui/common/switch'
import { FormWrapper } from '@/components/ui/elements/FormWrapper'
import {
    TitleCategory,
    TitleSortOption,
    TitleStatus,
    TitleType,
} from '@/graphql/generated/output'
import {
    TitleFilterSchemaType,
    defaultFilterValues,
    titleFilterSchema,
} from '@/schemas/titles-filter.schema'
import {
    parseQueryToFilter,
    serializeFilterToQuery,
} from '@/utils/filter-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { Filter, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import { FieldValues, useForm } from 'react-hook-form'

interface TitleFiltersFormProps {
    genres: ComboboxOption[]
    countries: ComboboxOption[]
    languages: ComboboxOption[]
    onFilter: (values: TitleFilterSchemaType) => void
    initialFilter?: Partial<TitleFilterSchemaType>
}

export function TitleFiltersForm({
    genres,
    countries,
    languages,
    onFilter,
    initialFilter = {},
}: TitleFiltersFormProps) {
    const t = useTranslations('titles.filters')
    const router = useRouter()
    const searchParams = useSearchParams()

    const form = useForm({
        resolver: zodResolver(titleFilterSchema),
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

    const onSubmit = useCallback(
        (data: FieldValues) => {
            const queryParams = serializeFilterToQuery(
                data as TitleFilterSchemaType,
            )
            const url = new URL(window.location.href)

            url.searchParams.delete('page')
            url.searchParams.delete('search')

            Object.entries(queryParams).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    url.searchParams.set(key, value as string)
                } else {
                    url.searchParams.delete(key)
                }
            })

            router.replace(url.pathname + url.search, { scroll: false })
            onFilter(data as TitleFilterSchemaType)
        },
        [router, onFilter],
    )

    const handleReset = useCallback(() => {
        reset(defaultFilterValues)

        const url = new URL(window.location.href)

        const search = url.searchParams.get('search')

        const params = Array.from(url.searchParams.keys())
        params.forEach(param => {
            url.searchParams.delete(param)
        })

        if (search) {
            url.searchParams.set('search', search)
        }

        router.replace(url.pathname + url.search, { scroll: false })
        onFilter(defaultFilterValues)
    }, [reset, router, onFilter])

    const statusOptions = Object.values(TitleStatus).map(status => ({
        value: status,
        label: t(`status.${status.toLowerCase()}`),
    }))

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
                                            <SelectItem value={TitleType.Movie}>
                                                {t('type.movie')}
                                            </SelectItem>
                                            <SelectItem value={TitleType.Tv}>
                                                {t('type.tv')}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='category'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('category.label')}</FormLabel>
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
                                                    'category.placeholder',
                                                )}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='ALL'>
                                                {t('category.all')}
                                            </SelectItem>
                                            {Object.values(TitleCategory).map(
                                                category => (
                                                    <SelectItem
                                                        key={category}
                                                        value={category}
                                                    >
                                                        {t(
                                                            `category.${category.toLowerCase()}`,
                                                        )}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('name.label')}</FormLabel>
                                    <Input
                                        placeholder={t('name.placeholder')}
                                        {...field}
                                        value={field.value || ''}
                                        className='bg-popover'
                                    />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='releaseDateRange'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t('releaseDate.label')}
                                    </FormLabel>
                                    <DateRangePicker
                                        value={{
                                            from: field.value?.from
                                                ? new Date(field.value.from)
                                                : undefined,
                                            to: field.value?.to
                                                ? new Date(field.value.to)
                                                : undefined,
                                        }}
                                        onChange={dateRange => {
                                            field.onChange({
                                                from: dateRange.from?.toISOString(),
                                                to: dateRange.to?.toISOString(),
                                            })
                                        }}
                                        placeholder={t(
                                            'releaseDate.placeholder',
                                        )}
                                    />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='genreIds'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('genres.label')}</FormLabel>
                                    <ResponsiveCombobox
                                        options={genres}
                                        value={field.value || []}
                                        onChange={field.onChange}
                                        placeholder={t('genres.placeholder')}
                                        title={t('genres.title')}
                                        searchPlaceholder={t('genres.search')}
                                        emptyPlaceholder={t('genres.empty')}
                                    />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='countryIsos'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t('countries.label')}
                                    </FormLabel>
                                    <ResponsiveCombobox
                                        options={countries}
                                        value={field.value || []}
                                        onChange={field.onChange}
                                        placeholder={t('countries.placeholder')}
                                        title={t('countries.title')}
                                        searchPlaceholder={t(
                                            'countries.search',
                                        )}
                                        emptyPlaceholder={t('countries.empty')}
                                    />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='originalLanguageIsos'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('language.label')}</FormLabel>
                                    <ResponsiveCombobox
                                        options={languages}
                                        value={field.value || []}
                                        onChange={field.onChange}
                                        placeholder={t('language.placeholder')}
                                        title={t('language.title')}
                                        searchPlaceholder={t('language.search')}
                                        emptyPlaceholder={t('language.empty')}
                                        multiple={false}
                                    />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='statuses'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('status.label')}</FormLabel>
                                    <ResponsiveCombobox
                                        options={statusOptions}
                                        value={field.value || []}
                                        onChange={selected => {
                                            const typedStatuses = selected.map(
                                                s =>
                                                    s as unknown as TitleStatus,
                                            )
                                            field.onChange(typedStatuses)
                                        }}
                                        placeholder={t('status.placeholder')}
                                        title={t('status.title')}
                                        searchPlaceholder={t('status.search')}
                                        emptyPlaceholder={t('status.empty')}
                                    />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='runtimeRange'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t('runtime.label', {
                                            unit: t('runtime.unit'),
                                        })}
                                    </FormLabel>
                                    <div className='px-3 pb-6 pt-2'>
                                        <DualRangeSlider
                                            min={0}
                                            max={300}
                                            step={10}
                                            value={[
                                                field.value?.from ?? 0,
                                                field.value?.to ?? 300,
                                            ]}
                                            onValueChange={value => {
                                                field.onChange({
                                                    from: value[0],
                                                    to: value[1],
                                                })
                                            }}
                                            label={value => (
                                                <span className='text-center text-sm'>
                                                    {value}
                                                </span>
                                            )}
                                            labelPosition='bottom'
                                        />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='voteAverageRange'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('rating.label')}</FormLabel>
                                    <div className='px-3 pb-6 pt-2'>
                                        <DualRangeSlider
                                            min={0}
                                            max={10}
                                            step={0.5}
                                            value={[
                                                field.value?.from ?? 0,
                                                field.value?.to ?? 10,
                                            ]}
                                            onValueChange={value => {
                                                field.onChange({
                                                    from: value[0],
                                                    to: value[1],
                                                })
                                            }}
                                            label={value => `${value}`}
                                            labelPosition='bottom'
                                        />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='sortBy'
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
                                            {Object.values(TitleSortOption).map(
                                                option => (
                                                    <SelectItem
                                                        key={option}
                                                        value={option}
                                                    >
                                                        {t(
                                                            `sort.${option.toLowerCase()}`,
                                                        )}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='flex flex-col items-end justify-between gap-y-4 pt-0 md:flex-row md:pt-4'>
                        <FormField
                            control={form.control}
                            name='withFilmingLocations'
                            render={({ field }) => (
                                <div className='flex items-center space-x-2 place-self-start md:place-self-auto'>
                                    <Switch
                                        id='with-filming-locations'
                                        checked={!!field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                    <FormLabel
                                        htmlFor='with-filming-locations'
                                        className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                                    >
                                        {t('locations.label')}
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
                            >
                                <Trash2 className='size-4' />
                            </Button>

                            <Button type='submit'>
                                <Filter className='size-4' />
                                <span>{t('actions.apply')}</span>
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </FormWrapper>
    )
}
