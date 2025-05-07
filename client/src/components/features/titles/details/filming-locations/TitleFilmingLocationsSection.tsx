'use client'

import type {
    FilmingLocation,
    Title,
    TitleFilmingLocation,
} from '@/graphql/generated/output'

import { cn } from '@/utils/tw-merge'

import { Button } from '@/components/ui/common/button'
import { ScrollArea } from '@/components/ui/common/scroll-area'
import { MapMarker } from '@/components/ui/elements/map'
import { Map, MAP_DEFAULT_ZOOM } from '@/components/ui/elements/map/Map'
import { getMapColors } from '@/components/ui/elements/map/utils'
import { useSearchTitleFilmingLocationsLazyQuery } from '@/graphql/generated/output'
import { useAuth } from '@/hooks/useAuth'
import { getLocalizedFilmingLocationDescription } from '@/utils/localization/filming-location-localization'
import { MapStyle } from '@maptiler/sdk'
import { PlusCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { getLocalizedTitleName } from '../../../../../utils/localization/title-localization'
import { TitleSectionContainer } from '../TitleSectionContainer'
import { TitleFilmingLocationsListItem } from './TitleFilmingLocationsListItem'
import { TitleFilmingLocationsListSkeletons } from './TitleFilmingLocationsListItemSkeleton'
import { TitleFilmingLocationsSearch } from './TitleFilmingLocationsSearch'
import { AddFilmingLocationDialog } from './dialogs'

interface TitleLocationsSectionProps {
    filmingLocations: TitleFilmingLocation[]
    title: Title
    locale: string
}

export function TitleFilmingLocationsSection({
    filmingLocations,
    title,
    locale,
}: TitleLocationsSectionProps) {
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
        typeof filmingLocations | null
    >(null)
    const [isAddLocationDialogOpen, setIsAddLocationDialogOpen] =
        useState(false)

    const [searchLocations, { loading: isLoadingSearch }] =
        useSearchTitleFilmingLocationsLazyQuery()

    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const locationItemRefs = useRef<Record<string, HTMLDivElement>>({})
    const [themeColors, setThemeColors] = useState({
        base: 'hsl(var(--primary))',
        medium: 'hsl(var(--accent))',
        large: 'hsl(var(--secondary))',
        text: 'hsl(var(--primary-foreground))',
    })

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const mapColors = getMapColors()
            setThemeColors({
                base: mapColors.primary,
                medium: mapColors.accent,
                large: mapColors.secondary,
                text: mapColors.primaryForeground,
            })
        }
    }, [])

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
                const { data } = await searchLocations({
                    variables: {
                        titleId: title.id,
                        query: query.trim(),
                    },
                })

                if (data?.searchTitleFilmingLocations) {
                    setSearchResults(
                        data.searchTitleFilmingLocations as TitleFilmingLocation[],
                    )
                }
            } catch (error) {
                console.error('Error searching filming locations:', error)
            } finally {
                setIsSearching(false)
            }
        },
        [searchLocations, title.id],
    )

    const enhancedLocations = useMemo(() => {
        const locationsToProcess = searchResults || filmingLocations

        return locationsToProcess.map(item => ({
            ...item,
            filmingLocation: item.filmingLocation
                ? {
                      ...item.filmingLocation,
                      description: resolveLocationDescription(
                          item.filmingLocation,
                      ),
                  }
                : null,
        }))
    }, [filmingLocations, resolveLocationDescription, searchResults])

    const markers: MapMarker[] = useMemo(() => {
        return enhancedLocations
            .filter(item => item.filmingLocation?.coordinates)
            .map(item => {
                const location = item.filmingLocation!
                const coordinates = location.coordinates!
                return {
                    coordinates: [coordinates.x, coordinates.y] as [
                        number,
                        number,
                    ],
                    title: location.address || '',
                    id: location.id,
                    iconClassName: cn(
                        'fill-black',
                        selectedLocationId === location.id
                            ? 'text-accent animate-bounce'
                            : 'text-primary',
                    ),
                    color:
                        selectedLocationId === location.id
                            ? themeColors.medium
                            : themeColors.base,
                    className: 'cursor-pointer',
                }
            })
    }, [enhancedLocations, selectedLocationId, themeColors])

    const mapCenter = useMemo(() => {
        if (selectedLocationId) {
            const selected = enhancedLocations.find(
                loc => loc.filmingLocation?.id === selectedLocationId,
            )
            if (selected?.filmingLocation?.coordinates) {
                return [
                    selected.filmingLocation.coordinates.x,
                    selected.filmingLocation.coordinates.y,
                ] as [number, number]
            }
        }

        const firstLocation = enhancedLocations.find(
            loc =>
                loc.filmingLocation?.coordinates &&
                typeof loc.filmingLocation.coordinates.x === 'number' &&
                typeof loc.filmingLocation.coordinates.y === 'number',
        )

        if (firstLocation?.filmingLocation) {
            if (!selectedLocationId) {
                setSelectedLocationId(firstLocation.filmingLocation.id)
            }
            return [
                firstLocation.filmingLocation.coordinates?.x,
                firstLocation.filmingLocation.coordinates?.y,
            ] as [number, number]
        }

        return [0, 0] as [number, number]
    }, [enhancedLocations, selectedLocationId])

    const scrollToLocation = useCallback((locationId: string) => {
        const locationElement = locationItemRefs.current[locationId]
        if (locationElement && scrollAreaRef.current) {
            locationElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest',
            })
        }
    }, [])

    const handleLocationClick = useCallback(
        (locationId: string) => {
            setSelectedLocationId(locationId)
            scrollToLocation(locationId)
        },
        [scrollToLocation],
    )

    const handleMarkerClick = useCallback(
        (locationId: string) => {
            setSelectedLocationId(locationId)
            scrollToLocation(locationId)
        },
        [scrollToLocation],
    )

    const handleAddLocationClick = () => {
        if (!isAuthenticated) {
            toast.error(t('addLocation.authRequiredMessage'))
            return
        }
        setIsAddLocationDialogOpen(true)
    }

    const shouldEnableClustering = filmingLocations.length > 5

    if (filmingLocations.length === 0) return null

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
            <div className='flex flex-col gap-6 md:flex-row'>
                <div className='h-[25rem] w-full md:w-1/2'>
                    <Map
                        center={mapCenter}
                        zoom={MAP_DEFAULT_ZOOM}
                        markers={markers}
                        height='25rem'
                        width='100%'
                        style={MapStyle.HYBRID}
                        onMarkerClick={handleMarkerClick}
                        terrain
                        projection
                        enableClustering={shouldEnableClustering}
                        clusterSourceId={`title-${title.tmdbId}-locations`}
                        clusterOptions={{
                            maxZoom: 14,
                            radius: 40,
                            colors: themeColors,
                        }}
                        selectedMarkerId={selectedLocationId || undefined}
                    />
                </div>
                <div className='h-[25rem] w-full pr-2 md:w-1/2 md:pr-4'>
                    <TitleFilmingLocationsSearch
                        onSearch={handleSearch}
                        isLoading={isLoadingSearch || isSearching}
                    />

                    <ScrollArea className='h-[22rem]'>
                        <div className='space-y-4' ref={scrollAreaRef}>
                            {isLoadingSearch || isSearching ? (
                                <TitleFilmingLocationsListSkeletons count={3} />
                            ) : enhancedLocations.length > 0 ? (
                                enhancedLocations
                                    .filter(item => item.filmingLocation)
                                    .map(item => (
                                        <TitleFilmingLocationsListItem
                                            t={t}
                                            key={item.filmingLocation!.id}
                                            location={item.filmingLocation!}
                                            isSelected={
                                                selectedLocationId ===
                                                item.filmingLocation!.id
                                            }
                                            onClick={() =>
                                                handleLocationClick(
                                                    item.filmingLocation!.id,
                                                )
                                            }
                                            title={title}
                                            locale={locale}
                                            ref={(
                                                el: HTMLDivElement | null,
                                            ) => {
                                                if (el) {
                                                    locationItemRefs.current[
                                                        item.filmingLocation!.id
                                                    ] = el
                                                }
                                            }}
                                        />
                                    ))
                            ) : searchQuery && searchQuery.length >= 3 ? (
                                <div className='py-4 text-center text-muted-foreground'>
                                    {t('search.noResults')}
                                </div>
                            ) : null}
                        </div>
                    </ScrollArea>
                </div>
            </div>

            <AddFilmingLocationDialog
                isOpen={isAddLocationDialogOpen}
                onClose={() => setIsAddLocationDialogOpen(false)}
                title={title}
            />
        </TitleSectionContainer>
    )
}
