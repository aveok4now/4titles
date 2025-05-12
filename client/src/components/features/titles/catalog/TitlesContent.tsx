'use client'

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/common/tabs'
import { Heading } from '@/components/ui/elements/Heading'
import {
    FindTitlesQuery,
    Title,
    TitleFilterInput,
    TitleType,
    useFindTitlesQuery,
} from '@/graphql/generated/output'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { TabConfig, TabState, TabType } from '../types'
import { TitlePosterCardSkeleton } from './TitlePosterCard'
import { TitlesList } from './TitlesList'

export interface TitlesContentProps {
    initialData: {
        all: FindTitlesQuery['findTitles']
        movies: FindTitlesQuery['findTitles']
        series: FindTitlesQuery['findTitles']
    }
    defaultTab?: string
    titlesPerPage?: number
    initialCount?: number
}

export function TitlesContent({
    initialData,
    defaultTab = 'all',
    titlesPerPage = 12,
    initialCount = 24,
}: TitlesContentProps) {
    const t = useTranslations('titles')
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const searchTerm = searchParams.get('search')

    const [activeTab, setActiveTab] = useState<TabType>(defaultTab as TabType)

    const [tabStates, setTabStates] = useState<Record<TabType, TabState>>({
        all: {
            titles: initialData.all || [],
            hasMore: (initialData.all || []).length >= initialCount,
            loadedCount: (initialData.all || []).length,
            isInitialDataLoaded: (initialData.all || []).length > 0,
        },
        movies: {
            titles: initialData.movies || [],
            hasMore: (initialData.movies || []).length >= initialCount,
            loadedCount: (initialData.movies || []).length,
            isInitialDataLoaded: (initialData.movies || []).length > 0,
        },
        series: {
            titles: initialData.series || [],
            hasMore: (initialData.series || []).length >= initialCount,
            loadedCount: (initialData.series || []).length,
            isInitialDataLoaded: (initialData.series || []).length > 0,
        },
    })

    const updateTabState = useCallback(
        (tabKey: TabType, newState: Partial<TabState>) => {
            setTabStates(prev => ({
                ...prev,
                [tabKey]: {
                    ...prev[tabKey],
                    ...newState,
                },
            }))
        },
        [],
    )

    const handleQueryCompleted = useCallback(
        (data: any, tabKey: TabType) => {
            if (data?.findTitles && !tabStates[tabKey].isInitialDataLoaded) {
                updateTabState(tabKey, {
                    titles: data.findTitles,
                    hasMore: data.findTitles.length === titlesPerPage,
                    loadedCount: data.findTitles.length,
                    isInitialDataLoaded: true,
                })
            }
        },
        [tabStates, titlesPerPage, updateTabState],
    )

    const { fetchMore: fetchMoreAll } = useFindTitlesQuery({
        variables: {
            filter: {
                searchTerm,
                take: titlesPerPage,
                skip: 0,
            } as TitleFilterInput,
        },
        fetchPolicy: 'cache-and-network',
        skip: !searchTerm && tabStates.all.isInitialDataLoaded,
        onCompleted: data => handleQueryCompleted(data, 'all'),
    })

    const { fetchMore: fetchMoreMovies } = useFindTitlesQuery({
        variables: {
            filter: {
                type: TitleType.Movie,
                searchTerm,
                take: titlesPerPage,
                skip: 0,
            } as TitleFilterInput,
        },
        fetchPolicy: 'cache-and-network',
        skip: !searchTerm && tabStates.movies.isInitialDataLoaded,
        onCompleted: data => handleQueryCompleted(data, 'movies'),
    })

    const { fetchMore: fetchMoreSeries } = useFindTitlesQuery({
        variables: {
            filter: {
                type: TitleType.Tv,
                searchTerm,
                take: titlesPerPage,
                skip: 0,
            } as TitleFilterInput,
        },
        fetchPolicy: 'cache-and-network',
        skip: !searchTerm && tabStates.series.isInitialDataLoaded,
        onCompleted: data => handleQueryCompleted(data, 'series'),
    })

    const tabConfigs: Record<TabType, TabConfig> = {
        all: {
            stateKey: 'all',
            fetchMore: fetchMoreAll,
        },
        movies: {
            type: TitleType.Movie,
            stateKey: 'movies',
            fetchMore: fetchMoreMovies,
        },
        series: {
            type: TitleType.Tv,
            stateKey: 'series',
            fetchMore: fetchMoreSeries,
        },
    }

    useEffect(() => {
        const resetStates = () => {
            const newStates: Record<TabType, TabState> = {} as Record<
                TabType,
                TabState
            >

            Object.keys(tabStates).forEach(key => {
                const tabKey = key as TabType

                if (searchTerm !== null) {
                    newStates[tabKey] = {
                        titles: [],
                        hasMore: true,
                        loadedCount: 0,
                        isInitialDataLoaded: false,
                    }
                } else {
                    const initialDataKey =
                        tabKey === 'all'
                            ? 'all'
                            : tabKey === 'movies'
                              ? 'movies'
                              : 'series'
                    const initialItems = initialData[initialDataKey] || []

                    newStates[tabKey] = {
                        titles: initialItems,
                        hasMore: initialItems.length >= initialCount,
                        loadedCount: initialItems.length,
                        isInitialDataLoaded: initialItems.length > 0,
                    }
                }
            })

            setTabStates(newStates)
        }

        resetStates()
    }, [searchTerm, initialData, initialCount])

    const handleTabChange = (value: string) => {
        setActiveTab(value as TabType)

        const params = new URLSearchParams(searchParams.toString())

        if (value === 'all') {
            params.delete('type')
        } else if (value === 'movies') {
            params.set('type', 'movies')
        } else if (value === 'series') {
            params.set('type', 'series')
        }

        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }

    const fetchMoreTitles = async (tabKey: TabType) => {
        const tabConfig = tabConfigs[tabKey]
        const tabState = tabStates[tabKey]

        if (!tabState.hasMore) return

        try {
            const { data: newData } = await tabConfig.fetchMore({
                variables: {
                    filter: {
                        ...(tabConfig.type && { type: tabConfig.type }),
                        searchTerm,
                        take: titlesPerPage,
                        skip: tabState.loadedCount,
                    },
                },
            })

            if (newData?.findTitles.length > 0) {
                const uniqueNewTitles = newData.findTitles.filter(
                    (newTitle: Title) =>
                        !tabState.titles.some(
                            existingTitle => existingTitle.id === newTitle.id,
                        ),
                )

                updateTabState(tabKey, {
                    titles: [...tabState.titles, ...uniqueNewTitles],
                    loadedCount:
                        tabState.loadedCount + newData.findTitles.length,
                    hasMore: newData.findTitles.length === titlesPerPage,
                })
            } else {
                updateTabState(tabKey, { hasMore: false })
            }
        } catch (error) {
            console.error(`Error fetching more ${tabKey} titles:`, error)
            updateTabState(tabKey, { hasMore: false })
        }
    }

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

    const TitlesScrollList = ({ tabKey }: { tabKey: TabType }) => (
        <InfiniteScroll
            dataLength={tabStates[tabKey].titles.length}
            next={() => fetchMoreTitles(tabKey)}
            hasMore={tabStates[tabKey].hasMore}
            loader={<LoaderSkeleton />}
        >
            <TitlesList titles={tabStates[tabKey].titles as Title[]} />
        </InfiniteScroll>
    )

    return (
        <>
            <Heading
                title={renderTitle()}
                description={searchTerm ? undefined : t('description')}
                size='lg'
            />

            {!searchTerm && (
                <Tabs
                    defaultValue={defaultTab}
                    className='my-4 w-full'
                    value={activeTab}
                    onValueChange={handleTabChange}
                >
                    <div className='flex w-full items-center justify-between md:max-w-3xl'>
                        <TabsList className='w-full'>
                            <TabsTrigger
                                value='all'
                                className='flex-1 text-center'
                            >
                                {t('tabs.all')}
                            </TabsTrigger>
                            <TabsTrigger
                                value='movies'
                                className='flex-1 text-center'
                            >
                                {t('tabs.movies')}
                            </TabsTrigger>
                            <TabsTrigger
                                value='series'
                                className='flex-1 text-center'
                            >
                                {t('tabs.series')}
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value='all' className='mt-5 space-y-6'>
                        <TitlesScrollList tabKey='all' />
                    </TabsContent>

                    <TabsContent value='movies' className='mt-5 space-y-6'>
                        <TitlesScrollList tabKey='movies' />
                    </TabsContent>

                    <TabsContent value='series' className='mt-5 space-y-6'>
                        <TitlesScrollList tabKey='series' />
                    </TabsContent>
                </Tabs>
            )}

            {searchTerm && (
                <div className='mt-5 space-y-6'>
                    <TitlesScrollList tabKey='all' />
                </div>
            )}
        </>
    )
}
