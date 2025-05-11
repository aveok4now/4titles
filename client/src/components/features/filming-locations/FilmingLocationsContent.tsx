'use client'

import { ScrollArea } from '@/components/ui/common/scroll-area'
import { getMapColors, MapMarker } from '@/components/ui/elements/map'
import { Map, MAP_DEFAULT_ZOOM } from '@/components/ui/elements/map/Map'
import type {
    FilmingLocation,
    FindUserFavoritesQuery,
    Title,
} from '@/graphql/generated/output'
import { cn } from '@/utils/tw-merge'
import { ReferenceMapStyle } from '@maptiler/sdk'
import React, { useEffect, useMemo, useState } from 'react'
import { TitleFilmingLocationsListItem } from '../titles/details/filming-locations/TitleFilmingLocationsListItem'
import { TitleFilmingLocationsListSkeletons } from '../titles/details/filming-locations/TitleFilmingLocationsListItemSkeleton'
import { TitleFilmingLocationsSearch } from '../titles/details/filming-locations/TitleFilmingLocationsSearch'

export interface ProcessedFilmingLocation {
    originalItem: FindUserFavoritesQuery['findMyFavorites'][number]
    processedFilmingLocation: FilmingLocation & { description: string }
    titleForListItem?: Title
}

interface FilmingLocationsContentProps {
    locationsToDisplay: ProcessedFilmingLocation[]
    isLoading: boolean
    selectedLocationId: string | null
    onLocationListItemClick: (locationId: string) => void
    onMapMarkerClick: (locationId: string) => void
    mapHeight?: string
    listHeight?: string
    showSearchControl?: boolean
    searchQuery?: string
    onSearchHandler?: (query: string) => void
    isSearchingInput?: boolean
    baseClusterSourceId: string
    mapContextKey: string
    noResultsText?: string
    searchNoResultsText?: string
    scrollAreaRef: React.RefObject<HTMLDivElement | null>
    locationItemRefs: React.MutableRefObject<Record<string, HTMLDivElement>>
    mapStyle: ReferenceMapStyle
    defaultZoom?: number
    enableMapTerrain?: boolean
    enableMapProjection?: boolean
    shouldEnableClustering?: boolean
    listItemProps?: Record<string, any>
    titleContext?: Title
    t?: (key: string, params?: any) => string
}

export function FilmingLocationsContent({
    locationsToDisplay,
    isLoading,
    selectedLocationId,
    onLocationListItemClick,
    onMapMarkerClick,
    mapHeight = '25rem',
    listHeight = '22rem',
    showSearchControl = false,
    searchQuery = '',
    onSearchHandler,
    isSearchingInput = false,
    baseClusterSourceId,
    mapContextKey,
    noResultsText,
    searchNoResultsText,
    scrollAreaRef,
    locationItemRefs,
    mapStyle,
    defaultZoom = MAP_DEFAULT_ZOOM,
    enableMapTerrain = false,
    enableMapProjection = false,
    shouldEnableClustering,
    listItemProps = {},
    titleContext,
    t,
}: FilmingLocationsContentProps) {
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

    const markers: MapMarker[] = useMemo(() => {
        return locationsToDisplay
            .filter(item => item.processedFilmingLocation?.coordinates)
            .map(item => {
                const location = item.processedFilmingLocation
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
    }, [locationsToDisplay, selectedLocationId, themeColors])

    const mapCenter = useMemo(() => {
        if (selectedLocationId) {
            const selected = locationsToDisplay.find(
                loc => loc.processedFilmingLocation?.id === selectedLocationId,
            )
            if (selected?.processedFilmingLocation?.coordinates) {
                return [
                    selected.processedFilmingLocation.coordinates.x,
                    selected.processedFilmingLocation.coordinates.y,
                ] as [number, number]
            }
        }

        const firstLocation = locationsToDisplay.find(
            loc =>
                loc.processedFilmingLocation?.coordinates &&
                typeof loc.processedFilmingLocation.coordinates.x ===
                    'number' &&
                typeof loc.processedFilmingLocation.coordinates.y === 'number',
        )

        if (firstLocation?.processedFilmingLocation) {
            return [
                firstLocation.processedFilmingLocation.coordinates!.x,
                firstLocation.processedFilmingLocation.coordinates!.y,
            ] as [number, number]
        }

        return [0, 0] as [number, number]
    }, [locationsToDisplay, selectedLocationId])

    const computedClusterSourceId = `${baseClusterSourceId}-${mapContextKey}`
    const actualListHeight =
        showSearchControl && mapHeight === '25rem' && listHeight === '22rem'
            ? 'calc(25rem - 3rem - 1rem)'
            : listHeight

    return (
        <div className='flex w-full flex-col gap-6 md:flex-row'>
            <div style={{ height: mapHeight }} className='w-full md:w-1/2'>
                <Map
                    key={mapContextKey}
                    center={mapCenter}
                    zoom={defaultZoom}
                    markers={markers}
                    height='100%'
                    width='100%'
                    style={mapStyle}
                    onMarkerClick={onMapMarkerClick}
                    terrain={enableMapTerrain}
                    projection={enableMapProjection}
                    enableClustering={
                        shouldEnableClustering ?? locationsToDisplay.length > 5
                    }
                    clusterSourceId={computedClusterSourceId}
                    clusterOptions={{
                        maxZoom: 14,
                        radius: 40,
                        colors: themeColors,
                    }}
                    selectedMarkerId={selectedLocationId || undefined}
                />
            </div>
            <div
                style={{ height: mapHeight }}
                className='flex w-full flex-col pr-2 md:w-1/2 md:pr-4'
            >
                {showSearchControl && onSearchHandler && (
                    <TitleFilmingLocationsSearch
                        onSearch={onSearchHandler}
                        isLoading={isSearchingInput}
                    />
                )}
                <ScrollArea
                    style={{
                        height: showSearchControl
                            ? actualListHeight
                            : listHeight,
                    }}
                    className={`flex-grow ${showSearchControl ? 'mt-2' : 'mt-0'}`}
                >
                    <div className='space-y-4' ref={scrollAreaRef}>
                        {isLoading ? (
                            <TitleFilmingLocationsListSkeletons count={3} />
                        ) : locationsToDisplay.length > 0 ? (
                            locationsToDisplay.map((item, index) => (
                                <TitleFilmingLocationsListItem
                                    key={`${item.processedFilmingLocation.id}-${index}`}
                                    location={item.processedFilmingLocation}
                                    isSelected={
                                        selectedLocationId ===
                                        item.processedFilmingLocation.id
                                    }
                                    onClick={() =>
                                        onLocationListItemClick(
                                            item.processedFilmingLocation.id,
                                        )
                                    }
                                    title={
                                        item.titleForListItem || titleContext!
                                    }
                                    ref={(el: HTMLDivElement | null) => {
                                        if (el) {
                                            locationItemRefs.current[
                                                item.processedFilmingLocation.id
                                            ] = el
                                        }
                                    }}
                                    {...listItemProps}
                                    {...(t && { t: listItemProps?.t || t })}
                                />
                            ))
                        ) : searchQuery &&
                          showSearchControl &&
                          searchNoResultsText ? (
                            <div className='py-4 text-center text-muted-foreground'>
                                {searchNoResultsText}
                            </div>
                        ) : noResultsText &&
                          !showSearchControl &&
                          !isLoading ? (
                            <div className='py-4 text-center text-muted-foreground'>
                                {noResultsText}
                            </div>
                        ) : null}
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}
