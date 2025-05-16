'use client'

import { FavoriteButton } from '@/components/features/favorites/FavoriteButton'
import { FilmingLocationCommentsDrawer } from '@/components/features/filming-locations/FilmingLocationCommentsDrawer'
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
import { Link } from '@/components/ui/elements/Link'
import { ProfileAvatar } from '@/components/ui/elements/ProfileAvatar'
import {
    CommentableType,
    FavorableType,
    useGetCommentCountQuery,
    useIsFavoriteQuery,
    type FilmingLocation,
    type Title,
} from '@/graphql/generated/output'
import { useAuth } from '@/hooks/useAuth'
import { createMapUrls, type MapService } from '@/utils/map-services'
import { cn } from '@/utils/tw-merge'
import {
    Edit,
    Flag,
    Map,
    MessageCircle,
    MoreHorizontal,
    Share2,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import NextLink from 'next/link'
import { forwardRef, useCallback, useEffect, useState } from 'react'
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
    t?: (key: string) => string
    title: Title
    initialIsFavorite?: boolean
    onFavoriteChange?: (
        locationId: string,
        titleId: string,
        isFavorite: boolean,
    ) => void
}

export const TitleFilmingLocationsListItem = forwardRef<
    HTMLDivElement,
    TitleFilmingLocationsListItemProps
>(
    (
        {
            location,
            isSelected,
            onClick,
            t,
            title,
            initialIsFavorite,
            onFavoriteChange,
        },
        ref,
    ) => {
        const flItemT = t ?? useTranslations('titleDetails.filmingLocations')

        const { isAuthenticated } = useAuth()

        const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
        const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
        const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
        const [isCommentsDrawerOpen, setIsCommentsDrawerOpen] = useState(false)

        const [localIsFavorite, setLocalIsFavorite] = useState<
            boolean | undefined
        >(initialIsFavorite)

        const { data: favoriteData, loading: isLoadingFavorite } =
            useIsFavoriteQuery({
                variables: {
                    input: {
                        favorableId: location.id,
                        contextId: title.id,
                        favorableType: FavorableType.Location,
                    },
                },
                fetchPolicy: 'cache-first',
                skip: initialIsFavorite !== undefined,
            })

        useEffect(() => {
            if (initialIsFavorite !== undefined) {
                setLocalIsFavorite(initialIsFavorite)
            } else if (favoriteData?.isFavorite !== undefined) {
                setLocalIsFavorite(favoriteData.isFavorite)
            }
        }, [favoriteData, initialIsFavorite])

        const isFavorite = localIsFavorite ?? false

        const { data: commentCountData } = useGetCommentCountQuery({
            variables: {
                input: {
                    commentableId: location.id,
                    commentableType: CommentableType.Location,
                },
            },
            fetchPolicy: 'cache-first',
        })

        const commentCount = commentCountData?.getCommentCount

        const hasCoordinates = !!(
            location.coordinates?.x && location.coordinates?.y
        )
        const mapUrls = hasCoordinates
            ? createMapUrls(location.coordinates)
            : null
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
                toast.error(flItemT('editDialog.authRequiredMessage'))
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
                toast.error(flItemT('shareDialog.authRequiredMessage'))
                return
            }

            setIsShareDialogOpen(true)
        }

        const handleCommentsClick = (e: React.MouseEvent) => {
            handleStopPropagation(e)
            setIsCommentsDrawerOpen(true)
        }

        const handleFavoriteChange = useCallback(
            (newStatus: boolean) => {
                setLocalIsFavorite(newStatus)

                if (onFavoriteChange) {
                    onFavoriteChange(location.id, title.id, newStatus)
                }
            },
            [location.id, title.id, onFavoriteChange],
        )

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
                        className='absolute right-2 top-2 z-10 flex flex-row items-center gap-1'
                        onClick={handleStopPropagation}
                    >
                        <Hint
                            label={flItemT('items.options.toFavoritesHeading')}
                            side='left'
                            align='end'
                        >
                            {isLoadingFavorite ? (
                                <Skeleton className='size-9 rounded-md' />
                            ) : (
                                <FavoriteButton
                                    favorableId={location.id}
                                    favorableContextId={title.id}
                                    favorableType={FavorableType.Location}
                                    initialIsFavorite={isFavorite}
                                    size='icon'
                                    variant='ghost'
                                    onSuccess={handleFavoriteChange}
                                />
                            )}
                        </Hint>
                        <Hint
                            label={flItemT('items.options.heading')}
                            side='left'
                            align='end'
                        >
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        size='icon'
                                        variant='ghost'
                                        className='border-none focus:outline-none'
                                    >
                                        <MoreHorizontal className='size-4' />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                    <DropdownMenuLabel>
                                        {flItemT(
                                            'items.options.actionsHeading',
                                        )}
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem onClick={handleEditClick}>
                                        <Edit className='mr-2 size-4' />
                                        <span>
                                            {flItemT(
                                                'items.options.editLocation',
                                            )}
                                        </span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={handleReportClick}
                                    >
                                        <Flag className='mr-2 size-4' />
                                        <span>
                                            {flItemT(
                                                'items.options.reportLocation',
                                            )}
                                        </span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={handleShareClick}
                                    >
                                        <Share2 className='mr-2 size-4' />
                                        <span>
                                            {flItemT(
                                                'items.options.shareLocation',
                                            )}
                                        </span>
                                    </DropdownMenuItem>
                                    {hasCoordinates &&
                                        mapServices.length > 0 && (
                                            <>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger>
                                                        <Map className='mr-2 size-4' />
                                                        <span>
                                                            {flItemT(
                                                                'items.options.viewIn',
                                                            )}
                                                        </span>
                                                    </DropdownMenuSubTrigger>
                                                    <DropdownMenuSubContent>
                                                        {mapServices.map(
                                                            service => (
                                                                <DropdownMenuItem
                                                                    key={
                                                                        service.id
                                                                    }
                                                                    onClick={() =>
                                                                        openInMap(
                                                                            service.getUrl(),
                                                                        )
                                                                    }
                                                                >
                                                                    <service.icon className='mr-2 size-4' />
                                                                    <span>
                                                                        {flItemT(
                                                                            `items.options.${service.translationKey}`,
                                                                        )}
                                                                    </span>
                                                                </DropdownMenuItem>
                                                            ),
                                                        )}
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuSub>
                                            </>
                                        )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </Hint>
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
                            {location.description ||
                                flItemT('items.description.empty')}
                        </p>
                        {location.city && (
                            <p className='text-xs text-muted-foreground'>
                                {location.city}
                            </p>
                        )}
                        {location.user && (
                            <div className='mt-2 flex items-end gap-2'>
                                <span className='text-xs text-muted-foreground'>
                                    {flItemT('items.author.heading')}:{' '}
                                    <Link href={'/' + location.user.username}>
                                        {location.user.username}
                                    </Link>
                                </span>
                                <Hint
                                    label={flItemT('items.author.openProfile')}
                                    side='right'
                                    align='end'
                                >
                                    <NextLink
                                        href={'/' + location.user.username}
                                    >
                                        <ProfileAvatar
                                            profile={{
                                                username:
                                                    location.user.username,
                                                avatar: location.user.avatar,
                                            }}
                                            size='sm'
                                        />
                                    </NextLink>
                                </Hint>
                            </div>
                        )}
                        <div
                            className='absolute bottom-2 right-2 flex items-center gap-1'
                            onClick={handleStopPropagation}
                        >
                            <Hint
                                label={flItemT('comments.hint')}
                                side='left'
                                align='end'
                            >
                                <Button
                                    onClick={handleCommentsClick}
                                    size='icon'
                                    variant='ghost'
                                    className={cn(
                                        'px-1',
                                        commentCount && commentCount > 0
                                            ? 'w-10 px-4'
                                            : '',
                                    )}
                                >
                                    <MessageCircle className='size-4' />
                                    {commentCount && commentCount > 0 ? (
                                        <span className='text-xs'>
                                            {commentCount >= 9
                                                ? '9+'
                                                : commentCount}
                                        </span>
                                    ) : null}
                                </Button>
                            </Hint>
                        </div>
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
                />

                <FilmingLocationCommentsDrawer
                    isOpen={isCommentsDrawerOpen}
                    onClose={() => setIsCommentsDrawerOpen(false)}
                    location={location}
                    title={title}
                />
            </>
        )
    },
)
