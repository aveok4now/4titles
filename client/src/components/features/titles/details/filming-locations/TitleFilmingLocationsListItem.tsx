'use client'

import { FavoriteButton } from '@/components/features/favorites/FavoriteButton'
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
import { Skeleton } from '@/components/ui/common/skeleton'
import ShinyText from '@/components/ui/custom/text/shiny-text'
import { Hint } from '@/components/ui/elements/Hint'
import type { FilmingLocation, Title } from '@/graphql/generated/output'
import {
    FavoriteType,
    useIsLocationFavoriteQuery,
} from '@/graphql/generated/output'
import { useAuth } from '@/hooks/useAuth'
import { createMapUrls, type MapService } from '@/utils/map-services'
import { cn } from '@/utils/tw-merge'
import { Edit, Flag, Map, MoreHorizontal, Share2 } from 'lucide-react'
import { forwardRef, useState } from 'react'
import { BsBing } from 'react-icons/bs'
import { FaApple, FaGoogle, FaMap, FaVk, FaYandex } from 'react-icons/fa'
import { toast } from 'sonner'
import {
    EditLocationDialog,
    ReportLocationDialog,
    ShareLocationDialog,
} from './dialogs'

interface TitleFilmingLocationsListItemProps {
    location: NonNullable<FilmingLocation>
    isSelected: boolean
    onClick: () => void
    t: (key: string) => string
    title: Title
    locale: string
}

export const TitleFilmingLocationsListItem = forwardRef<
    HTMLDivElement,
    TitleFilmingLocationsListItemProps
>(({ location, isSelected, onClick, t, title, locale }, ref) => {
    const { isAuthenticated } = useAuth()

    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)

    const { data: favoriteData, loading: isLoadingFavorite } =
        useIsLocationFavoriteQuery({
            variables: { locationId: location.id },
            fetchPolicy: 'cache-and-network',
        })
    const initialIsFavorite = favoriteData?.isLocationFavorite

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

    const handleEditClick = (e: React.MouseEvent) => {
        handleStopPropagation(e)

        if (!isAuthenticated) {
            toast.error(t('editDialog.authRequiredMessage'))
            return
        }

        setIsEditDialogOpen(true)
    }

    const handleReportClick = (e: React.MouseEvent) => {
        handleStopPropagation(e)
        setIsReportDialogOpen(true)
    }

    const handleShareClick = (e: React.MouseEvent) => {
        handleStopPropagation(e)

        if (!isAuthenticated) {
            toast.error(t('shareDialog.authRequiredMessage'))
            return
        }

        setIsShareDialogOpen(true)
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
                    className='absolute right-2 top-2 z-10'
                    onClick={handleStopPropagation}
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
                                    variant='ghost'
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
                            <DropdownMenuItem onClick={handleShareClick}>
                                <Share2 className='mr-2 size-4' />
                                <span>{t('items.options.shareLocation')}</span>
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

                <div className='absolute bottom-2 right-2 z-10'>
                    {isLoadingFavorite ? (
                        <Skeleton className='h-8 rounded-md px-3' />
                    ) : (
                        <Hint
                            label={t('items.options.toFavoritesHeading')}
                            side='left'
                            align='end'
                        >
                            <FavoriteButton
                                entityId={location.id}
                                entityType={FavoriteType.Location}
                                initialIsFavorite={initialIsFavorite}
                                size='icon'
                                variant='ghost'
                            />
                        </Hint>
                    )}
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
                title={title}
            />

            <ShareLocationDialog
                isOpen={isShareDialogOpen}
                onClose={() => setIsShareDialogOpen(false)}
                location={location}
                title={title}
                locale={locale}
            />
        </>
    )
})
