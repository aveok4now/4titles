'use client'

import { Button } from '@/components/ui/common/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/common/dropdown-menu'
import ShinyText from '@/components/ui/custom/text/shiny-text'
import { Hint } from '@/components/ui/elements/Hint'
import { Title } from '@/graphql/generated/output'
import { cn } from '@/utils/tw-merge'
import { MoreHorizontal } from 'lucide-react'
import { forwardRef } from 'react'
import { FaGoogle, FaMap, FaYandex } from 'react-icons/fa'

interface TitleFilmingLocationsListItemProps {
    location: NonNullable<
        Title['filmingLocations']
    >[number]['filmingLocation'] & {
        enhancedDescription?: string
    }
    isSelected: boolean
    onClick: () => void
    t: (key: string) => string
}

export const TitleFilmingLocationsListItem = forwardRef<
    HTMLDivElement,
    TitleFilmingLocationsListItemProps
>(({ location, isSelected, onClick, t }, ref) => {
    const hasCoordinates = !!(
        location.coordinates?.x && location.coordinates?.y
    )

    const getGoogleMapsUrl = () => {
        if (!hasCoordinates) return ''
        const lat = location.coordinates!.y
        const lng = location.coordinates!.x
        return `https://www.google.com/maps/@${lat},${lng},12z`
    }

    const getYandexMapsUrl = () => {
        if (!hasCoordinates) return ''
        const lat = location.coordinates!.y
        const lng = location.coordinates!.x
        return `https://yandex.ru/maps/?pt=${lng},${lat}&z=12&l=map`
    }

    const get2GisUrl = () => {
        if (!hasCoordinates) return ''
        const lat = location.coordinates!.y
        const lng = location.coordinates!.x
        return `https://2gis.ru/?m=${lng},${lat}%2F12`
    }

    const openInMap = (url: string) => {
        if (url) window.open(url, '_blank', 'noreferrer')
    }

    return (
        <div
            ref={ref}
            className={cn(
                'relative cursor-pointer rounded-md border p-4 transition-all',
                isSelected
                    ? 'border-accent bg-accent/10 shadow-sm'
                    : 'border-transparent hover:bg-muted',
            )}
            onClick={onClick}
        >
            {hasCoordinates && (
                <div
                    className='absolute right-2 top-2'
                    onClick={e => e.stopPropagation()}
                >
                    <DropdownMenu>
                        <Hint
                            label={t('items.options.heading')}
                            side='left'
                            align='end'
                        >
                            <DropdownMenuTrigger asChild>
                                <Button
                                    size='icon'
                                    variant='outline'
                                    className='border-none focus:outline-none'
                                >
                                    <MoreHorizontal className='size-4' />
                                </Button>
                            </DropdownMenuTrigger>
                        </Hint>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuItem
                                onClick={() => openInMap(getGoogleMapsUrl())}
                            >
                                <FaGoogle className='mr-2 size-4' />
                                <span>{t('items.options.viewInGMaps')}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => openInMap(getYandexMapsUrl())}
                            >
                                <FaYandex className='mr-2 size-4' />
                                <span>{t('items.options.viewInYaMaps')}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => openInMap(get2GisUrl())}
                            >
                                <FaMap className='mr-2 size-4' />
                                <span>{t('items.options.viewIn2GisMaps')}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}

            <div className='text-ellipsis pr-4'>
                <ShinyText
                    className='mb-1 w-4/5 font-semibold text-foreground/90'
                    text={location.address}
                />
                {location.formattedAddress && (
                    <p className='mb-2 text-sm text-muted-foreground'>
                        {location.formattedAddress}
                    </p>
                )}
                {location.enhancedDescription && (
                    <p className='mb-2 text-sm'>
                        {location.enhancedDescription}
                    </p>
                )}
                {location.city && (
                    <p className='text-xs text-muted-foreground'>
                        {location.city}
                    </p>
                )}
            </div>
        </div>
    )
})
