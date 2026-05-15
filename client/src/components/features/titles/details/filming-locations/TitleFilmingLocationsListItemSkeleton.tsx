'use client'

import { Skeleton } from '@/components/ui/common/skeleton'

export function TitleFilmingLocationsListItemSkeleton() {
    return (
        <div className='relative animate-pulse rounded-md border border-transparent p-4 transition-all'>
            <div className='absolute right-2 top-2 z-10'>
                <Skeleton className='h-8 w-8 rounded-md' />
            </div>
            <div className='absolute bottom-2 right-2 z-10'>
                <Skeleton className='h-8 w-8 rounded-md' />
            </div>
            <div className='text-ellipsis pr-4'>
                <Skeleton className='mb-1 h-6 w-4/5' />
                <Skeleton className='mb-2 h-4 w-3/4' />
                <Skeleton className='mb-4 h-16 w-full' />
                <Skeleton className='h-4 w-1/4' />
            </div>
        </div>
    )
}

export function TitleFilmingLocationsListSkeletons({ count = 3 }) {
    return (
        <>
            {Array(count)
                .fill(0)
                .map((_, index) => (
                    <TitleFilmingLocationsListItemSkeleton key={index} />
                ))}
        </>
    )
}
