import * as maptilersdk from '@maptiler/sdk'
import type { MapMarker } from '../types'

export const getMapColors = () => {
    if (typeof window !== 'undefined' && document) {
        const bodyStyles = getComputedStyle(document.body)
        const primaryHsl = bodyStyles.getPropertyValue('--primary').trim()
        const accentHsl = bodyStyles.getPropertyValue('--accent').trim()
        const secondaryHsl = bodyStyles.getPropertyValue('--secondary').trim()
        const primaryFgHsl = bodyStyles
            .getPropertyValue('--primary-foreground')
            .trim()

        const hslToHex = (hsl: string): string => {
            if (!hsl) return '#3B82F6'

            const [h, s, l] = hsl
                .split(' ')
                .map(val => parseFloat(val.replace('%', '')))

            const toRGB = (h: number, s: number, l: number) => {
                s /= 100
                l /= 100
                const a = s * Math.min(l, 1 - l)
                const f = (n: number) => {
                    const k = (n + h / 30) % 12
                    const color =
                        l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
                    return Math.round(255 * color)
                        .toString(16)
                        .padStart(2, '0')
                }
                return `#${f(0)}${f(8)}${f(4)}`
            }

            return toRGB(h, s, l)
        }

        return {
            primary: hslToHex(primaryHsl),
            accent: hslToHex(accentHsl),
            secondary: hslToHex(secondaryHsl),
            primaryForeground: hslToHex(primaryFgHsl) || '#FFFFFF',
        }
    }

    return {
        primary: '#3B82F6',
        accent: '#F472B6',
        secondary: '#6B7280',
        primaryForeground: '#FFFFFF',
    }
}

export const convertMarkersToGeoJSON = (
    markers: MapMarker[],
): GeoJSON.FeatureCollection => {
    return {
        type: 'FeatureCollection',
        features: markers.map(marker => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: marker.coordinates,
            },
            properties: {
                title: marker.title || '',
                popupContent: marker.popupContent || '',
                color: marker.color || '',
                id: marker.id || '',
                iconClassName: marker.iconClassName || '',
                iconSize: marker.iconSize || 24,
                className: marker.className || '',
            },
        })),
    }
}

export const addClusterSource = (
    map: maptilersdk.Map,
    sourceId: string,
    data: GeoJSON.FeatureCollection,
    options: {
        clusterMaxZoom?: number
        clusterRadius?: number
    } = {},
) => {
    if (!map.isStyleLoaded()) {
        console.debug(
            `Style not loaded yet. Waiting before adding source ${sourceId}`,
        )

        return new Promise<void>(resolve => {
            const checkAndAddSource = () => {
                if (map.isStyleLoaded()) {
                    try {
                        if (map.getSource(sourceId)) {
                            try {
                                map.removeSource(sourceId)
                            } catch (removeErr) {
                                console.debug(
                                    `Failed to remove existing source ${sourceId}: ${removeErr}`,
                                )
                            }
                        }

                        map.addSource(sourceId, {
                            type: 'geojson',
                            data,
                            cluster: true,
                            clusterMaxZoom: options.clusterMaxZoom || 14,
                            clusterRadius: options.clusterRadius || 50,
                        })
                        console.debug(`Source ${sourceId} added successfully`)
                        resolve()
                    } catch (error) {
                        console.error(`Error adding source ${sourceId}:`, error)
                        resolve()
                    }
                } else {
                    console.debug(
                        `Style still not loaded, retrying for source ${sourceId}...`,
                    )
                    setTimeout(checkAndAddSource, 100)
                }
            }

            checkAndAddSource()
        })
    }

    try {
        if (map.getSource(sourceId)) {
            try {
                const source = map.getSource(
                    sourceId,
                ) as maptilersdk.GeoJSONSource
                source.setData(data)
                console.debug(`Source ${sourceId} data updated`)
            } catch (updateError) {
                console.error(`Error updating source ${sourceId}:`, updateError)

                try {
                    map.removeSource(sourceId)
                    map.addSource(sourceId, {
                        type: 'geojson',
                        data,
                        cluster: true,
                        clusterMaxZoom: options.clusterMaxZoom || 14,
                        clusterRadius: options.clusterRadius || 50,
                    })
                    console.debug(`Source ${sourceId} recreated`)
                } catch (recreateError) {
                    console.error(
                        `Failed to recreate source ${sourceId}:`,
                        recreateError,
                    )
                }
            }
        } else {
            // Добавляем новый источник
            map.addSource(sourceId, {
                type: 'geojson',
                data,
                cluster: true,
                clusterMaxZoom: options.clusterMaxZoom || 14,
                clusterRadius: options.clusterRadius || 50,
            })
            console.debug(`Source ${sourceId} added`)
        }
    } catch (error) {
        console.error(`Error in addClusterSource for ${sourceId}:`, error)

        const styleReadyHandler = () => {
            try {
                if (map.getSource(sourceId)) {
                    const source = map.getSource(
                        sourceId,
                    ) as maptilersdk.GeoJSONSource
                    source.setData(data)
                } else {
                    map.addSource(sourceId, {
                        type: 'geojson',
                        data,
                        cluster: true,
                        clusterMaxZoom: options.clusterMaxZoom || 14,
                        clusterRadius: options.clusterRadius || 50,
                    })
                }
                map.off('styledata', styleReadyHandler)
                console.debug(
                    `Source ${sourceId} added after style ready event`,
                )
            } catch (retryError) {
                console.error(
                    `Failed to add source ${sourceId} after retry:`,
                    retryError,
                )
            }
        }

        map.on('styledata', styleReadyHandler)
    }
}

export const addClusterLayers = (
    map: maptilersdk.Map,
    sourceId: string,
    colors: {
        base: string
        medium: string
        large: string
        text: string
    } = {
        base: 'hsl(var(--primary))',
        medium: 'hsl(var(--accent))',
        large: 'hsl(var(--secondary))',
        text: 'hsl(var(--primary-foreground))',
    },
) => {
    const addLayersWhenSourceExists = () => {
        if (!map.getSource(sourceId)) {
            console.error(
                `Source "${sourceId}" does not exist. Cannot add layers.`,
            )
            return false
        }

        try {
            // Удаляем слои, если они существуют
            if (map.getLayer(`${sourceId}-clusters`)) {
                map.removeLayer(`${sourceId}-clusters`)
            }
            if (map.getLayer(`${sourceId}-cluster-count`)) {
                map.removeLayer(`${sourceId}-cluster-count`)
            }
            if (map.getLayer(`${sourceId}-unclustered-point`)) {
                map.removeLayer(`${sourceId}-unclustered-point`)
            }

            const themeColors = getMapColors()

            const clusterColors = {
                base: colors.base.includes('var(--')
                    ? themeColors.primary
                    : colors.base,
                medium: colors.medium.includes('var(--')
                    ? themeColors.accent
                    : colors.medium,
                large: colors.large.includes('var(--')
                    ? themeColors.secondary
                    : colors.large,
                text: colors.text.includes('var(--')
                    ? themeColors.primaryForeground
                    : colors.text,
            }

            map.addLayer({
                id: `${sourceId}-clusters`,
                type: 'circle',
                source: sourceId,
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': [
                        'step',
                        ['get', 'point_count'],
                        clusterColors.base,
                        10,
                        clusterColors.medium,
                        30,
                        clusterColors.large,
                    ],
                    'circle-radius': [
                        'step',
                        ['get', 'point_count'],
                        20,
                        10,
                        25,
                        30,
                        30,
                    ],
                    'circle-opacity': 1,
                    'circle-stroke-width': 3,
                    'circle-stroke-color': '#ffffff',
                    'circle-stroke-opacity': 1,
                },
            })

            map.addLayer({
                id: `${sourceId}-cluster-count`,
                type: 'symbol',
                source: sourceId,
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': '{point_count_abbreviated}',
                    'text-size': 14,
                },
                paint: {
                    'text-color': clusterColors.text,
                },
            })

            console.debug(`Layers for source ${sourceId} added successfully`)
            return true
        } catch (error) {
            console.error(
                `Error adding cluster layers for source "${sourceId}":`,
                error,
            )
            return false
        }
    }

    if (!map.isStyleLoaded()) {
        console.debug(
            `Style not loaded yet for adding layers for ${sourceId}. Waiting...`,
        )

        let retryCount = 0
        const maxRetries = 50

        const retryInterval = setInterval(() => {
            retryCount++

            if (map.isStyleLoaded()) {
                clearInterval(retryInterval)

                if (!addLayersWhenSourceExists() && retryCount < maxRetries) {
                    setTimeout(() => {
                        addLayersWhenSourceExists()
                    }, 200)
                }
            } else if (retryCount >= maxRetries) {
                clearInterval(retryInterval)
                console.error(
                    `Failed to add layers for ${sourceId} after ${maxRetries} retries`,
                )
            }
        }, 100)

        return
    }

    addLayersWhenSourceExists()
}

export const setupClusterHandlers = (
    map: maptilersdk.Map,
    sourceId: string,
    options: {
        onClusterClick?: (features: maptilersdk.MapGeoJSONFeature) => void
        onPointClick?: (id: string) => void
    } = {},
) => {
    map.on('click', `${sourceId}-clusters`, async e => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: [`${sourceId}-clusters`],
        })

        if (features.length > 0) {
            const clusterId = features[0].properties?.cluster_id

            if (options.onClusterClick) {
                options.onClusterClick(features[0])
            } else {
                try {
                    const source = map.getSource(
                        sourceId,
                    ) as maptilersdk.GeoJSONSource & {
                        getClusterExpansionZoom: (
                            clusterId: number,
                        ) => Promise<number>
                    }

                    const zoom = await source.getClusterExpansionZoom(clusterId)
                    map.easeTo({
                        center: (features[0].geometry as GeoJSON.Point)
                            .coordinates as [number, number],
                        zoom,
                    })
                } catch (error) {
                    console.error('Cluster click error:', error)
                }
            }
        }
    })

    map.on('mouseenter', `${sourceId}-clusters`, () => {
        map.getCanvas().style.cursor = 'pointer'
    })

    map.on('mouseleave', `${sourceId}-clusters`, () => {
        map.getCanvas().style.cursor = ''
    })
}

export const addPopupsToPoints = (map: maptilersdk.Map, sourceId: string) => {
    map.on('click', `${sourceId}-unclustered-point`, e => {
        if (!e.features || e.features.length === 0) return

        const feature = e.features[0]
        const coordinates = (
            feature.geometry as GeoJSON.Point
        ).coordinates.slice() as [number, number]
        const title = feature.properties?.title || ''
        const popupContent = feature.properties?.popupContent || ''

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
        }

        if (title || popupContent) {
            const content =
                popupContent ||
                `<div class="p-2"><p class="font-semibold">${title}</p></div>`

            new maptilersdk.Popup({
                closeButton: true,
                closeOnClick: true,
                maxWidth: '300px',
                className: 'custom-popup',
            })
                .setLngLat(coordinates)
                .setHTML(content)
                .addTo(map)
        }
    })
}

export const removeClusterLayers = (map: maptilersdk.Map, sourceId: string) => {
    if (map.getLayer(`${sourceId}-clusters`)) {
        map.removeLayer(`${sourceId}-clusters`)
    }
    if (map.getLayer(`${sourceId}-cluster-count`)) {
        map.removeLayer(`${sourceId}-cluster-count`)
    }
    if (map.getLayer(`${sourceId}-unclustered-point`)) {
        map.removeLayer(`${sourceId}-unclustered-point`)
    }

    if (map.getSource(sourceId)) {
        map.removeSource(sourceId)
    }
}
