'use client'

import type { ComboboxOption } from '@/components/ui/common/responsive-combobox'
import {
    useFindTitlesQuery,
    type FindAllCountriesQuery,
    type FindAllGenresQuery,
    type FindAllLanguagesQuery,
    type FindTitlesQuery,
    type Title,
    type TitleFilterInput,
    type Title as TitleType,
} from '@/graphql/generated/output'
import type { TitleFilterSchemaType } from '@/schemas/titles-filter.schema'

import { Heading } from '@/components/ui/elements/Heading'
import { getLocalizedCountryName } from '@/utils/country/country-localization'
import { getLocalizedGenreName } from '@/utils/genre/genre-localization'
import { getLocalizedLanguageName } from '@/utils/language/language-localization'
import { parseQueryToFilter } from '@/utils/title/title-filter-query'
import { useLocale, useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { TitleFiltersForm } from './TitleFiltersForm'
import { TitlePosterCardSkeleton } from './TitlePosterCard'
import { TitlesList } from './TitlesList'

export interface TitlesContentProps {
    initialData: FindTitlesQuery['findTitles']
    metaData: {
        genres: FindAllGenresQuery['findAllGenres']
        countries: FindAllCountriesQuery['findAllCountries']
        languages: FindAllLanguagesQuery['findAllLanguages']
    }
    titlesPerPage?: number
    initialCount?: number
}

export function TitlesContent({
    initialData,
    metaData,
    titlesPerPage = 12,
    initialCount = 24,
}: TitlesContentProps) {
    const t = useTranslations('titles')
    const locale = useLocale()
    const searchParams = useSearchParams()
    const searchTerm = searchParams.get('search')

    const [titles, setTitles] = useState<TitleType[]>(
        initialData as TitleType[],
    )
    const [hasMore, setHasMore] = useState(initialData.length >= initialCount)
    const [loadedCount, setLoadedCount] = useState(initialData.length)
    const [isReloading, setIsReloading] = useState(false)

    const genreOptions: ComboboxOption[] = useMemo(() => {
        return metaData.genres.map(genre => ({
            value: genre.tmdbId,
            label:
                getLocalizedGenreName(genre, locale).charAt(0).toUpperCase() +
                getLocalizedGenreName(genre, locale).slice(1),
        }))
    }, [metaData.genres])

    const countryOptions: ComboboxOption[] = useMemo(() => {
        return metaData.countries.map(country => ({
            value: country.iso,
            label: getLocalizedCountryName(country, locale),
        }))
    }, [metaData.countries])

    const languageOptions: ComboboxOption[] = useMemo(() => {
        return metaData.languages.map(language => ({
            value: language.iso,
            label: getLocalizedLanguageName(language, locale),
        }))
    }, [metaData.languages])

    const currentFilter = useMemo(() => {
        return parseQueryToFilter(searchParams)
    }, [searchParams])

    const { fetchMore, refetch } = useFindTitlesQuery({
        variables: {
            filter: {
                take: titlesPerPage,
                skip: 0,
                searchTerm,
                ...currentFilter,
            } as TitleFilterInput,
        },
        fetchPolicy: 'cache-and-network',
        skip: true,
    })

    useEffect(() => {
        setTitles(initialData as TitleType[])
        setHasMore(initialData.length >= initialCount)
        setLoadedCount(initialData.length)
        setIsReloading(false)
    }, [initialData, initialCount, searchParams])

    const filterUniqueNewTitles = (
        newTitles: Title[],
        existingTitles: Title[],
    ): Title[] => {
        return newTitles.filter(
            newTitle =>
                !existingTitles.some(existing => existing.id === newTitle.id),
        )
    }

    const fetchMoreTitles = async () => {
        if (!hasMore || isReloading) return

        try {
            const { data: newData } = await fetchMore({
                variables: {
                    filter: {
                        take: titlesPerPage,
                        skip: loadedCount,
                        searchTerm,
                        ...currentFilter,
                    } as TitleFilterInput,
                },
            })

            if (newData?.findTitles.length > 0) {
                const uniqueNewTitles = filterUniqueNewTitles(
                    newData.findTitles as Title[],
                    titles,
                )

                setTitles([...titles, ...uniqueNewTitles])
                setLoadedCount(prev => prev + newData.findTitles.length)
                setHasMore(newData.findTitles.length === titlesPerPage)
            } else {
                setHasMore(false)
            }
        } catch (error) {
            console.error('Error fetching more titles:', error)
            setHasMore(false)
        }
    }

    const handleFilterChange = useCallback(
        async (values: TitleFilterSchemaType) => {
            setIsReloading(true)

            try {
                const { data } = await refetch({
                    filter: {
                        searchTerm,
                        ...values,
                        take: initialCount,
                        skip: 0,
                    } as TitleFilterInput,
                })

                if (data?.findTitles) {
                    setTitles(data.findTitles as TitleType[])
                    setLoadedCount(data.findTitles.length)
                    setHasMore(data.findTitles.length >= initialCount)
                }
            } catch (error) {
                console.error('Error applying filters:', error)
            } finally {
                setIsReloading(false)
            }
        },
        [refetch, searchTerm, initialCount],
    )

    const renderTitle = () => {
        if (searchTerm) {
            return t('searchHeading', { query: searchTerm })
        }
        return t('heading')
    }

    const LoaderSkeleton = () => (
        <div className='grid grid-cols-2 gap-3 overflow-hidden pb-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
            {Array.from({ length: titlesPerPage }).map((_, index) => (
                <TitlePosterCardSkeleton key={index} />
            ))}
        </div>
    )

    return (
        <>
            <Heading
                title={renderTitle()}
                description={searchTerm ? undefined : t('description')}
                size='lg'
            />

            {!searchTerm && (
                <div className='my-4'>
                    <TitleFiltersForm
                        genres={genreOptions}
                        countries={countryOptions}
                        languages={languageOptions}
                        onFilter={handleFilterChange}
                        initialFilter={currentFilter}
                    />
                </div>
            )}

            <div className='mt-5 space-y-6'>
                <InfiniteScroll
                    dataLength={titles.length}
                    next={fetchMoreTitles}
                    hasMore={hasMore && !isReloading}
                    loader={<LoaderSkeleton />}
                >
                    {isReloading ? (
                        <LoaderSkeleton />
                    ) : (
                        <TitlesList
                            titles={titles}
                            emptyMessage={
                                searchTerm
                                    ? t('list.emptySearchMessage')
                                    : t('list.emptyMessage')
                            }
                        />
                    )}
                </InfiniteScroll>
            </div>
        </>
    )
}
