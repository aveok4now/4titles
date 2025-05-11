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
    const setupAttemptsRef = useRef(0)
    const markersAddedRef = useRef(false)
    const maxSetupAttempts = 5

    const addMarkersWithClustering = useCallback(async () => {
        if (!mapRef.current || markers.length === 0) return

        if (markersAddedRef.current && clusterSetupRef.current) {
            updateMarkerVisibility(
                mapRef.current,
                clusterSourceId,
                markers,
                markerRefs.current,
                selectedMarkerId,
            )
            return
        }

        if (setupAttemptsRef.current >= maxSetupAttempts) {
            console.warn(
                `Max setup attempts (${maxSetupAttempts}) reached for cluster source: ${clusterSourceId}`,
            )
            return
        }

        setupAttemptsRef.current += 1
        console.debug(
            `Attempt ${setupAttemptsRef.current} to setup clustering for ${clusterSourceId}`,
        )

        const mapInstance = mapRef.current

        try {
            markerRefs.current.forEach(marker => marker.remove())
            markerRefs.current = []

            const geojsonData = convertMarkersToGeoJSON(markers)

            const sourceExists = !!mapInstance.getSource(clusterSourceId)

            if (!sourceExists) {
                await addClusterSource(
                    mapInstance,
                    clusterSourceId,
                    geojsonData,
                    {
                        clusterMaxZoom: clusterOptions?.maxZoom,
                        clusterRadius: clusterOptions?.radius,
                    },
                )
            } else {
                try {
                    const source = mapInstance.getSource(
                        clusterSourceId,
                    ) as maptilersdk.GeoJSONSource
                    if (source && source.setData) {
                        source.setData(geojsonData)
                        console.debug(
                            `Updated existing source data for ${clusterSourceId}`,
                        )
                    }
                } catch (error) {
                    console.error(
                        `Error updating source ${clusterSourceId}:`,
                        error,
                    )
                }
            }

            if (!mapInstance.getSource(clusterSourceId)) {
                console.warn(
                    `Source ${clusterSourceId} was not added properly. Retrying...`,
                )

                setTimeout(() => {
                    addMarkersWithClustering()
                }, 200)
                return
            }

            if (!mapInstance.getLayer(`${clusterSourceId}-clusters`)) {
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
            }

            if (!clusterSetupRef.current) {
                setupClusterHandlers(mapInstance, clusterSourceId, {
                    onPointClick: onMarkerClick,
                })
            }

            markers.forEach(marker => {
                const newMarker = createStandardMarker(marker, mapInstance)

                if (marker.id) {
                    newMarker.getElement().style.display = 'none'
                }

                markerRefs.current.push(newMarker)
            })

            const updateMarkersVisibility = () => {
                updateMarkerVisibility(
                    mapInstance,
                    clusterSourceId,
                    markers,
                    markerRefs.current,
                    selectedMarkerId,
                )
            }

            if (!clusterSetupRef.current) {
                mapInstance.on('zoomend', updateMarkersVisibility)
                mapInstance.on('moveend', updateMarkersVisibility)
                mapInstance.on('sourcedata', e => {
                    if (e.sourceId === clusterSourceId && e.isSourceLoaded) {
                        updateMarkersVisibility()
                    }
                })
            }

            updateMarkersVisibility()

            clusterSetupRef.current = true
            markersAddedRef.current = true
            console.debug(`Clustering setup successful for ${clusterSourceId}`)

            setupAttemptsRef.current = 0
        } catch (error) {
            console.error(
                `Error setting up clustering for ${clusterSourceId}:`,
                error,
            )

            if (setupAttemptsRef.current < maxSetupAttempts) {
                setTimeout(() => {
                    addMarkersWithClustering()
                }, 300)
            }
        }
    }, [
        mapRef,
        markers,
        clusterSourceId,
        clusterOptions,
        onMarkerClick,
        markerRefs,
        createStandardMarker,
        selectedMarkerId,
    ])

    const updateMarkerVisibility = (
        mapInstance: maptilersdk.Map,
        sourceId: string,
        markers: MapMarker[],
        markerRefs: maptilersdk.Marker[],
        selectedMarkerId?: string,
    ) => {
        let updateTimeout: NodeJS.Timeout | null = null

        if (updateTimeout) {
            clearTimeout(updateTimeout)
        }

        updateTimeout = setTimeout(() => {
            if (!mapInstance) return

            try {
                if (!mapInstance.getSource(sourceId)) {
                    console.warn(
                        `Source ${sourceId} not found during visibility update`,
                    )
                    return
                }

                const features = mapInstance.querySourceFeatures(sourceId)
                const markerVisibility: Record<string, boolean> = {}

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

                markerRefs.forEach((marker, index) => {
                    const markerId = markers[index]?.id
                    if (markerId) {
                        const shouldBeVisible = markerVisibility[markerId]
                        marker.getElement().style.display = shouldBeVisible
                            ? 'block'
                            : 'none'

                        if (markerId === selectedMarkerId) {
                            const markerElement = marker.getElement()
                            if (markerElement) {
                                markerElement.classList.add('selected-marker')
                            }
                        } else {
                            const markerElement = marker.getElement()
                            if (markerElement) {
                                markerElement.classList.remove(
                                    'selected-marker',
                                )
                            }
                        }
                    }
                })
            } catch (error) {
                console.error('Error in updateMarkersVisibility:', error)
            }
        }, 50)
    }

    useEffect(() => {
        if (!mapLoaded || !mapRef.current) return

        if (clusterSetupRef.current && !enableClustering) {
            removeClusterLayers(mapRef.current, clusterSourceId)
            clusterSetupRef.current = false
            markersAddedRef.current = false
        }

        if (enableClustering && markers.length > 0) {
            setupAttemptsRef.current = 0

            setTimeout(() => {
                addMarkersWithClustering()
            }, 100)
        }
    }, [
        mapLoaded,
        enableClustering,
        markers,
        addMarkersWithClustering,
        clusterSourceId,
    ])

    useEffect(() => {
        if (
            mapLoaded &&
            mapRef.current &&
            clusterSetupRef.current &&
            markersAddedRef.current
        ) {
            updateMarkerVisibility(
                mapRef.current,
                clusterSourceId,
                markers,
                markerRefs.current,
                selectedMarkerId,
            )
        }
    }, [selectedMarkerId, mapLoaded, clusterSourceId])

    return { clusterSetupRef }
}
