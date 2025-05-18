'use client'

import FadeContent from '@/components/ui/custom/content/fade-content'
import { Heading } from '@/components/ui/elements/Heading'
import {
    Collection,
    FavorableType,
    FindUserFavoritesQuery,
    useFindUserFavoritesQuery,
} from '@/graphql/generated/output'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { CollectionCardSkeleton } from '../collections/CollectionCard'
import { CollectionsList } from '../collections/CollectionsList'

const COLLECTIONS_PER_PAGE = 12
const FETCH_DELAY_MS = 400

interface FavoriteCollectionsSectionProps {
    initialCollections?: FindUserFavoritesQuery['findMyFavorites']
}

export function FavoriteCollectionsSection({
    initialCollections = [],
}: FavoriteCollectionsSectionProps) {
    const t = useTranslations('favorites.collections')

    const [favoriteCollections, setFavoriteCollections] = useState<
        Collection[]
    >(
        initialCollections
            .filter(fav => fav.collection)
            .map(fav => fav.collection as Collection),
    )
    const [hasMore, setHasMore] = useState(true)

    const {
        data,
        fetchMore,
        loading: isLoading,
    } = useFindUserFavoritesQuery({
        variables: {
            filters: {
                favorableType: FavorableType.Collection,
                take: COLLECTIONS_PER_PAGE,
                skip: 0,
            },
        },
        fetchPolicy: 'cache-and-network',
    })

    useEffect(() => {
        if (data?.findMyFavorites) {
            const collections = data.findMyFavorites
                .filter(fav => fav.collection)
                .map(fav => fav.collection as Collection)

            const uniqueCollections = Array.from(
                new Map(
                    collections.map(collection => [collection.id, collection]),
                ).values(),
            )

            setFavoriteCollections(uniqueCollections)
            setHasMore(collections.length === COLLECTIONS_PER_PAGE)
        }
    }, [data])

    const fetchMoreFavoriteCollections = async () => {
        if (!hasMore) return

        setTimeout(async () => {
            const { data: newData } = await fetchMore({
                variables: {
                    filters: {
                        favorableType: FavorableType.Collection,
                        take: COLLECTIONS_PER_PAGE,
                        skip: favoriteCollections.length,
                    },
                },
            })

            const newCollections = newData.findMyFavorites
                .filter(fav => fav.collection)
                .map(fav => fav.collection as Collection)

            if (newCollections.length > 0) {
                setFavoriteCollections(prev => {
                    const existingIds = new Set(
                        prev.map(collection => collection.id),
                    )
                    const uniqueNewCollections = newCollections.filter(
                        collection => !existingIds.has(collection.id),
                    )
                    return [...prev, ...uniqueNewCollections]
                })
                setHasMore(newCollections.length === COLLECTIONS_PER_PAGE)
            } else {
                setHasMore(false)
            }
        }, FETCH_DELAY_MS)
    }

    if (favoriteCollections.length === 0 && !isLoading) {
        return (
            <FadeContent blur delay={500}>
                <Heading
                    title={t('noCollections.heading')}
                    description={t('noCollections.description')}
                />
            </FadeContent>
        )
    }

    return (
        <div className='space-y-6'>
            <InfiniteScroll
                dataLength={favoriteCollections.length}
                next={fetchMoreFavoriteCollections}
                hasMore={hasMore}
                loader={
                    <div className='grid grid-cols-1 gap-6 pb-4 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3'>
                        {Array.from({ length: COLLECTIONS_PER_PAGE }).map(
                            (_, i) => (
                                <CollectionCardSkeleton key={i} />
                            ),
                        )}
                    </div>
                }
                style={{ overflow: 'visible' }}
            >
                <CollectionsList collections={favoriteCollections} />
            </InfiniteScroll>
        </div>
    )
}
