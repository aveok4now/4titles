import * as maptilersdk from '@maptiler/sdk'

import { LucideIcon } from 'lucide-react'

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
    projection?: boolean
    onMarkerClick?: (markerId: string) => void
    enableClustering?: boolean
    clusterSourceId?: string
    clusterOptions?: {
        maxZoom?: number
        radius?: number
        colors?: {
            base: string
            medium: string
            large: string
            text: string
        }
    }
    selectedMarkerId?: string
}

export type CustomHook<T, R> = (deps: T, _?: any) => R
