import { useCallback, useEffect, useRef, useState } from 'react'

interface UseLocationSelectionProps {
    initialSelectedId?: string | null
    defaultToFirstLocation?: boolean
    locationParam?: string | null
    locations: { id: string }[]
    onLocationSelected?: (locationId: string) => void
}

interface UseLocationSelectionResult {
    selectedLocationId: string | null
    setSelectedLocationId: (id: string | null) => void
    scrollAreaRef: React.RefObject<HTMLDivElement | null>
    locationItemRefs: React.MutableRefObject<Record<string, HTMLDivElement>>
    handleLocationClick: (locationId: string) => void
    handleMarkerClick: (locationId: string) => void
    registerLocationRef: (id: string, element: HTMLDivElement | null) => void
}

export function useLocationSelection({
    initialSelectedId = null,
    defaultToFirstLocation = true,
    locationParam = null,
    locations = [],
    onLocationSelected,
}: UseLocationSelectionProps): UseLocationSelectionResult {
    const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
        locationParam || initialSelectedId,
    )

    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const locationItemRefs = useRef<Record<string, HTMLDivElement>>({})

    useEffect(() => {
        if (locationParam) {
            setSelectedLocationId(locationParam)
            setTimeout(() => {
                const locationElement = locationItemRefs.current[locationParam]
                if (locationElement && scrollAreaRef.current) {
                    locationElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest',
                    })
                }
            }, 500)
        }
    }, [locationParam])

    useEffect(() => {
        if (
            defaultToFirstLocation &&
            !locationParam &&
            !selectedLocationId &&
            locations.length > 0
        ) {
            const firstLocationId = locations[0].id
            setSelectedLocationId(firstLocationId)

            if (onLocationSelected) {
                onLocationSelected(firstLocationId)
            }
        }
    }, [
        defaultToFirstLocation,
        locationParam,
        selectedLocationId,
        locations,
        onLocationSelected,
    ])

    const scrollToLocation = useCallback((locationId: string) => {
        setTimeout(() => {
            const el = locationItemRefs.current[locationId]
            if (el && scrollAreaRef.current) {
                el.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest',
                })
            }
        }, 0)
    }, [])

    const handleLocationClick = useCallback(
        (locationId: string) => {
            setSelectedLocationId(locationId)
            scrollToLocation(locationId)

            if (onLocationSelected) {
                onLocationSelected(locationId)
            }
        },
        [scrollToLocation, onLocationSelected],
    )

    const handleMarkerClick = handleLocationClick

    const registerLocationRef = useCallback(
        (id: string, element: HTMLDivElement | null) => {
            if (element) {
                locationItemRefs.current[id] = element
            }
        },
        [],
    )

    return {
        selectedLocationId,
        setSelectedLocationId,
        scrollAreaRef,
        locationItemRefs,
        handleLocationClick,
        handleMarkerClick,
        registerLocationRef,
    }
}
