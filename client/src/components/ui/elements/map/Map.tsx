'use client'

import * as maptilersdk from '@maptiler/sdk'
import '@maptiler/sdk/dist/maptiler-sdk.css'

import { cn } from '@/utils/tw-merge'
import type { LucideIcon } from 'lucide-react'
import { memo, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'

import { useLocale } from 'next-intl'
import { MapSkeleton } from './MapSkeleton'

export interface MapMarker {
    coordinates: [number, number]
    title?: string
    popupContent?: string
    color?: string
    icon?: LucideIcon
    iconClassName?: string
    iconSize?: number
    id?: string
    className?: string
}

export interface MapProps {
    center?: [number, number]
    zoom?: number
    markers?: MapMarker[]
    height?: string | number
    width?: string | number
    onMapLoaded?: (map: maptilersdk.Map) => void
    style?: maptilersdk.ReferenceMapStyle
    terrain?: boolean
    onMarkerClick?: (markerId: string) => void
}

function MapComponent({
    center = [0, 0],
    zoom = 12,
    markers = [],
    height = '300px',
    width = '100%',
    onMapLoaded,
    style = maptilersdk.MapStyle.STREETS,
    terrain = false,
    onMarkerClick,
}: MapProps) {
    const locale = useLocale()

    const mapContainer = useRef<HTMLDivElement>(null)
    const map = useRef<maptilersdk.Map | null>(null)
    const markerRefs = useRef<maptilersdk.Marker[]>([])
    const [mapLoaded, setMapLoaded] = useState(false)

    useEffect(() => {
        maptilersdk.config.apiKey =
            process.env.NEXT_PUBLIC_MAPTILER_API_KEY || ''
    }, [])

    useEffect(() => {
        if (!mapContainer.current || map.current) return

        try {
            const newMap = new maptilersdk.Map({
                container: mapContainer.current,
                style,
                center,
                zoom,
                terrain,
                terrainControl: terrain!!,
                projectionControl: true,
                fullscreenControl: true,
            })

            newMap.on('load', async () => {
                try {
                    newMap.setLanguage(`name:${locale}`)
                } catch {
                    const geolocationIP = await maptilersdk.geolocation.info()
                    const { country_languages: countryLanguages } =
                        geolocationIP
                    if (countryLanguages && countryLanguages.length > 0)
                        newMap.setLanguage(`name:${countryLanguages[0]}`)
                }

                setMapLoaded(true)

                if (onMapLoaded) {
                    onMapLoaded(newMap)
                }
            })

            map.current = newMap
        } catch {
            setMapLoaded(false)
        }

        return () => {
            if (map.current) {
                map.current.remove()
                map.current = null
                setMapLoaded(false)
            }
        }
    }, [])

    useEffect(() => {
        if (!mapLoaded || !map.current) return

        markerRefs.current.forEach(marker => marker.remove())
        markerRefs.current = []

        const mapInstance = map.current as maptilersdk.Map

        markers.forEach(marker => {
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
                            'size-10 text-primary',
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

                if (color) {
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
            } else if (marker.popupContent || marker.title) {
                const popupContent =
                    marker.popupContent ||
                    (marker.title ? `<p>${marker.title}</p>` : null)

                if (popupContent) {
                    newMarker.setPopup(
                        new maptilersdk.Popup().setHTML(popupContent),
                    )
                }
            }

            markerRefs.current.push(newMarker)
        })

        if (markers.length > 0) {
            mapInstance.setCenter(markers[0].coordinates)
        }
    }, [markers, mapLoaded, onMarkerClick])

    useEffect(() => {
        if (!mapLoaded || !map.current) return

        map.current.setCenter(center)
        map.current.setZoom(zoom)
    }, [center, zoom, mapLoaded])

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
