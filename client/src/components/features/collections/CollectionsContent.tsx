'use client'

import { Button } from '@/components/ui/common/button'
import { Heading } from '@/components/ui/elements/Heading'
import {
    Collection,
    FindCollectionsInput,
    useFindCollectionsQuery,
} from '@/graphql/generated/output'
import { CollectionFilterSchemaType } from '@/schemas/collections-filter.schema'
import { parseQueryToFilter } from '@/utils/collection/collection-filter-query'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { CollectionCardSkeleton } from './CollectionCard'
import { CollectionFiltersForm } from './CollectionFiltersForm'
import { CollectionPageWrapper } from './CollectionPageWrapper'
import { CollectionsList } from './CollectionsList'
import { CollectionForm } from './form'

const COLLECTIONS_PER_PAGE = 12

export function CollectionsContent() {
    const t = useTranslations('collections')
    const searchParams = useSearchParams()

    const [collections, setCollections] = useState<Collection[]>([])
    const [hasMore, setHasMore] = useState(true)
    const [loadedCount, setLoadedCount] = useState(0)
    const [isReloading, setIsReloading] = useState(false)
    const [isCreating, setIsCreating] = useState(false)

    const currentFilter = useMemo(() => {
        return parseQueryToFilter(searchParams)
    }, [searchParams])

    const {
        data,
        loading: isLoading,
        fetchMore,
        refetch,
    } = useFindCollectionsQuery({
        variables: {
            input: {
                take: COLLECTIONS_PER_PAGE,
                skip: 0,
                ...currentFilter,
            } as FindCollectionsInput,
        },
        fetchPolicy: 'cache-and-network',
    })

    useEffect(() => {
        if (data?.findCollections) {
            setCollections(data.findCollections as Collection[])
            setLoadedCount(data.findCollections.length)
            setHasMore(data.findCollections.length >= COLLECTIONS_PER_PAGE)
            setIsReloading(false)
        }
    }, [data])

    const filterUniqueNewCollections = (
        newCollections: Collection[],
        existingCollections: Collection[],
    ): Collection[] => {
        return newCollections.filter(
            newCollection =>
                !existingCollections.some(
                    existing => existing.id === newCollection.id,
                ),
        )
    }

    const fetchMoreCollections = async () => {
        if (!hasMore || isReloading) return

        try {
            const { data: newData } = await fetchMore({
                variables: {
                    input: {
                        take: COLLECTIONS_PER_PAGE,
                        skip: loadedCount,
                        ...currentFilter,
                    } as FindCollectionsInput,
                },
            })

            if (newData?.findCollections.length > 0) {
                const uniqueNewCollections = filterUniqueNewCollections(
                    newData.findCollections as Collection[],
                    collections,
                )

                setCollections(prev => [...prev, ...uniqueNewCollections])
                setLoadedCount(prev => prev + uniqueNewCollections.length)
                setHasMore(
                    newData.findCollections.length === COLLECTIONS_PER_PAGE,
                )
            } else {
                setHasMore(false)
            }
        } catch (error) {
            console.error('Error fetching more collections:', error)
            setHasMore(false)
        }
    }

    const handleFilterChange = useCallback(
        async (values: CollectionFilterSchemaType) => {
            setIsReloading(true)

            try {
                const { data } = await refetch({
                    input: {
                        ...values,
                        take: COLLECTIONS_PER_PAGE,
                        skip: 0,
                    } as FindCollectionsInput,
                })

                if (data?.findCollections) {
                    setCollections(data.findCollections as Collection[])
                    setLoadedCount(data.findCollections.length)
                    setHasMore(
                        data.findCollections.length >= COLLECTIONS_PER_PAGE,
                    )
                }
            } catch (error) {
                console.error('Error applying filters:', error)
            } finally {
                setIsReloading(false)
            }
        },
        [refetch],
    )

    const handleCreateComplete = useCallback(() => {
        setIsCreating(false)
        refetch()
    }, [refetch])

    const LoaderSkeleton = () => (
        <div className='grid grid-cols-1 gap-6 pb-4 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3'>
            {Array.from({ length: COLLECTIONS_PER_PAGE }).map((_, index) => (
                <CollectionCardSkeleton key={index} />
            ))}
        </div>
    )

    if (isCreating) {
        return (
            <CollectionPageWrapper>
                <CollectionForm
                    onComplete={handleCreateComplete}
                    onCancel={() => setIsCreating(false)}
                />
            </CollectionPageWrapper>
        )
    }

    return (
        <>
            <div className='mb-4 flex flex-col items-center gap-4 md:flex-row md:justify-between'>
                <Heading
                    title={t('heading')}
                    description={t('description')}
                    size='lg'
                />
                <Button
                    onClick={() => setIsCreating(true)}
                    className='self-start font-medium md:self-end'
                    variant='outline'
                >
                    <Plus className='mr-2 size-4' />
                    {t('createNew')}
                </Button>
            </div>

            <div className='my-4'>
                <CollectionFiltersForm
                    onFilter={handleFilterChange}
                    initialFilter={currentFilter}
                />
            </div>

            <div className='mt-5 space-y-6'>
                <InfiniteScroll
                    dataLength={collections.length}
                    next={fetchMoreCollections}
                    hasMore={hasMore && !isReloading}
                    loader={<LoaderSkeleton />}
                    style={{ overflow: 'visible' }}
                >
                    {isReloading ? (
                        <LoaderSkeleton />
                    ) : (
                        <CollectionsList
                            collections={collections}
                            isLoading={isLoading}
                            emptyMessage={t('list.emptyMessage')}
                        />
                    )}
                </InfiniteScroll>
            </div>
        </>
    )
}
