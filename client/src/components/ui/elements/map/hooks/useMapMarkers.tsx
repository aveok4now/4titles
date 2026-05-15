import * as maptilersdk from '@maptiler/sdk'

import type { CustomHook, MapMarker, MapProps } from '../types'

import { cn } from '@/utils/tw-merge'
import { useCallback, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { getMapColors } from '../utils'

export const useMapMarkers: CustomHook<
    React.RefObject<maptilersdk.Map | null>,
    {
        markerRefs: React.MutableRefObject<maptilersdk.Marker[]>
        addStandardMarkers: () => void
        createStandardMarker: (
            marker: MapMarker,
            mapInstance: maptilersdk.Map,
        ) => maptilersdk.Marker
        updateMarkersWithSequenceNumbers: (enableRouting: boolean) => void
    }
> = (mapRef, options) => {
    const {
        markers,
        mapLoaded,
        selectedMarkerId,
        onMarkerClick,
        clusterOptions,
    } = options as {
        markers: MapMarker[]
        mapLoaded: boolean
        selectedMarkerId?: string
        onMarkerClick?: (markerId: string) => void
        clusterOptions?: MapProps['clusterOptions']
    }
    const markerRefs = useRef<maptilersdk.Marker[]>([])
    const themeColors = getMapColors()

    const updateMarkersWithSequenceNumbers = useCallback(
        (enableRouting: boolean) => {
            document
                .querySelectorAll('.marker-sequence-number')
                .forEach(element => {
                    element.remove()
                })

            if (!enableRouting) return

            const markerElements = document.querySelectorAll('[data-marker-id]')

            const sequenceMap = new Map()
            markers.forEach(marker => {
                if (marker.sequenceNumber) {
                    sequenceMap.set(marker.id, marker.sequenceNumber)
                }
            })

            markerElements.forEach(markerElement => {
                const markerId = markerElement.getAttribute('data-marker-id')
                if (!markerId) return

                const sequenceNumber = sequenceMap.get(markerId)
                if (!sequenceNumber) return

                const sequenceNumberElement = document.createElement('div')
                sequenceNumberElement.className = 'marker-sequence-number'
                sequenceNumberElement.textContent = sequenceNumber.toString()

                Object.assign(sequenceNumberElement.style, {
                    position: 'absolute',
                    top: '9px',
                    left: '0',
                    width: '100%',
                    height: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    fontFamily: 'var(--font-geist-sans)',
                    lineHeight: '1',
                    color: '#000',
                    zIndex: '10',
                    pointerEvents: 'none',
                    userSelect: 'none',
                })

                markerElement.appendChild(sequenceNumberElement)
            })
        },
        [markers],
    )

    const createStandardMarker = useCallback(
        (marker: MapMarker, mapInstance: maptilersdk.Map) => {
            let newMarker: maptilersdk.Marker

            if (marker.icon) {
                const el = document.createElement('div')

                const root = createRoot(el)
                const Icon = marker.icon
                const iconSize = marker.iconSize || 24

                root.render(
                    <Icon
                        size={iconSize}
                        className={cn(
                            'size-10',
                            selectedMarkerId === marker.id
                                ? 'animate-bounce text-accent'
                                : 'text-primary',
                            marker.iconClassName,
                        )}
                    />,
                )

                newMarker = new maptilersdk.Marker({
                    element: el,
                })
                    .setLngLat(marker.coordinates)
                    .addTo(mapInstance)
            } else {
                const markerOptions: maptilersdk.MarkerOptions = {}
                const { color, className } = marker

                const isSelected =
                    selectedMarkerId && marker.id === selectedMarkerId
                if (isSelected) {
                    markerOptions.color =
                        clusterOptions?.colors?.medium?.includes('var(--')
                            ? themeColors.accent
                            : clusterOptions?.colors?.medium || '#F472B6'
                } else if (color) {
                    markerOptions.color = color
                }

                if (className) {
                    markerOptions.className = className
                }

                newMarker = new maptilersdk.Marker(markerOptions)
                    .setLngLat(marker.coordinates)
                    .addTo(mapInstance)
            }

            if (onMarkerClick && marker.id) {
                newMarker.getElement().addEventListener('click', () => {
                    if (marker.id && onMarkerClick) {
                        onMarkerClick(marker.id)
                    }
                })
            }

            if (marker.popupContent || marker.title) {
                const popupContent =
                    marker.popupContent ||
                    (marker.title ? `<p>${marker.title}</p>` : null)

                if (popupContent) {
                    newMarker.getElement().addEventListener('click', () => {
                        if (!mapInstance) return

                        const isFullscreen =
                            document.fullscreenElement ===
                            mapInstance.getContainer()

                        if (isFullscreen) {
                            new maptilersdk.Popup()
                                .setLngLat(marker.coordinates)
                                .setHTML(popupContent as string)
                                .addTo(mapInstance)
                        }
                    })
                }
            }

            const markerElement = newMarker.getElement()
            if (markerElement) {
                markerElement.setAttribute('data-marker-id', marker.id)
            }

            return newMarker
        },
        [selectedMarkerId, onMarkerClick, clusterOptions, themeColors],
    )

    const addStandardMarkers = useCallback(() => {
        if (!mapRef.current) return

        markerRefs.current.forEach(marker => marker.remove())
        markerRefs.current = []

        const mapInstance = mapRef.current as maptilersdk.Map

        markers.forEach(marker => {
            const newMarker = createStandardMarker(marker, mapInstance)
            markerRefs.current.push(newMarker)
        })
    }, [markers, mapRef, createStandardMarker])

    useEffect(() => {
        return () => {
            markerRefs.current.forEach(marker => marker.remove())
            markerRefs.current = []
        }
    }, [])

    return {
        markerRefs,
        addStandardMarkers,
        createStandardMarker,
        updateMarkersWithSequenceNumbers,
    }
}
