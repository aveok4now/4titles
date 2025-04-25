'use client'

import { Skeleton } from '@/components/ui/common/skeleton'
import { memo } from 'react'

interface MapSkeletonProps {
    height?: string | number
    width?: string | number
}

export function MapSkeletonComponent({
    height = '300px',
    width = '100%',
}: MapSkeletonProps) {
    return (
        <div style={{ height, width }} className='overflow-hidden rounded-md'>
            <Skeleton className='h-full w-full' />
        </div>
    )
}

export const MapSkeleton = memo(MapSkeletonComponent)
