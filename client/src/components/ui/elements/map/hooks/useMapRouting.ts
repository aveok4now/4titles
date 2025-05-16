import * as maptilersdk from '@maptiler/sdk'

import { useCallback, useEffect } from 'react'
import { MapMarker, RouteOptions } from '../types'

interface UseMapRoutingProps {
    mapLoaded: boolean
    enableRouting: boolean
    markers: MapMarker[]
    routeOptions?: RouteOptions
    sequenceLabels?: boolean
    updateMarkersWithSequenceNumbers: (enableRouting: boolean) => void
}

const DEFAULT_ROUTE_OPTIONS: Required<RouteOptions> = {
    color: 'hsl(var(--primary))',
    width: 4,
    opacity: 0.8,
    animate: true,
    animationDuration: 2000,
}

export const useMapRouting = (
    mapRef: React.MutableRefObject<maptilersdk.Map | null>,
    {
        mapLoaded,
        enableRouting,
        markers,
        routeOptions = DEFAULT_ROUTE_OPTIONS,
        sequenceLabels = true,
        updateMarkersWithSequenceNumbers,
    }: UseMapRoutingProps,
) => {
    const mergedRouteOptions = { ...DEFAULT_ROUTE_OPTIONS, ...routeOptions }

    const addRoute = useCallback(() => {
        const map = mapRef.current
        if (!map || !mapLoaded || !enableRouting || markers.length < 2) return

        removeRoute()

        if (!map.getSource('route-source')) {
            map.addSource('route-source', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: [],
                    },
                },
            })
        }

        const existingLayers = map.getStyle().layers || []
        const firstSymbolId = existingLayers.find(
            layer => layer.type === 'symbol' || layer.id.includes('cluster'),
        )?.id

        if (!map.getLayer('route-layer')) {
            map.addLayer(
                {
                    id: 'route-layer',
                    type: 'line',
                    source: 'route-source',
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round',
                    },
                    paint: {
                        'line-color': mergedRouteOptions.color,
                        'line-width': mergedRouteOptions.width,
                        'line-opacity': mergedRouteOptions.opacity,
                        'line-dasharray': [2, 2],
                    },
                },
                firstSymbolId,
            )
        } else {
            map.setPaintProperty(
                'route-layer',
                'line-color',
                mergedRouteOptions.color,
            )
            map.setPaintProperty(
                'route-layer',
                'line-width',
                mergedRouteOptions.width,
            )
            map.setPaintProperty(
                'route-layer',
                'line-opacity',
                mergedRouteOptions.opacity,
            )
            map.setPaintProperty('route-layer', 'line-dasharray', [2, 2])

            if (firstSymbolId) map.moveLayer('route-layer', firstSymbolId)
        }

        const sortedMarkers = [...markers].sort((a, b) => {
            const aSeq = a.sequenceNumber ?? Infinity
            const bSeq = b.sequenceNumber ?? Infinity
            return aSeq - bSeq
        })

        const coordinates = sortedMarkers.map(marker => marker.coordinates)

        const routeSource = map.getSource(
            'route-source',
        ) as maptilersdk.GeoJSONSource

        if (routeSource) {
            const routeData = {
                type: 'Feature' as const,
                properties: {},
                geometry: {
                    type: 'LineString' as const,
                    coordinates,
                },
            }

            if (mergedRouteOptions.animate) {
                const steps = 50
                const stepDuration =
                    mergedRouteOptions.animationDuration / steps

                let currentStep = 0
                const interval = setInterval(() => {
                    currentStep++
                    const progress = currentStep / steps

                    const animatedCoordinates = []
                    for (let i = 0; i < coordinates.length - 1; i++) {
                        animatedCoordinates.push(coordinates[i])

                        if (i === coordinates.length - 2 && progress < 1) {
                            const start = coordinates[i]
                            const end = coordinates[i + 1]
                            const intermediate = [
                                start[0] + (end[0] - start[0]) * progress,
                                start[1] + (end[1] - start[1]) * progress,
                            ]
                            animatedCoordinates.push(intermediate)
                            break
                        }
                    }

                    if (currentStep >= steps) {
                        animatedCoordinates.push(
                            coordinates[coordinates.length - 1],
                        )
                        clearInterval(interval)
                    }

                    routeSource.setData({
                        type: 'Feature' as const,
                        properties: {},
                        geometry: {
                            type: 'LineString' as const,
                            coordinates: animatedCoordinates,
                        },
                    })
                }, stepDuration)
            } else {
                routeSource.setData(routeData)
            }
        }

        if (sequenceLabels) updateMarkersWithSequenceNumbers(true)
    }, [
        mapLoaded,
        enableRouting,
        markers,
        mergedRouteOptions,
        sequenceLabels,
        updateMarkersWithSequenceNumbers,
    ])

    const removeRoute = useCallback(() => {
        const map = mapRef.current
        if (!map || !mapLoaded) return

        if (map.getLayer('route-layer')) {
            map.removeLayer('route-layer')
        }

        if (map.getSource('route-source')) {
            map.removeSource('route-source')
        }

        updateMarkersWithSequenceNumbers(false)
    }, [mapLoaded, updateMarkersWithSequenceNumbers])

    useEffect(() => {
        if (!mapLoaded || !mapRef.current) return

        if (enableRouting && markers.length >= 2) {
            addRoute()
        } else {
            removeRoute()
        }

        return () => {
            removeRoute()
        }
    }, [mapLoaded, enableRouting, markers, addRoute, removeRoute])

    return {
        addRoute,
        removeRoute,
    }
}
