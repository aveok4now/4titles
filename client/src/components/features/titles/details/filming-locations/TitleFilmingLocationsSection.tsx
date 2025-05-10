'use client'

import type { ProcessedFilmingLocation } from '@/components/features/filming-locations/FilmingLocationsContent'
import type {
    FilmingLocation,
    Title,
    TitleFilmingLocation,
} from '@/graphql/generated/output'

import { FilmingLocationsContent } from '@/components/features/filming-locations'
import { Button } from '@/components/ui/common/button'
import { useSearchTitleFilmingLocationsLazyQuery } from '@/graphql/generated/output'
import { useAuth } from '@/hooks/useAuth'
import { getLocalizedFilmingLocationDescription } from '@/utils/filming-location/filming-location-localization'
import { getLocalizedTitleName } from '@/utils/title/title-localization'
import { MapStyle } from '@maptiler/sdk'
import { PlusCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { TitleSectionContainer } from '../TitleSectionContainer'
import { AddFilmingLocationDialog } from './dialogs'

interface TitleFilmingLocationsSectionProps {
    filmingLocations: TitleFilmingLocation[]
    title: Title
    locale: string
}

export function TitleFilmingLocationsSection({
    filmingLocations: initialFilmingLocations,
    title,
    locale,
}: TitleFilmingLocationsSectionProps) {
    const t = useTranslations('titleDetails.filmingLocations')
    const searchParams = useSearchParams()
    const locationParam = searchParams.get('location')
    const { isAuthenticated } = useAuth()

    const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
        locationParam || null,
    )
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [isSearching, setIsSearching] = useState<boolean>(false)
    const [searchResults, setSearchResults] = useState<
        TitleFilmingLocation[] | null
    >(null)
    const [isAddLocationDialogOpen, setIsAddLocationDialogOpen] =
        useState(false)

    const [searchLocationsMutation, { loading: isLoadingSearch }] =
        useSearchTitleFilmingLocationsLazyQuery()

    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const locationItemRefs = useRef<Record<string, HTMLDivElement>>({})

    useEffect(() => {
        if (locationParam) {
            setSelectedLocationId(locationParam)
            setTimeout(() => {
                const locationElement = locationItemRefs.current[locationParam]
                if (locationElement && scrollAreaRef.current) {
                    locationElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest',
                    })
                }
            }, 500)
        }
    }, [locationParam])

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
                const { data } = await searchLocationsMutation({
                    variables: {
                        titleId: title.id,
                        query: query.trim(),
                    },
                })
                const results =
                    (data?.searchTitleFilmingLocations as TitleFilmingLocation[]) ||
                    []
                setSearchResults(results)

                if (results.length > 0 && !locationParam) {
                    const firstResultId = results[0].filmingLocation!.id
                    setSelectedLocationId(firstResultId)
                    setTimeout(() => {
                        const el = locationItemRefs.current[firstResultId]
                        if (el && scrollAreaRef.current) {
                            el.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center',
                                inline: 'nearest',
                            })
                        }
                    }, 100)
                } else if (results.length === 0 && !locationParam) {
                    setSelectedLocationId(null)
                }
            } catch (error) {
                console.error('Error searching filming locations:', error)
                setSearchResults([])
                if (!locationParam) setSelectedLocationId(null)
            } finally {
                setIsSearching(false)
            }
        },
        [searchLocationsMutation, title.id, locationParam],
    )

    const processedLocationsToDisplay: ProcessedFilmingLocation[] =
        useMemo(() => {
            const locationsToProcess = searchResults || initialFilmingLocations
            return locationsToProcess
                .map(item => {
                    if (!item.filmingLocation) return null
                    const resolvedDescription = resolveLocationDescription(
                        item.filmingLocation,
                    )
                    return {
                        originalItem: item,
                        processedFilmingLocation: {
                            ...item.filmingLocation,
                            description: resolvedDescription,
                        },
                        titleForListItem: title,
                    }
                })
                .filter(Boolean) as unknown as ProcessedFilmingLocation[]
        }, [
            initialFilmingLocations,
            searchResults,
            resolveLocationDescription,
            title,
        ])

    useEffect(() => {
        if (
            !locationParam &&
            !selectedLocationId &&
            processedLocationsToDisplay.length > 0 &&
            !searchQuery
        ) {
            const firstAvailableLocation = processedLocationsToDisplay[0]
            if (firstAvailableLocation?.processedFilmingLocation) {
                setSelectedLocationId(
                    firstAvailableLocation.processedFilmingLocation.id,
                )
            }
        }
    }, [
        locationParam,
        selectedLocationId,
        processedLocationsToDisplay,
        searchQuery,
    ])

    const handleLocationClick = useCallback((locationId: string) => {
        setSelectedLocationId(locationId)
        setTimeout(() => {
            const el = locationItemRefs.current[locationId]
            if (el && scrollAreaRef.current) {
                el.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest',
                })
            }
        }, 0)
    }, [])

    const handleMarkerClick = useCallback((locationId: string) => {
        setSelectedLocationId(locationId)
        setTimeout(() => {
            const el = locationItemRefs.current[locationId]
            if (el && scrollAreaRef.current) {
                el.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest',
                })
            }
        }, 0)
    }, [])

    const handleAddLocationClick = () => {
        if (!isAuthenticated) {
            toast.error(t('addLocation.authRequiredMessage'))
            return
        }
        setIsAddLocationDialogOpen(true)
    }

    const shouldEnableClustering = useMemo(
        () => initialFilmingLocations.length > 5,
        [initialFilmingLocations],
    )

    const mapContextKey = title.tmdbId ? title.tmdbId.toString() : title.id

    if (
        initialFilmingLocations.length === 0 &&
        !isLoadingSearch &&
        !searchQuery
    )
        return null

    return (
        <TitleSectionContainer
            delay={300}
            className='relative'
            title={t('heading')}
            description={t('description', {
                title: getLocalizedTitleName(title, locale),
            })}
            action={
                <Button
                    onClick={handleAddLocationClick}
                    className='ml-0 mr-4 md:ml-8'
                    variant='outline'
                >
                    <PlusCircle className='mr-2 size-4' />
                    {t('addLocation.heading')}
                </Button>
            }
        >
            <FilmingLocationsContent
                locationsToDisplay={processedLocationsToDisplay}
                isLoading={isLoadingSearch || isSearching}
                selectedLocationId={selectedLocationId}
                onLocationListItemClick={handleLocationClick}
                onMapMarkerClick={handleMarkerClick}
                mapHeight='25rem'
                listHeight='calc(25rem - 3rem - 1rem)'
                showSearchControl
                searchQuery={searchQuery}
                onSearchHandler={handleSearch}
                isSearchingInput={isSearching}
                baseClusterSourceId='title-locations'
                mapContextKey={mapContextKey}
                searchNoResultsText={t('search.noResults')}
                scrollAreaRef={scrollAreaRef}
                locationItemRefs={locationItemRefs}
                mapStyle={MapStyle.HYBRID}
                enableMapTerrain
                enableMapProjection
                shouldEnableClustering={shouldEnableClustering}
                listItemProps={{ t }}
                titleContext={title}
                t={t}
            />
            <AddFilmingLocationDialog
                isOpen={isAddLocationDialogOpen}
                onClose={() => setIsAddLocationDialogOpen(false)}
                title={title}
            />
        </TitleSectionContainer>
    )
}
