'use client'

import { ScrollArea } from '@/components/ui/common/scroll-area'
import {
    getMapColors,
    MapMarker,
    MapRoutingToggleButton,
} from '@/components/ui/elements/map'
import { Map, MAP_DEFAULT_ZOOM } from '@/components/ui/elements/map/Map'
import { assignSequenceNumbersToMarkers } from '@/components/ui/elements/map/utils'
import type {
    FilmingLocation,
    FindUserFavoritesQuery,
    Title,
} from '@/graphql/generated/output'
import { useDeviceSize } from '@/hooks/useDeviceSize'
import { cn } from '@/utils/tw-merge'
import { ReferenceMapStyle } from '@maptiler/sdk'
import React, { useEffect, useMemo, useState } from 'react'
import { TitleFilmingLocationsListItem } from '../titles/details/filming-locations/TitleFilmingLocationsListItem'
import { TitleFilmingLocationsListSkeletons } from '../titles/details/filming-locations/TitleFilmingLocationsListItemSkeleton'
import { FilmingLocationsSearch } from './FilmingLocationsSearch'

export interface ProcessedFilmingLocation {
    originalItem: FindUserFavoritesQuery['findMyFavorites'][number]
    processedFilmingLocation: FilmingLocation & { description: string }
    titleForListItem?: Title
    initialIsFavorite?: boolean
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
    enableMapRouting?: boolean
    routeStartLocationId?: string | null
    onRoutingToggle?: (isEnabled: boolean) => void
    routingButtonTitle?: string
    routingButtonHint?: string
}

export function FilmingLocationsContent({
    locationsToDisplay,
    isLoading,
    selectedLocationId,
    onLocationListItemClick,
    onMapMarkerClick,
    mapHeight,
    listHeight,
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
    enableMapRouting = false,
    routeStartLocationId = null,
    onRoutingToggle,
    routingButtonTitle,
    routingButtonHint,
}: FilmingLocationsContentProps) {
    const { isMobile, isTablet } = useDeviceSize()
    const [isRoutingEnabled, setIsRoutingEnabled] = useState(enableMapRouting)

    const defaultMapHeight = useMemo(() => {
        if (isMobile) return '25rem'
        if (isTablet) return '30rem'
        return '40rem'
    }, [isMobile, isTablet])

    const defaultListHeight = useMemo(() => {
        if (isMobile) return '22rem'
        if (isTablet) return '27rem'
        return '37rem'
    }, [isMobile, isTablet])

    const [themeColors, setThemeColors] = useState({
        base: 'hsl(var(--primary))',
        medium: 'hsl(var(--accent))',
        large: 'hsl(var(--secondary))',
        text: 'hsl(var(--primary-foreground))',
    })

    const effectiveMapHeight = mapHeight || defaultMapHeight
    const effectiveListHeight = listHeight || defaultListHeight

    const stableClusterSourceId = useMemo(() => {
        return `${baseClusterSourceId}-${mapContextKey.replace(/\s+/g, '-').toLowerCase()}`
    }, [baseClusterSourceId, mapContextKey])

    const mapKey = useMemo(() => {
        return `map-${mapContextKey.replace(/\s+/g, '-').toLowerCase()}`
    }, [mapContextKey])

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
        setIsRoutingEnabled(enableMapRouting)
    }, [enableMapRouting])

    const handleRoutingToggle = () => {
        const newState = !isRoutingEnabled
        setIsRoutingEnabled(newState)
        onRoutingToggle?.(newState)
    }

    const markers: MapMarker[] = useMemo(() => {
        const baseMarkers = locationsToDisplay
            .filter(
                item =>
                    item.processedFilmingLocation?.coordinates &&
                    typeof item.processedFilmingLocation.coordinates.x ===
                        'number' &&
                    typeof item.processedFilmingLocation.coordinates.y ===
                        'number',
            )
            .map(item => {
                const location = item.processedFilmingLocation
                if (!location || !location.coordinates) return null

                const coordinates = location.coordinates
                if (
                    !coordinates ||
                    typeof coordinates.x !== 'number' ||
                    typeof coordinates.y !== 'number'
                ) {
                    return null
                }

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
            .filter(Boolean) as MapMarker[]

        if (isRoutingEnabled && baseMarkers.length > 1) {
            let startIndex = 0
            if (routeStartLocationId) {
                const startIdx = baseMarkers.findIndex(
                    m => m && m.id === routeStartLocationId,
                )
                if (startIdx !== -1) {
                    startIndex = startIdx
                }
            }

            return assignSequenceNumbersToMarkers(baseMarkers, startIndex)
        }

        return baseMarkers
    }, [
        locationsToDisplay,
        selectedLocationId,
        themeColors,
        isRoutingEnabled,
        routeStartLocationId,
    ])

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

    const actualListHeight = useMemo(() => {
        if (showSearchControl) {
            const searchControlHeight = '3rem'
            return `calc(${effectiveListHeight} - ${searchControlHeight})`
        }
        return effectiveListHeight
    }, [showSearchControl, effectiveListHeight])

    return (
        <div className='flex w-full flex-col gap-6 md:flex-row'>
            {locationsToDisplay.length > 0 ? (
                <>
                    <div
                        style={{ height: effectiveMapHeight }}
                        className='relative w-full md:w-1/2'
                    >
                        <Map
                            key={mapKey}
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
                                shouldEnableClustering ??
                                locationsToDisplay.length > 5
                            }
                            clusterSourceId={stableClusterSourceId}
                            clusterOptions={{
                                maxZoom: 14,
                                radius: 40,
                                colors: themeColors,
                            }}
                            selectedMarkerId={selectedLocationId || undefined}
                            enableRouting={
                                isRoutingEnabled && markers.length > 1
                            }
                            routeOptions={{
                                color: themeColors.medium,
                                width: 5,
                                opacity: 1,
                                animate: true,
                            }}
                            sequenceLabels={true}
                        />

                        {markers.length > 1 && (
                            <div className='absolute left-2 top-2 z-10'>
                                <MapRoutingToggleButton
                                    isRouteEnabled={isRoutingEnabled}
                                    onToggle={handleRoutingToggle}
                                />
                            </div>
                        )}
                    </div>
                    <div
                        style={{ height: effectiveMapHeight }}
                        className='flex w-full flex-col pr-2 md:w-1/2 md:pr-4'
                    >
                        {showSearchControl && onSearchHandler && (
                            <FilmingLocationsSearch
                                onSearch={onSearchHandler}
                                isLoading={isSearchingInput}
                            />
                        )}
                        <ScrollArea
                            style={{ height: actualListHeight }}
                            className={`flex-grow ${showSearchControl ? 'mt-2' : 'mt-0'}`}
                        >
                            <div className='space-y-4' ref={scrollAreaRef}>
                                {isLoading ? (
                                    <TitleFilmingLocationsListSkeletons
                                        count={3}
                                    />
                                ) : locationsToDisplay.length > 0 ? (
                                    locationsToDisplay.map((item, index) => (
                                        <TitleFilmingLocationsListItem
                                            key={`${item.processedFilmingLocation.id}-${index}`}
                                            location={
                                                item.processedFilmingLocation
                                            }
                                            isSelected={
                                                selectedLocationId ===
                                                item.processedFilmingLocation.id
                                            }
                                            onClick={() =>
                                                onLocationListItemClick(
                                                    item
                                                        .processedFilmingLocation
                                                        .id,
                                                )
                                            }
                                            title={
                                                item.titleForListItem ||
                                                titleContext ||
                                                ({
                                                    id: 'default-title-id',
                                                    slug: '',
                                                    originalName:
                                                        'Локация без контекста',
                                                    type: 'MOVIE',
                                                } as Title)
                                            }
                                            initialIsFavorite={
                                                item.initialIsFavorite
                                            }
                                            ref={(
                                                el: HTMLDivElement | null,
                                            ) => {
                                                if (el) {
                                                    locationItemRefs.current[
                                                        item.processedFilmingLocation.id
                                                    ] = el
                                                }
                                            }}
                                            {...listItemProps}
                                            {...(t && {
                                                t: listItemProps?.t || t,
                                            })}
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
                </>
            ) : null}
        </div>
    )
}
