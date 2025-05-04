'use client'

import { Button } from '@/components/ui/common/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/common/dropdown-menu'
import ShinyText from '@/components/ui/custom/text/shiny-text'
import { Hint } from '@/components/ui/elements/Hint'
import type { FilmingLocation } from '@/graphql/generated/output'
import { createMapUrls, type MapService } from '@/utils/map-services'
import { cn } from '@/utils/tw-merge'
import { Edit, Flag, Map, MoreHorizontal } from 'lucide-react'
import { forwardRef, useState } from 'react'
import { BsBing } from 'react-icons/bs'
import { FaApple, FaGoogle, FaMap, FaVk, FaYandex } from 'react-icons/fa'
import { EditLocationDialog } from './EditLocationDialog'
import { ReportLocationDialog } from './ReportLocationDialog'

interface TitleFilmingLocationsListItemProps {
    location: NonNullable<FilmingLocation>
    isSelected: boolean
    onClick: () => void
    t: (key: string) => string
}

export const TitleFilmingLocationsListItem = forwardRef<
    HTMLDivElement,
    TitleFilmingLocationsListItemProps
>(({ location, isSelected, onClick, t }, ref) => {
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    const hasCoordinates = !!(
        location.coordinates?.x && location.coordinates?.y
    )
    const mapUrls = hasCoordinates ? createMapUrls(location.coordinates) : null
    const mapServices: MapService[] = mapUrls
        ? [
              {
                  id: 'google',
                  icon: FaGoogle,
                  getUrl: () => mapUrls.google,
                  translationKey: 'viewInGMaps',
              },
              {
                  id: 'yandex',
                  icon: FaYandex,
                  getUrl: () => mapUrls.yandex,
                  translationKey: 'viewInYaMaps',
              },
              {
                  id: 'apple',
                  icon: FaApple,
                  getUrl: () => mapUrls.apple,
                  translationKey: 'viewInAppleMaps',
              },
              {
                  id: '2gis',
                  icon: FaMap,
                  getUrl: () => mapUrls.gis2,
                  translationKey: 'viewIn2GisMaps',
              },
              {
                  id: 'bing',
                  icon: BsBing,
                  getUrl: () => mapUrls.bing,
                  translationKey: 'viewInBingMaps',
              },
              {
                  id: 'vk',
                  icon: FaVk,
                  getUrl: () => mapUrls.vk,
                  translationKey: 'viewInVkMaps',
              },
          ]
        : []

    const openInMap = (url: string) => {
        if (url) window.open(url, '_blank', 'noreferrer')
    }

    const handleStopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    const handleReportClick = (e: React.MouseEvent) => {
        handleStopPropagation(e)
        setIsReportDialogOpen(true)
    }

    const handleEditClick = (e: React.MouseEvent) => {
        handleStopPropagation(e)
        setIsEditDialogOpen(true)
    }

    return (
        <>
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
                            <DropdownMenuLabel>
                                {t('items.options.actionsHeading')}
                            </DropdownMenuLabel>
                            <DropdownMenuItem onClick={handleEditClick}>
                                <Edit className='mr-2 size-4' />
                                <span>{t('items.options.editLocation')}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleReportClick}>
                                <Flag className='mr-2 size-4' />
                                <span>{t('items.options.reportLocation')}</span>
                            </DropdownMenuItem>
                            {hasCoordinates && mapServices.length > 0 && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            <Map className='mr-2 size-4' />
                                            <span>
                                                {t('items.options.viewIn')}
                                            </span>
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent>
                                            {mapServices.map(service => (
                                                <DropdownMenuItem
                                                    key={service.id}
                                                    onClick={() =>
                                                        openInMap(
                                                            service.getUrl(),
                                                        )
                                                    }
                                                >
                                                    <service.icon className='mr-2 size-4' />
                                                    <span>
                                                        {t(
                                                            `items.options.${service.translationKey}`,
                                                        )}
                                                    </span>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuSubContent>
                                    </DropdownMenuSub>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

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
                    <p className='mb-2 text-sm'>
                        {location.description || 'Описания пока нет.'}
                    </p>
                    {location.city && (
                        <p className='text-xs text-muted-foreground'>
                            {location.city}
                        </p>
                    )}
                </div>
            </div>

            <ReportLocationDialog
                isOpen={isReportDialogOpen}
                onClose={() => setIsReportDialogOpen(false)}
                location={location}
            />

            <EditLocationDialog
                isOpen={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                location={location}
            />
        </>
    )
})
