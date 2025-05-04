import * as maptilersdk from '@maptiler/sdk'

import { useCallback, useEffect, useRef } from 'react'
import type { CustomHook, MapMarker, MapProps } from '../types'
import {
    addClusterLayers,
    addClusterSource,
    convertMarkersToGeoJSON,
    removeClusterLayers,
    setupClusterHandlers,
} from '../utils'

export const useClusterization: CustomHook<
    React.RefObject<maptilersdk.Map | null>,
    { clusterSetupRef: React.MutableRefObject<boolean> }
> = (mapRef, options) => {
    const {
        mapLoaded,
        enableClustering,
        markers,
        clusterSourceId,
        clusterOptions,
        selectedMarkerId,
        onMarkerClick,
        markerRefs,
        createStandardMarker,
    } = options as {
        mapLoaded: boolean
        enableClustering: boolean
        markers: MapMarker[]
        clusterSourceId: string
        clusterOptions?: MapProps['clusterOptions']
        selectedMarkerId?: string
        onMarkerClick?: (markerId: string) => void
        markerRefs: React.MutableRefObject<maptilersdk.Marker[]>
        createStandardMarker: (
            marker: MapMarker,
            mapInstance: maptilersdk.Map,
        ) => maptilersdk.Marker
    }

    const clusterSetupRef = useRef(false)

    const addMarkersWithClustering = useCallback(() => {
        if (!mapRef.current || markers.length === 0) return

        const mapInstance = mapRef.current

        markerRefs.current.forEach(marker => marker.remove())
        markerRefs.current = []

        const geojsonData = convertMarkersToGeoJSON(markers)

        addClusterSource(mapInstance, clusterSourceId, geojsonData, {
            clusterMaxZoom: clusterOptions?.maxZoom,
            clusterRadius: clusterOptions?.radius,
        })

        addClusterLayers(
            mapInstance,
            clusterSourceId,
            clusterOptions?.colors || {
                base: 'hsl(var(--primary))',
                medium: 'hsl(var(--accent))',
                large: 'hsl(var(--secondary))',
                text: 'hsl(var(--primary-foreground))',
            },
        )

        setupClusterHandlers(mapInstance, clusterSourceId, {
            onPointClick: onMarkerClick,
        })

        const markerVisibility: Record<string, boolean> = {}

        let updateTimeout: NodeJS.Timeout | null = null

        const updateMarkersVisibility = () => {
            if (updateTimeout) {
                clearTimeout(updateTimeout)
            }

            updateTimeout = setTimeout(() => {
                if (!mapInstance) return

                const features =
                    mapInstance.querySourceFeatures(clusterSourceId)

                markers.forEach(marker => {
                    if (marker.id) {
                        markerVisibility[marker.id] = false
                    }
                })

                features.forEach(feature => {
                    if (!feature.properties?.cluster) {
                        const id = feature.properties?.id
                        if (id) {
                            markerVisibility[id] = true
                        }
                    }
                })

                markerRefs.current.forEach((marker, index) => {
                    const markerId = markers[index]?.id
                    if (markerId) {
                        const shouldBeVisible = markerVisibility[markerId]
                        marker.getElement().style.display = shouldBeVisible
                            ? 'block'
                            : 'none'
                    }
                })
            }, 50)
        }

        markers.forEach(marker => {
            const newMarker = createStandardMarker(marker, mapInstance)

            if (marker.id) {
                newMarker.getElement().style.display = 'none'
            }

            markerRefs.current.push(newMarker)
        })

        mapInstance.on('zoomend', updateMarkersVisibility)
        mapInstance.on('moveend', updateMarkersVisibility)
        mapInstance.on('sourcedata', e => {
            if (e.sourceId === clusterSourceId && e.isSourceLoaded) {
                updateMarkersVisibility()
            }
        })

        updateMarkersVisibility()

        clusterSetupRef.current = true
    }, [
        mapRef,
        markers,
        clusterSourceId,
        clusterOptions,
        onMarkerClick,
        markerRefs,
        createStandardMarker,
    ])

    useEffect(() => {
        if (!mapLoaded || !mapRef.current) return

        if (clusterSetupRef.current && !enableClustering) {
            removeClusterLayers(mapRef.current, clusterSourceId)
            clusterSetupRef.current = false
        }

        if (enableClustering) {
            addMarkersWithClustering()
        } else {
        }
    }, [mapLoaded, enableClustering, addMarkersWithClustering])

    return { clusterSetupRef }
}
