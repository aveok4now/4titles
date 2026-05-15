import * as maptilersdk from '@maptiler/sdk'

import type { CustomHook } from '../types'

import { useEffect } from 'react'

export const useGlobeProjectionErrorHandler: CustomHook<
    React.RefObject<maptilersdk.Map | null>,
    void
> = (mapRef, options) => {
    const { mapLoaded, projection } = options as {
        mapLoaded: boolean
        projection: boolean
    }

    useEffect(() => {
        if (!mapLoaded || !mapRef.current || !projection) return

        const handleMapError = (event: ErrorEvent) => {
            if (
                event.message.includes('Not implemented') &&
                event.error?.stack?.includes('getRayDirectionFromPixel')
            ) {
                event.preventDefault()
                event.stopPropagation()

                if (mapRef.current) {
                    try {
                        mapRef.current.easeTo({
                            pitch: 0,
                            bearing: 0,
                        })
                    } catch (e) {
                        console.warn(
                            'Error handling globe projection issue:',
                            e,
                        )
                    }
                }
            }
        }

        window.addEventListener('error', handleMapError)

        return () => {
            window.removeEventListener('error', handleMapError)
        }
    }, [mapLoaded, projection, mapRef])
}
