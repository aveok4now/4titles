'use client'

import { ScrollArea } from '@/components/ui/common/scroll-area'
import { Map, MapMarker } from '@/components/ui/elements/map/Map'
import { FilmingLocation, Title } from '@/graphql/generated/output'
import { getLocalizedFilmingLocationDescription } from '@/utils/localization/filming-location-localization'
import { cn } from '@/utils/tw-merge'
import { MapStyle } from '@maptiler/sdk'
import { useTranslations } from 'next-intl'
import { useCallback, useMemo, useState } from 'react'
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
                    popupContent: `
                        <div class="p-2 max-w-xs">
                            <h4 class="font-semibold text-sm mb-1 text-muted">${location.address || ''}</h4>
                            <p class="text-xs text-muted-foreground mb-2">${location.formattedAddress || ''}</p>
                            <p class="text-xs text-muted">${location.enhancedDescription}</p>
                        </div>
                    `,
                    iconClassName: cn(
                        'fill-black',
                        selectedLocationId === location.id
                            ? 'text-accent animate-bounce'
                            : 'text-primary',
                    ),
                    color: 'hsl(var(--primary))',
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

    const handleLocationClick = useCallback((locationId: string) => {
        setSelectedLocationId(locationId)
    }, [])

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
                        terrain={true}
                    />
                </div>
                <div className='h-[25rem] w-full md:w-1/2'>
                    <ScrollArea className='h-[25rem] w-fit'>
                        <div className='space-y-4 pr-4'>
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
                                    />
                                ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </TitleSectionContainer>
    )
}
