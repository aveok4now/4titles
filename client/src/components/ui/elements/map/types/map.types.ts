import * as maptilersdk from '@maptiler/sdk'

import { LucideIcon } from 'lucide-react'

export interface MapMarker {
    id: string
    coordinates: [number, number]
    title?: string
    className?: string
    iconClassName?: string
    color?: string
    sequenceNumber?: number
    icon?: LucideIcon
    iconSize?: number
    popupContent?: string
    draggable?: boolean
}

export interface MapLocationChangeEvent {
    address: string
    coordinates: [number, number]
}

export interface ClusterOptions {
    maxZoom?: number
    radius?: number
    colors?: {
        base: string
        medium: string
        large: string
        text: string
    }
}

export interface RouteOptions {
    color?: string
    width?: number
    opacity?: number
    animate?: boolean
    animationDuration?: number
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
    projection?: boolean | maptilersdk.Projection
    onMarkerClick?: (markerId: string) => void
    enableClustering?: boolean
    clusterSourceId?: string
    clusterOptions?: ClusterOptions
    selectedMarkerId?: string
    enableGeocoding?: boolean
    enableDraggableMarker?: boolean
    onLocationChange?: (event: MapLocationChangeEvent) => void
    initialAddress?: string
    enableRouting?: boolean
    routeOptions?: RouteOptions
    sequenceLabels?: boolean
}

export type CustomHook<T, R> = (deps: T, _?: any) => R
