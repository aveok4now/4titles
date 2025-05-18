'use client'

import { Heading } from '@/components/ui/elements/Heading'
import {
    FavorableType,
    FilmingLocation,
    LocationCollectionItem,
    Title,
    TitleType,
    useSearchFilmingLocationsByIdsLazyQuery,
} from '@/graphql/generated/output'
import { getLocalizedFilmingLocationDescription } from '@/utils/filming-location/filming-location-localization'
import { getLocalizedTitleName } from '@/utils/title/title-localization'
import { MapStyle } from '@maptiler/sdk'
import { useLocale, useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
    FilmingLocationsContent,
    ProcessedFilmingLocation,
} from '../../filming-locations/FilmingLocationsContent'
import { useLocationSelection } from '../../filming-locations/hooks'

interface LocationCollectionViewProps {
    locations: LocationCollectionItem[]
    collectionId: string
}

export function LocationCollectionView({
    locations,
    collectionId,
}: LocationCollectionViewProps) {
    const t = useTranslations('collections.details')
    const commonT = useTranslations('titleDetails.filmingLocations')
    const locale = useLocale()

    const [searchQuery, setSearchQuery] = useState<string>('')
    const [isSearching, setIsSearching] = useState<boolean>(false)
    const [searchResults, setSearchResults] = useState<
        FilmingLocation[] | null
    >(null)

    const locationItemRefs = useRef<Record<string, HTMLDivElement>>({})
    const scrollAreaRef = useRef<HTMLDivElement | null>(null)

    const [searchLocationsByIdsMutation] =
        useSearchFilmingLocationsByIdsLazyQuery()

    const resolveLocationDescription = useCallback(
        (location: FilmingLocation) => {
            if (
                location.titleFilmingLocations &&
                location.titleFilmingLocations.length > 0
            ) {
                const titleNames = location.titleFilmingLocations
                    .filter(item => item.title)
                    .map(item =>
                        getLocalizedTitleName(item.title as Title, locale),
                    )
                    .filter(Boolean)

                if (titleNames.length > 0) {
                    return commonT('filmingTitles', {
                        titles: titleNames.join(', '),
                    })
                }
            }

            return locale
                ? getLocalizedFilmingLocationDescription(location, locale) ||
                      location.description ||
                      ''
                : location.description || ''
        },
        [locale, commonT],
    )

    const allCollectionLocations = locations
        .filter(item => item.location && item.location.id && item.locationId)
        .sort((a, b) => a.position - b.position)

    const processedLocations: ProcessedFilmingLocation[] = (() => {
        if (allCollectionLocations.length === 0) return []

        const locationsToProcess = searchResults
            ? allCollectionLocations.filter(item =>
                  searchResults.some(r => r.id === item.location.id),
              )
            : allCollectionLocations

        const result = locationsToProcess
            .map(item => {
                const location = item.location
                if (!location || !location.id) return null

                let titleContext: Title | undefined = undefined

                if (
                    location.titleFilmingLocations &&
                    location.titleFilmingLocations.length > 0 &&
                    location.titleFilmingLocations[0].title
                ) {
                    titleContext = location.titleFilmingLocations[0]
                        .title as Title
                }

                if (!titleContext) {
                    titleContext = {
                        id: 'default-title-id',
                        slug: '',
                        originalName: 'Коллекция локаций',
                        type: TitleType.Movie,
                    } as Title
                }

                const resolvedDescription = resolveLocationDescription(location)

                return {
                    originalItem: {
                        id: item.id,
                        favorableType: FavorableType.Location,
                        createdAt: item.createdAt,
                        filmingLocation: location,
                        contextTitle: titleContext,
                    },
                    processedFilmingLocation: {
                        ...location,
                        description: resolvedDescription,
                    },
                    titleForListItem: titleContext,
                    initialIsFavorite: false,
                }
            })
            .filter(Boolean) as unknown as ProcessedFilmingLocation[]

        return result
    })()

    const locationIds = processedLocations.map(item => ({
        id: item.processedFilmingLocation.id,
    }))

    const { selectedLocationId, handleLocationClick, handleMarkerClick } =
        useLocationSelection({
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
                const locationIds = allCollectionLocations
                    .filter(item => item.location && item.location.id)
                    .map(item => item.location.id)

                if (locationIds.length === 0) {
                    setSearchResults([])
                    setIsSearching(false)
                    return
                }

                const { data } = await searchLocationsByIdsMutation({
                    variables: {
                        locationIds,
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
                    const orderedLocations = allCollectionLocations.filter(
                        item =>
                            locationResults.some(
                                r => r.id === item.location.id,
                            ),
                    )

                    if (orderedLocations.length > 0) {
                        const firstLocationId = orderedLocations[0].location.id
                        handleLocationClick(firstLocationId)

                        setTimeout(() => {
                            if (
                                locationItemRefs.current[firstLocationId] &&
                                scrollAreaRef.current
                            ) {
                                locationItemRefs.current[
                                    firstLocationId
                                ].scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'center',
                                })
                            }
                        }, 100)
                    }
                }
            } catch (error) {
                console.error('Error searching collection locations:', error)
                setSearchResults([])
            } finally {
                setIsSearching(false)
            }
        },
        [
            allCollectionLocations,
            searchLocationsByIdsMutation,
            handleLocationClick,
        ],
    )

    const mapContextKey = useMemo(() => {
        return `collection-${collectionId}-${locations.length}-${Date.now()}`
    }, [collectionId, locations.length])

    const clusterSourceId = useMemo(() => {
        return `collection-locations-${collectionId}-${locations.length}`
    }, [collectionId, locations.length])

    useEffect(() => {
        if (processedLocations.length > 0 && locationIds.length > 0) {
            const firstLocationId = locationIds[0].id
            if (firstLocationId) {
                handleLocationClick(firstLocationId)
            }
        }
    }, [locations.length, processedLocations.length])

    if (!locations.length) return null

    return (
        <div className='space-y-4'>
            <Heading title={t('locationCollection.heading')} />

            {processedLocations.length > 0 && (
                <FilmingLocationsContent
                    locationsToDisplay={processedLocations}
                    isLoading={isSearching}
                    selectedLocationId={selectedLocationId}
                    onLocationListItemClick={handleLocationClick}
                    onMapMarkerClick={handleMarkerClick}
                    baseClusterSourceId={clusterSourceId}
                    mapContextKey={mapContextKey}
                    scrollAreaRef={scrollAreaRef}
                    locationItemRefs={locationItemRefs}
                    mapStyle={MapStyle.HYBRID}
                    enableMapTerrain
                    enableMapProjection
                    shouldEnableClustering
                    showSearchControl
                    searchQuery={searchQuery}
                    onSearchHandler={handleSearch}
                    isSearchingInput={isSearching}
                    searchNoResultsText={t('search.noResults')}
                    t={commonT}
                />
            )}
        </div>
    )
}
