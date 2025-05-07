import { GeocodingControl } from '@maptiler/geocoding-control/maptilersdk'
import * as maptilersdk from '@maptiler/sdk'

import { useCallback, useEffect, useRef, useState } from 'react'
import { MAP_DEFAULT_ZOOM } from '../Map'
import type { CustomHook, MapLocationChangeEvent } from '../types'

export const useMapLocationSearch: CustomHook<
    React.RefObject<maptilersdk.Map | null>,
    {
        geocodingControl: React.MutableRefObject<GeocodingControl | null>
        draggableMarker: React.MutableRefObject<maptilersdk.Marker | null>
        updateMarkerPosition: (coordinates: [number, number]) => void
        getCurrentAddress: () => string
        getCurrentCoordinates: () => [number, number] | null
    }
> = (mapRef, options) => {
    const {
        mapLoaded,
        enableGeocoding,
        enableDraggableMarker,
        onLocationChange,
        initialAddress,
        initialCoordinates,
    } = options as {
        mapLoaded: boolean
        enableGeocoding?: boolean
        enableDraggableMarker?: boolean
        onLocationChange?: (event: MapLocationChangeEvent) => void
        initialAddress?: string
        initialCoordinates?: [number, number]
    }

    const geocodingControl = useRef<GeocodingControl | null>(null)
    const draggableMarker = useRef<maptilersdk.Marker | null>(null)
    const [currentAddress, setCurrentAddress] = useState<string>(
        initialAddress || '',
    )

    useEffect(() => {
        if (!mapLoaded || !mapRef.current || !enableGeocoding) return

        if (!geocodingControl.current) {
            const gc = new GeocodingControl({})
            mapRef.current.addControl(gc, 'top-left')
            geocodingControl.current = gc

            gc.on('select', event => {
                const place = event.feature
                if (!place || !place.geometry) return

                let coordinates: [number, number] | null = null

                if (
                    place.geometry.type === 'Point' &&
                    Array.isArray(place.geometry.coordinates)
                ) {
                    coordinates = [
                        place.geometry.coordinates[0],
                        place.geometry.coordinates[1],
                    ] as [number, number]
                }

                if (!coordinates) return

                const address =
                    place.properties?.name ||
                    place.properties?.address ||
                    place.properties?.place_name ||
                    ''

                updateMarkerPosition(coordinates)
                setCurrentAddress(address)

                if (onLocationChange) {
                    onLocationChange({
                        address,
                        coordinates,
                    })
                }
            })
        }

        return () => {
            if (mapRef.current && geocodingControl.current) {
                mapRef.current.removeControl(geocodingControl.current)
                geocodingControl.current = null
            }
        }
    }, [mapLoaded, enableGeocoding, onLocationChange])

    useEffect(() => {
        if (!mapLoaded || !mapRef.current || !enableDraggableMarker) return

        if (!draggableMarker.current) {
            const initialCoords =
                initialCoordinates ||
                (mapRef.current.getCenter().toArray() as [number, number])

            const marker = new maptilersdk.Marker({
                draggable: true,
            })
                .setLngLat(initialCoords)
                .addTo(mapRef.current)

            draggableMarker.current = marker

            marker.on('dragend', async () => {
                const lngLat = marker.getLngLat()
                const coordinates: [number, number] = [lngLat.lng, lngLat.lat]

                try {
                    const response = await fetch(
                        `https://api.maptiler.com/geocoding/${lngLat.lng},${lngLat.lat}.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`,
                    )

                    if (response.ok) {
                        const data = await response.json()
                        const address = data.features[0]?.place_name || ''
                        setCurrentAddress(address)

                        if (onLocationChange) {
                            onLocationChange({
                                address,
                                coordinates,
                            })
                        }
                    }
                } catch (error) {
                    console.error('Error in reverse geocoding:', error)

                    if (onLocationChange) {
                        onLocationChange({
                            address: currentAddress,
                            coordinates,
                        })
                    }
                }
            })
        }

        return () => {
            if (draggableMarker.current) {
                draggableMarker.current.remove()
                draggableMarker.current = null
            }
        }
    }, [
        mapLoaded,
        enableDraggableMarker,
        initialCoordinates,
        onLocationChange,
        currentAddress,
    ])

    const updateMarkerPosition = useCallback(
        (coordinates: [number, number]) => {
            if (!draggableMarker.current || !mapRef.current) return

            draggableMarker.current.setLngLat(coordinates)
            mapRef.current.flyTo({
                center: coordinates,
                zoom: MAP_DEFAULT_ZOOM,
            })
        },
        [],
    )

    const getCurrentAddress = useCallback(() => {
        return currentAddress
    }, [currentAddress])

    const getCurrentCoordinates = useCallback(() => {
        if (!draggableMarker.current) return null

        const lngLat = draggableMarker.current.getLngLat()
        return [lngLat.lng, lngLat.lat] as [number, number]
    }, [])

    return {
        geocodingControl,
        draggableMarker,
        updateMarkerPosition,
        getCurrentAddress,
        getCurrentCoordinates,
    }
}
