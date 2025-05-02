'use client'

import type { FilmingLocation, Title } from '@/graphql/generated/output'

import { cn } from '@/utils/tw-merge'

import { ScrollArea } from '@/components/ui/common/scroll-area'
import { Map, type MapMarker } from '@/components/ui/elements/map/Map'
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
                      enhancedDescription: resolveLocationDescription(
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
                    color: 'hsl(var(--primary))',
                    className: 'cursor-pointer',
                }
            })
    }, [enhancedLocations, selectedLocationId])

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
                block: 'nearest',
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

    useEffect(() => {
        if (selectedLocationId) {
            scrollToLocation(selectedLocationId)
        }
    }, [selectedLocationId, scrollToLocation])

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
                        zoom={12}
                        markers={markers}
                        height='25rem'
                        width='100%'
                        style={MapStyle.HYBRID}
                        onMarkerClick={handleMarkerClick}
                        terrain
                        projection
                    />
                </div>
                <div className='h-[25rem] w-full md:w-1/2'>
                    <ScrollArea className='h-[25rem] w-fit'>
                        <div className='space-y-4 pr-4' ref={scrollAreaRef}>
                            {enhancedLocations
                                .filter(item => item.filmingLocation)
                                .map(item => (
                                    <TitleFilmingLocationsListItem
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
