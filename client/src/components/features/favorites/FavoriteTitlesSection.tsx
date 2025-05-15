'use client'

import FadeContent from '@/components/ui/custom/content/fade-content'
import { Heading } from '@/components/ui/elements/Heading'
import {
    FavorableType,
    FindUserFavoritesQuery,
    Title,
    useFindUserFavoritesQuery,
} from '@/graphql/generated/output'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { TitlesList } from '../titles/catalog'
import { TitlePosterCardSkeleton } from '../titles/catalog/TitlePosterCard'

const TITLES_PER_PAGE = 12
const FETCH_DELAY_MS = 400

interface FavoriteTitlesSectionProps {
    initialTitles?: FindUserFavoritesQuery['findMyFavorites']
}

export function FavoriteTitlesSection({
    initialTitles = [],
}: FavoriteTitlesSectionProps) {
    const t = useTranslations('favorites.titles')

    const [favoriteTitles, setFavoriteTitles] = useState<Title[]>(
        initialTitles.filter(fav => fav.title).map(fav => fav.title as Title),
    )
    const [hasMore, setHasMore] = useState(true)

    const {
        data,
        fetchMore,
        loading: isLoading,
    } = useFindUserFavoritesQuery({
        variables: {
            filters: {
                favorableType: FavorableType.Title,
                take: TITLES_PER_PAGE,
                skip: 0,
            },
        },
        fetchPolicy: 'cache-and-network',
    })

    useEffect(() => {
        if (data?.findMyFavorites) {
            const titles = data.findMyFavorites
                .filter(fav => fav.title)
                .map(fav => fav.title as Title)

            const uniqueTitles = Array.from(
                new Map(titles.map(title => [title.id, title])).values(),
            )

            setFavoriteTitles(uniqueTitles)
            setHasMore(titles.length === TITLES_PER_PAGE)
        }
    }, [data])

    const fetchMoreFavoriteTitles = async () => {
        if (!hasMore) return

        setTimeout(async () => {
            const { data: newData } = await fetchMore({
                variables: {
                    filters: {
                        favorableType: FavorableType.Title,
                        take: TITLES_PER_PAGE,
                        skip: favoriteTitles.length,
                    },
                },
            })

            const newTitles = newData.findMyFavorites
                .filter(fav => fav.title)
                .map(fav => fav.title as Title)

            if (newTitles.length > 0) {
                setFavoriteTitles(prev => {
                    const existingIds = new Set(prev.map(title => title.id))
                    const uniqueNewTitles = newTitles.filter(
                        title => !existingIds.has(title.id),
                    )
                    return [...prev, ...uniqueNewTitles]
                })
                setHasMore(newTitles.length === TITLES_PER_PAGE)
            } else {
                setHasMore(false)
            }
        }, FETCH_DELAY_MS)
    }

    if (favoriteTitles.length === 0 && !isLoading) {
        return (
            <FadeContent blur delay={500}>
                <Heading
                    title={t('noTitles.heading')}
                    description={t('noTitles.description')}
                />
            </FadeContent>
        )
    }

    return (
        <div className='space-y-6'>
            <InfiniteScroll
                dataLength={favoriteTitles.length}
                next={fetchMoreFavoriteTitles}
                hasMore={hasMore}
                loader={
                    <div className='grid grid-cols-2 gap-3 overflow-hidden pb-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
                        {Array.from({ length: TITLES_PER_PAGE }).map((_, i) => (
                            <TitlePosterCardSkeleton key={i} />
                        ))}
                    </div>
                }
            >
                <TitlesList titles={favoriteTitles} isFavoriteOverride={true} />
            </InfiniteScroll>
        </div>
    )
}
