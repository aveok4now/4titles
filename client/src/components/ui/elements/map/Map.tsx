'use client'

import '@maptiler/geocoding-control/style.css'
import '@maptiler/sdk/dist/maptiler-sdk.css'

import * as maptilersdk from '@maptiler/sdk'
import type { MapProps } from './types'

import { memo, useEffect, useRef } from 'react'

import { useLocale } from 'next-intl'
import { MapSkeleton } from './MapSkeleton'
import {
    useClusterization,
    useGlobeProjectionErrorHandler,
    useMapInitialization,
    useMapLocationSearch,
    useMapMarkers,
    useSelectedMarkerFocus,
} from './hooks'

export const MAP_DEFAULT_ZOOM = 16

function MapComponent({
    center = [0, 0],
    zoom = MAP_DEFAULT_ZOOM,
    markers = [],
    height = '300px',
    width = '100%',
    onMapLoaded,
    style = maptilersdk.MapStyle.STREETS,
    terrain = false,
    projection = false,
    onMarkerClick,
    enableClustering = false,
    clusterSourceId = 'locations',
    clusterOptions = {
        maxZoom: 14,
        radius: 50,
        colors: {
            base: 'hsl(var(--primary))',
            medium: 'hsl(var(--accent))',
            large: 'hsl(var(--secondary))',
            text: 'hsl(var(--primary-foreground))',
        },
    },
    selectedMarkerId,
    enableGeocoding = false,
    enableDraggableMarker = false,
    onLocationChange,
    initialAddress,
}: MapProps) {
    const locale = useLocale()
    const mapContainer = useRef<HTMLDivElement>(null)

    const { mapRef, mapLoaded } = useMapInitialization(
        mapContainer as React.RefObject<HTMLDivElement>,
        {
            locale,
            style,
            center,
            zoom,
            terrain,
            projection,
            onMapLoaded,
        },
    )

    const { markerRefs, addStandardMarkers, createStandardMarker } =
        useMapMarkers(mapRef, {
            markers,
            mapLoaded,
            selectedMarkerId,
            onMarkerClick,
            clusterOptions,
        })

    useClusterization(mapRef, {
        mapLoaded,
        enableClustering,
        markers,
        clusterSourceId,
        clusterOptions,
        selectedMarkerId,
        onMarkerClick,
        markerRefs,
        createStandardMarker,
    })

    useSelectedMarkerFocus(mapRef, {
        mapLoaded,
        markers,
        selectedMarkerId,
    })

    useGlobeProjectionErrorHandler(mapRef, {
        mapLoaded,
        projection,
    })

    useMapLocationSearch(mapRef, {
        mapLoaded,
        enableGeocoding,
        enableDraggableMarker,
        onLocationChange,
        initialAddress,
        initialCoordinates: center,
    })

    useEffect(() => {
        if (!mapLoaded || !mapRef.current) return

        if (!enableClustering && !enableDraggableMarker) {
            addStandardMarkers()
        }
    }, [mapLoaded, enableClustering, enableDraggableMarker, addStandardMarkers])

    return (
        <>
            {!mapLoaded && <MapSkeleton height={height} width={width} />}
            <div
                ref={mapContainer}
                style={{
                    height,
                    width,
                    display: mapLoaded ? 'block' : 'none',
                }}
                className='overflow-hidden rounded-md'
            />
        </>
    )
}

export const Map = memo(MapComponent)
