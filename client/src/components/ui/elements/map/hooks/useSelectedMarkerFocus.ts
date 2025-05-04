import * as maptilersdk from '@maptiler/sdk'

import type { CustomHook, MapMarker } from '../types'

import { useEffect, useRef } from 'react'
import { MAP_DEFAULT_ZOOM } from '../Map'

export const useSelectedMarkerFocus: CustomHook<
    React.RefObject<maptilersdk.Map | null>,
    void
> = (mapRef, options) => {
    const { mapLoaded, markers, selectedMarkerId } = options as {
        mapLoaded: boolean
        markers: MapMarker[]
        selectedMarkerId?: string
    }

    const prevSelectedMarkerIdRef = useRef<string | undefined>(undefined)

    useEffect(() => {
        if (!mapLoaded || !mapRef.current || !selectedMarkerId) return

        if (prevSelectedMarkerIdRef.current === selectedMarkerId) return
        prevSelectedMarkerIdRef.current = selectedMarkerId

        const selectedMarker = markers.find(
            marker => marker.id === selectedMarkerId,
        )

        if (selectedMarker) {
            try {
                let targetZoom = MAP_DEFAULT_ZOOM
                try {
                    const currentMapZoom = mapRef.current.getZoom()
                    targetZoom =
                        currentMapZoom >= MAP_DEFAULT_ZOOM
                            ? currentMapZoom
                            : MAP_DEFAULT_ZOOM
                } catch (e) {
                    console.warn('Error getting map zoom:', e)
                }

                const timer = setTimeout(() => {
                    if (mapRef.current) {
                        try {
                            mapRef.current.flyTo({
                                center: selectedMarker.coordinates,
                                zoom: targetZoom,
                                essential: true,
                                duration: 800,
                            })
                        } catch (err) {
                            console.warn('Error during delayed flyTo:', err)

                            setTimeout(() => {
                                if (mapRef.current) {
                                    try {
                                        mapRef.current.setCenter(
                                            selectedMarker.coordinates,
                                        )
                                        mapRef.current.setZoom(targetZoom)
                                    } catch (e) {
                                        console.warn(
                                            'Fallback positioning failed:',
                                            e,
                                        )
                                    }
                                }
                            }, 200)
                        }
                    }
                }, 100)

                return () => clearTimeout(timer)
            } catch (err) {
                console.warn('Error during map flyTo setup:', err)
            }
        }
    }, [selectedMarkerId, mapLoaded, markers, mapRef])
}
