'use client'

import { Title } from '@/graphql/generated/output'
import { cn } from '@/utils/tw-merge'
import { forwardRef } from 'react'

interface TitleFilmingLocationsListItemProps {
    location: NonNullable<
        Title['filmingLocations']
    >[number]['filmingLocation'] & {
        enhancedDescription?: string
    }
    isSelected: boolean
    onClick: () => void
}

export const TitleFilmingLocationsListItem = forwardRef<
    HTMLDivElement,
    TitleFilmingLocationsListItemProps
>(({ location, isSelected, onClick }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                'cursor-pointer rounded-md border p-4 transition-all',
                isSelected
                    ? 'border-accent bg-accent/10 shadow-sm'
                    : 'border-transparent hover:bg-muted',
            )}
            onClick={onClick}
        >
            <h3 className='mb-1 font-semibold'>{location.address}</h3>
            {location.formattedAddress && (
                <p className='mb-2 text-sm text-muted-foreground'>
                    {location.formattedAddress}
                </p>
            )}
            {location.enhancedDescription && (
                <p className='text-sm'>{location.enhancedDescription}</p>
            )}
            {location.city && (
                <p className='mt-2 text-xs text-muted-foreground'>
                    {location.city}
                </p>
            )}
        </div>
    )
})
