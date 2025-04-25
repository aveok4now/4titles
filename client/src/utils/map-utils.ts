import * as maptilersdk from '@maptiler/sdk'

export const normalizeCoordinates = (
    coordinates: number[] | { lat: number; lng: number } | [number, number],
): [number, number] => {
    if (Array.isArray(coordinates)) {
        if (coordinates.length === 2) {
            return coordinates as [number, number]
        }
        throw new Error('Invalid coordinates array format')
    }

    if ('lat' in coordinates && 'lng' in coordinates) {
        return [coordinates.lng, coordinates.lat]
    }

    throw new Error('Invalid coordinates format')
}

export const addMarker = (
    map: maptilersdk.Map,
    coordinates: [number, number],
    title?: string,
    popupContent?: string,
    color?: string,
): maptilersdk.Marker => {
    const markerOptions: maptilersdk.MarkerOptions = {}

    if (color) {
        markerOptions.color = color
    }

    const marker = new maptilersdk.Marker(markerOptions)
        .setLngLat(coordinates)
        .addTo(map)

    if (popupContent || title) {
        const content = popupContent || `<p>${title}</p>`
        marker.setPopup(new maptilersdk.Popup().setHTML(content))
    }

    return marker
}

export const flyToLocation = (
    map: maptilersdk.Map,
    coordinates: [number, number],
    zoom: number = 14,
    duration: number = 2000,
): void => {
    map.flyTo({
        center: coordinates,
        zoom,
        essential: true,
        duration,
    })
}
