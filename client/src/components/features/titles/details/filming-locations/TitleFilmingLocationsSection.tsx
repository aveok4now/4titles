'use client'

import type { FilmingLocation, Title } from '@/graphql/generated/output'

import { cn } from '@/utils/tw-merge'

import { ScrollArea } from '@/components/ui/common/scroll-area'
import { MapMarker } from '@/components/ui/elements/map'
import { Map, MAP_DEFAULT_ZOOM } from '@/components/ui/elements/map/Map'
import { getMapColors } from '@/components/ui/elements/map/utils'
import { getLocalizedFilmingLocationDescription } from '@/utils/localization/filming-location-localization'
import { MapStyle } from '@maptiler/sdk'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getLocalizedTitleName } from '../../../../../utils/localization/title-localization'
import { TitleSectionContainer } from '../TitleSectionContainer'
import { TitleFilmingLocationsListItem } from './TitleFilmingLocationsListItem'

interface TitleLocationsSectionProps {
    filmingLocations: NonNullable<Title['filmingLocations']>
    title: Title
    locale: string
}

export function TitleFilmingLocationsSection({
    filmingLocations,
    title,
    locale,
}: TitleLocationsSectionProps) {
    const t = useTranslations('titleDetails.filmingLocations')
    const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
        null,
    )
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

    const enhancedLocations = useMemo(() => {
        return filmingLocations.map(item => ({
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
    }, [filmingLocations, resolveLocationDescription])

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
            setSelectedLocationId(firstLocation.filmingLocation.id)
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

    const shouldEnableClustering = filmingLocations.length > 5

    if (filmingLocations.length === 0) {
        return null
    }

    return (
        <TitleSectionContainer
            delay={300}
            className='relative'
            title={t('heading')}
            description={t('description', {
                title: getLocalizedTitleName(title, locale),
            })}
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
                <div className='h-[25rem] w-full md:w-1/2'>
                    <ScrollArea className='h-[25rem]'>
                        <div
                            className='space-y-4 pr-2 md:pr-4'
                            ref={scrollAreaRef}
                        >
                            {enhancedLocations
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
                                        ref={(el: HTMLDivElement | null) => {
                                            if (el) {
                                                locationItemRefs.current[
                                                    item.filmingLocation!.id
                                                ] = el
                                            }
                                        }}
                                    />
                                ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </TitleSectionContainer>
    )
}
