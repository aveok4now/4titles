import * as maptilersdk from '@maptiler/sdk'

import type { CustomHook } from '../types'

import { useEffect, useRef, useState } from 'react'

export const useMapInitialization: CustomHook<
    React.RefObject<HTMLDivElement | null>,
    { mapRef: React.RefObject<maptilersdk.Map | null>; mapLoaded: boolean }
> = (mapContainerRef, options) => {
    const [mapLoaded, setMapLoaded] = useState(false)
    const mapRef = useRef<maptilersdk.Map | null>(null)
    const { locale, style, center, zoom, terrain, projection, onMapLoaded } =
        options as {
            locale: string
            style: maptilersdk.ReferenceMapStyle
            center: [number, number]
            zoom: number
            terrain: boolean
            projection: boolean
            onMapLoaded?: (map: maptilersdk.Map) => void
        }

    useEffect(() => {
        maptilersdk.config.apiKey =
            process.env.NEXT_PUBLIC_MAPTILER_API_KEY || ''
    }, [])

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return

        try {
            const newMap = new maptilersdk.Map({
                container: mapContainerRef.current,
                style,
                center,
                zoom,
                terrain,
                terrainControl: terrain!!,
                projectionControl: projection,
                fullscreenControl: true,
            })

            newMap.on('load', async () => {
                try {
                    newMap.setLanguage(`name:${locale}}`)
                } catch {
                    const geolocationIP = await maptilersdk.geolocation.info()
                    const { country_languages: countryLanguages } =
                        geolocationIP
                    if (countryLanguages && countryLanguages.length > 0)
                        newMap.setLanguage(`name:${countryLanguages[0]}`)
                }

                setMapLoaded(true)

                if (onMapLoaded) onMapLoaded(newMap)
            })

            mapRef.current = newMap
        } catch {
            setMapLoaded(false)
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove()
                mapRef.current = null
                setMapLoaded(false)
            }
        }
    }, [])

    useEffect(() => {
        if (!mapLoaded || !mapRef.current) return

        mapRef.current.setCenter(center)
        mapRef.current.setZoom(zoom)
    }, [center, zoom, mapLoaded])

    return { mapRef, mapLoaded }
}
