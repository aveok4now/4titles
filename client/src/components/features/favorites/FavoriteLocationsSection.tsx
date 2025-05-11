'use client'

import {
    FilmingLocationsContent,
    type ProcessedFilmingLocation,
} from '@/components/features/filming-locations/FilmingLocationsContent'
import FadeContent from '@/components/ui/custom/content/fade-content'
import { Heading } from '@/components/ui/elements/Heading'
import {
    FavoriteType,
    FilmingLocation,
    Title,
    useFindUserFavoritesQuery,
    useSearchFilmingLocationsByIdsLazyQuery,
} from '@/graphql/generated/output'
import { getLocalizedFilmingLocationDescription } from '@/utils/filming-location/filming-location-localization'
import { MapStyle } from '@maptiler/sdk'
import { useLocale, useTranslations } from 'next-intl'
import { useCallback, useMemo, useState } from 'react'
import { useLocationSelection } from '../filming-locations/hooks'

export function FavoriteLocationsSection() {
    const t = useTranslations('favorites.locations')
    const commonT = useTranslations('titleDetails.filmingLocations')
    const locale = useLocale()

    const [searchQuery, setSearchQuery] = useState<string>('')
    const [isSearching, setIsSearching] = useState<boolean>(false)
    const [searchResults, setSearchResults] = useState<
        FilmingLocation[] | null
    >(null)

    const { data: favoritesData, loading: isLoadingFavorites } =
        useFindUserFavoritesQuery({
            variables: {
                filters: {
                    type: FavoriteType.Location,
                },
            },
            fetchPolicy: 'cache-and-network',
        })

    const [searchLocationsByIdsMutation] =
        useSearchFilmingLocationsByIdsLazyQuery()

    const resolveLocationDescription = useCallback(
        (location: FilmingLocation) => {
            return locale
                ? getLocalizedFilmingLocationDescription(location, locale) ||
                      location.description ||
                      ''
                : location.description || ''
        },
        [locale],
    )

    const allFavoriteLocations = useMemo(() => {
        if (!favoritesData?.findMyFavorites) return []
        return favoritesData.findMyFavorites.filter(
            fav =>
                fav.type === FavoriteType.Location &&
                fav.filmingLocation &&
                fav.filmingLocationTitle,
        )
    }, [favoritesData])

    const processedFavoriteLocations: ProcessedFilmingLocation[] =
        useMemo(() => {
            if (allFavoriteLocations.length === 0) return []

            if (searchResults && searchResults.length > 0) {
                const searchResultIds = new Set(
                    searchResults.map(loc => loc.id),
                )

                return allFavoriteLocations
                    .filter(
                        fav =>
                            fav.filmingLocation &&
                            searchResultIds.has(fav.filmingLocation.id),
                    )
                    .map(fav => {
                        if (!fav.filmingLocation) return null
                        const resolvedDescription = resolveLocationDescription(
                            fav.filmingLocation as FilmingLocation,
                        )
                        return {
                            originalItem: fav,
                            processedFilmingLocation: {
                                ...fav.filmingLocation,
                                description: resolvedDescription,
                            },
                            titleForListItem: fav.filmingLocationTitle as Title,
                        }
                    })
                    .filter(Boolean) as ProcessedFilmingLocation[]
            }

            return allFavoriteLocations
                .map(fav => {
                    if (!fav.filmingLocation) return null
                    const resolvedDescription = resolveLocationDescription(
                        fav.filmingLocation as FilmingLocation,
                    )
                    return {
                        originalItem: fav,
                        processedFilmingLocation: {
                            ...fav.filmingLocation,
                            description: resolvedDescription,
                        },
                        titleForListItem: fav.filmingLocationTitle as Title,
                    }
                })
                .filter(Boolean) as ProcessedFilmingLocation[]
        }, [allFavoriteLocations, searchResults, resolveLocationDescription])

    const locationIds = useMemo(
        () =>
            processedFavoriteLocations.map(item => ({
                id: item.processedFilmingLocation.id,
            })),
        [processedFavoriteLocations],
    )

    const {
        selectedLocationId,
        scrollAreaRef,
        locationItemRefs,
        handleLocationClick,
        handleMarkerClick,
    } = useLocationSelection({
        locations: locationIds,
        defaultToFirstLocation: true,
    })

    const handleSearch = useCallback(
        async (query: string) => {
            setSearchQuery(query)

            if (!query.trim()) {
                setIsSearching(false)
                setSearchResults(null)
                return
            }

            if (query.trim().length < 3) return

            setIsSearching(true)
            try {
                const favoriteLocationIds = allFavoriteLocations
                    .filter(fav => fav.filmingLocation)
                    .map(fav => fav.filmingLocation!.id)

                if (favoriteLocationIds.length === 0) {
                    setSearchResults([])
                    setIsSearching(false)
                    return
                }

                const { data } = await searchLocationsByIdsMutation({
                    variables: {
                        locationIds: favoriteLocationIds,
                        query: query.trim(),
                    },
                })

                const results = data?.searchFilmingLocationsByIds || []

                const uniqueLocations = new Map<string, FilmingLocation>()
                results.forEach(result => {
                    if (result.filmingLocation) {
                        uniqueLocations.set(
                            result.filmingLocation.id,
                            result.filmingLocation as FilmingLocation,
                        )
                    }
                })

                const locationResults = Array.from(uniqueLocations.values())
                setSearchResults(locationResults)

                if (locationResults.length > 0) {
                    const firstResultId = locationResults[0].id
                    handleLocationClick(firstResultId)

                    setTimeout(() => {
                        if (
                            locationItemRefs.current[firstResultId] &&
                            scrollAreaRef.current
                        ) {
                            locationItemRefs.current[
                                firstResultId
                            ].scrollIntoView({
                                behavior: 'smooth',
                                block: 'center',
                            })
                        }
                    }, 100)
                }
            } catch (error) {
                console.error('Error searching favorite locations:', error)
                setSearchResults([])
            } finally {
                setIsSearching(false)
            }
        },
        [
            allFavoriteLocations,
            searchLocationsByIdsMutation,
            handleLocationClick,
        ],
    )

    const mapContextKey = useMemo(() => {
        return 'global-favorites-map'
    }, [])

    const clusterSourceId = useMemo(() => {
        return 'favorite-locations'
    }, [])

    if (!isLoadingFavorites && allFavoriteLocations.length === 0) {
        return (
            <FadeContent blur duration={500}>
                <Heading
                    title={t('noLocations.heading')}
                    description={t('noLocations.description')}
                    size='md'
                />
            </FadeContent>
        )
    }

    return (
        <div className='space-y-4'>
            <FilmingLocationsContent
                locationsToDisplay={processedFavoriteLocations}
                isLoading={isLoadingFavorites || isSearching}
                selectedLocationId={selectedLocationId}
                onLocationListItemClick={handleLocationClick}
                onMapMarkerClick={handleMarkerClick}
                onSearchHandler={handleSearch}
                mapHeight='30rem'
                listHeight='calc(30rem - 1rem)'
                showSearchControl
                baseClusterSourceId={clusterSourceId}
                mapContextKey={mapContextKey}
                scrollAreaRef={scrollAreaRef}
                locationItemRefs={locationItemRefs}
                mapStyle={MapStyle.HYBRID}
                enableMapTerrain
                enableMapProjection
                searchNoResultsText={commonT('search.noResults')}
                t={commonT}
            />
        </div>
    )
}
